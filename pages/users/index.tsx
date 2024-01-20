"use client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  createKindeManagementAPIClient,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import {
  BaseRecord,
  useInvalidate,
  useNotification,
  useTranslate,
} from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useModalForm,
} from "@refinedev/antd";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import { User } from "@kinde-oss/kinde-typescript-sdk/dist/types";
import { useRef, useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/router";

interface IUsersListProps {
  users: User[];
}

const UsersList: React.FC<IUsersListProps> = ({ users }) => {
  const translate = useTranslate();
  const { accessToken } = useKindeAuth();
  const { open } = useNotification();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const submitButton = useRef<HTMLElement>(null);
  const {
    show: createModalShow,
    close,
    modalProps: createModalProps,
    formProps: createFormProps,
  } = useModalForm({
    action: "create",
    warnWhenUnsavedChanges: false,
  });

  const onSubmit = async ({
    email,
    firstname,
    lastname,
  }: {
    email: string;
    firstname: string;
    lastname: string;
  }) => {
    setIsLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        firstname,
        lastname,
        orgCode: (accessToken as any)["x-hasura-org-code"],
      }),
    };
    const result = await fetch("/api/users/create", requestOptions);

    if (result.ok) {
      setIsLoading(false);
      open?.({
        type: "success",
        description: translate("users.add.notifications.title"),
        message: translate("users.add.notifications.message"),
        undoableTimeout: 5,
      });

      router.replace(router.asPath);

      close();
    } else {
      setIsLoading(false);
      open?.({
        type: "error",
        description: translate("notifications.defaultErrorTitle"),
        message: translate("notifications.defaultErrorMessage"),
        undoableTimeout: 5,
      });
    }
  };

  return (
    <>
      <Modal
        {...createModalProps}
        okText={translate("users.add.submitButton")}
        title={translate("users.add.button")}
        style={{ maxWidth: 600 }}
        okButtonProps={{
          onClick: () => {
            submitButton.current?.click();
          },
          loading: isLoading,
        }}
      >
        <Form
          {...createFormProps}
          layout="vertical"
          onFinish={(values: any) => onSubmit(values)}
        >
          <Form.Item
            label={translate("users.fields.firstname")}
            name="firstname"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: translate("form.fields.required"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={translate("users.fields.lastname")}
            name="lastname"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: translate("form.fields.required"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                type: "email",
                message: translate("users.add.invalidEmail"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button hidden ref={submitButton} type="primary" htmlType="submit" />
        </Form>
      </Modal>
      <List
        createButtonProps={{
          children: translate("users.add.button"),
          onClick: () => {
            createModalShow();
          },
        }}
      >
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
      </List>
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
