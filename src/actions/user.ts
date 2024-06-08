"use server";
import { revalidatePath } from "next/cache";
import InviteUserEmail from "src/emails/UserInvitation";
import {
  addUserToOrganization,
  createUser,
  fetchToken,
  fetchUserByEmail,
  sendEmail
} from "src/services";
import { logger } from "src/services/logger";
import { createKindeManagementAPIClient } from "@kinde-oss/kinde-auth-nextjs/server";

interface IInviteUserToOrganizationParams {
  firstname: string;
  lastname: string;
  email: string;
  orgCode: string;
  orgName: string;
  invitedByFirstname: string;
}

export const inviteUserToOrganization = async ({
  firstname,
  lastname,
  email,
  orgCode,
  orgName,
  invitedByFirstname
}: IInviteUserToOrganizationParams) => {
  try {
    const tokenData = await fetchToken();
    const token = tokenData.access_token;

    let user = await fetchUserByEmail(email, token);

    if (user && user.users && user.users.length > 0) {
      logger.log("User already exists. Adding user to the organization.", {
        email
      });
      await addUserToOrganization(user.users[0].id, orgCode, token);

      revalidatePath("/users");

      return;
    }

    user = await createUser(firstname, lastname, email, token);
    await addUserToOrganization(user.id, orgCode, token);

    const { error } = await sendEmail({
      to: email,
      subject: `${invitedByFirstname} vous a invité sur Medixi !`,
      react: InviteUserEmail({
        invitedByFirstname,
        firstname,
        orgName,
        inviteLink: `${process.env.KINDE_SITE_URL}/api/auth/login?login_hint=${email}`
      })
    });

    if (error) {
      throw new Error("Failed to send user invitation email");
    }

    revalidatePath("/users");

    return;
  } catch (e: any) {
    logger.error("Failed to create user", { e, email });
    throw new Error(e.message || "Failed to create user");
  }
};

interface IUpdateUser {
  givenName: string;
  familyName: string;
  id: string;
}

export const updateUser = async ({
  givenName,
  familyName,
  id
}: IUpdateUser) => {
  try {
    const client = await createKindeManagementAPIClient();
    await client.usersApi.updateUser({
      id: id,
      updateUserRequest: { givenName, familyName }
    });

    revalidatePath("/users/" + id);

    return;
  } catch (e: any) {
    logger.error("Failed to update user", { e, userId: id });

    throw new Error(e.message || "Failed to update user");
  }
};
