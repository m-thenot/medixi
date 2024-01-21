import { createKindeManagementAPIClient } from "@kinde-oss/kinde-auth-nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { givenName, familyName, id } = req.body;

  try {
    const client = await createKindeManagementAPIClient(req, res);
    await client.usersApi.updateUser({
      id: id,
      updateUserRequest: { givenName, familyName },
    });

    res.status(200).json({ message: "User updated with success !" });
  } catch (e) {
    console.error("Failed to update user", { e, userId: id });
    res.status(500).json({ error: e });
  }
}
