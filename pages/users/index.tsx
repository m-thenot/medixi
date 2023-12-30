"use client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { createKindeManagementAPIClient } from "@kinde-oss/kinde-auth-nextjs/server";
import { BaseRecord, useTranslate } from "@refinedev/core";
import { DeleteButton, EditButton, ShowButton } from "@refinedev/antd";
import { Space, Table, Typography } from "antd";
import { User } from "@kinde-oss/kinde-typescript-sdk/dist/types";
const { Title } = Typography;

interface IUsersListProps {
  users: User[];
}

const UsersList: React.FC<IUsersListProps> = ({ users }) => {
  const translate = useTranslate();

  return (
    <>
      <Title level={4}>{translate("users.list.title")}</Title>

      <Table dataSource={users} rowKey="id">
        <Table.Column
          dataIndex="firstName"
          title={translate("users.fields.firstname")}
        />
        <Table.Column
          dataIndex="lastName"
          title={translate("users.fields.lastname")}
        />
        <Table.Column
          dataIndex="email"
          title={translate("users.fields.email")}
        />
        <Table.Column
          dataIndex="createdOn"
          title={translate("users.fields.createdOn")}
        />
        <Table.Column
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default UsersList;

export const getServerSideProps = async ({
  req,
  res,
  locale,
}: {
  req: Request;
  res: Response;
  locale: string;
}) => {
  const { isAuthenticated } = getKindeServerSession(req, res);
  const isLoggedIn = await isAuthenticated();

  const translateProps = await serverSideTranslations(locale ?? "en", [
    "common",
  ]);

  if (!isLoggedIn) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `/api/auth/login?post_login_redirect_url=${encodeURIComponent(
          "/users"
        )}`,
        permanent: false,
      },
    };
  }

  const client = await createKindeManagementAPIClient(req, res);
  const users = await client.usersApi.getUsers();

  return {
    props: {
      ...translateProps,
      users: JSON.parse(JSON.stringify(users.users)),
    },
  };
};
