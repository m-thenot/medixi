const AUTH_API_URL = process.env.KINDE_ISSUER_URL;

export const fetchToken = async () => {
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

  if (!resToken.ok) {
    throw new Error("Failed to fetch token");
  }

  return resToken.json();
};

export const fetchUserByEmail = async (email: string, token: string) => {
  const getUserResponse = await fetch(
    `${AUTH_API_URL}/api/v1/users?email=${email}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!getUserResponse.ok) {
    return null;
  }

  return getUserResponse.json();
};

export const createUser = async (
  firstname: string,
  lastname: string,
  email: string,
  token: string
) => {
  const createUserResponse = await fetch(`${AUTH_API_URL}/api/v1/user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
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

  if (!createUserResponse.ok) {
    throw new Error("Failed to create user");
  }

  return createUserResponse.json();
};

export const addUserToOrganization = async (
  userId: string,
  orgCode: string,
  token: string
) => {
  const addToOrganizationResponse = await fetch(
    `${AUTH_API_URL}/api/v1/organizations/${orgCode}/users`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        users: [
          {
            id: userId
          }
        ]
      })
    }
  );

  if (!addToOrganizationResponse.ok) {
    throw new Error("Failed to add user to the organization");
  }
};
