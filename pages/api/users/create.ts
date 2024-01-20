import type { NextApiRequest, NextApiResponse } from "next";

const AUTH_API_URL = process.env.KINDE_ISSUER_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstname, lastname, email, orgCode } = req.body;

  try {
    const resToken = await fetch(`${AUTH_API_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        audience: process.env.KINDE_AUDIENCE!,
        grant_type: "client_credentials",
        client_id: process.env.KINDE_API_CLIENT_ID!,
        client_secret: process.env.KINDE_API_CLIENT_SECRET!,
      }),
    });

    const token = await resToken.json();

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
    };

    const createUserResponse = await fetch(`${AUTH_API_URL}/api/v1/user`, {
      ...requestOptions,
      body: JSON.stringify({
        profile: {
          given_name: firstname,
          family_name: lastname,
        },
        identities: [
          {
            type: "email",
            details: {
              email: email,
            },
          },
        ],
      }),
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
                id: user.id,
              },
            ],
          }),
        }
      );

      if (!addToOrganizationResponse.ok) {
        console.error("Failed to add user to the organization", {
          email,
          orgCode,
        });
        throw new Error("Failed to add user to the organization");
      }
    } else {
      console.error("Failed to create the user", { email, orgCode });
      throw new Error("Failed to create the user");
    }

    res.status(200).json({ message: "User created with success !" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
