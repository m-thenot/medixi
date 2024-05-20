import { createKindeManagementAPIClient } from "@kinde-oss/kinde-auth-nextjs/server";
import EditUser from "@features/users/EditUser";

const Page = async ({ params }: { params: { id: string } }) => {
  const client = await createKindeManagementAPIClient();
  const user = await client.usersApi.getUserData({ id: params.id });

  return <EditUser user={user} />;
};

export default Page;
