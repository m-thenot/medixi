import UserList from "@features/users/UserList";
import {
  createKindeManagementAPIClient,
  getKindeServerSession
} from "@kinde-oss/kinde-auth-nextjs/server";

const Page = async () => {
  const { getAccessToken } = getKindeServerSession();
  const accessToken = await getAccessToken();
  const client = await createKindeManagementAPIClient();

  const organizationUsers = await client.organizationsApi.getOrganizationUsers({
    orgCode: (accessToken as any)?.["x-hasura-org-code"],
    pageSize: 100
  });
  const users = await client.usersApi.getUsers({ pageSize: 100 });
  const organization = await client.organizationsApi.getOrganization({
    code: (accessToken as any)?.["x-hasura-org-code"]
  });

  const filterUsers = users.users?.filter((user) =>
    organizationUsers.organizationUsers?.some(
      (orgUser) => orgUser.id === user.id
    )
  );

  return <UserList users={filterUsers!} organization={organization} />;
};

export default Page;
