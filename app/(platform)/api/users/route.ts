import { NextResponse } from "next/server";
import InviteUserEmail from "src/emails/UserInvitation";
import { sendEmail } from "src/services/email";
import { createKindeManagementAPIClient } from "@kinde-oss/kinde-auth-nextjs/server";
import { logger } from "src/services/logger";

const AUTH_API_URL = process.env.KINDE_ISSUER_URL;

export async function POST(request: Request) {
  const { firstname, lastname, email, orgCode, orgName, invitedByFirstname } =
    await request.json();

  try {
    const resToken = await fetch(`${AUTH_API_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        audience: process.env.KINDE_AUDIENCE!,
        grant_type: "client_credentials",
        client_id: process.env.KINDE_API_CLIENT_ID!,
        client_secret: process.env.KINDE_API_CLIENT_SECRET!
      })
    });

    const token = await resToken.json();

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`
      }
    };

    const createUserResponse = await fetch(`${AUTH_API_URL}/api/v1/user`, {
      ...requestOptions,
      body: JSON.stringify({
        profile: {
          given_name: firstname,
          family_name: lastname
        },
        identities: [
          {
            type: "email",
            details: {
              email: email
            }
          }
        ]
      })
    });

    if (createUserResponse.ok) {
      const user = await createUserResponse.json();

      const addToOrganizationResponse = await fetch(
        `${AUTH_API_URL}/api/v1/organizations/${orgCode}/users`,
        {
          ...requestOptions,
          body: JSON.stringify({
            users: [
              {
                id: user.id
              }
            ]
          })
        }
      );

      if (!addToOrganizationResponse.ok) {
        logger.error("Failed to add user to the organization", {
          email,
          orgCode
        });
        throw new Error("Failed to add user to the organization");
      }
    } else {
      logger.error("Failed to create the user", { email, orgCode });
      throw new Error("Failed to create the user");
    }

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
      logger.error("Failed to send user invitation email", {
        email,
        orgCode,
        error
      });
      throw new Error("Failed to send user invitation email");
    }

    return new NextResponse("User created with success !", {
      status: 200
    });
  } catch (e: any) {
    logger.error("Failed to create user", { e, email });

    return NextResponse.json(
      { message: e.message || "Failed to create user" },
      { status: e.status || 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const { givenName, familyName, id } = await request.json();

  try {
    const client = await createKindeManagementAPIClient();
    await client.usersApi.updateUser({
      id: id,
      updateUserRequest: { givenName, familyName }
    });

    return new NextResponse("User updated with success !", {
      status: 200
    });
  } catch (e: any) {
    logger.error("Failed to update user", { e, userId: id });

    return NextResponse.json(
      { message: e.message || "Failed to update user" },
      { status: e.status || 500 }
    );
  }
}
