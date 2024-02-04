import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  createKindeManagementAPIClient,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import React, { useRef, useState } from "react";
import {
  IResourceComponentsProps,
  useNotification,
  useTranslate,
} from "@refinedev/core";
import { Edit } from "@refinedev/antd";
import { Button, Form, Input } from "antd";
import { User } from "@kinde-oss/kinde-typescript-sdk/dist/types";
import { useRouter } from "next/router";

interface IUserEditProps extends IResourceComponentsProps {
  user: User;
}

export const UserEdit: React.FC<IUserEditProps> = ({ user }) => {
  const translate = useTranslate();
  const { firstName, lastName, preferredEmail } = user;
  const submitButton = useRef<HTMLElement>(null);
  const router = useRouter();
  const { open } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({
    firstName,
    lastName,
  }: {
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        givenName: firstName,
        familyName: lastName,
        id: router.query.id,
      }),
    };
    const result = await fetch("/api/users/update", requestOptions);

    if (result.ok) {
      setIsLoading(false);
      open?.({
        type: "success",
        description: translate("users.update.notifications.title"),
        message: translate("users.update.notifications.message"),
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
    <Edit
      saveButtonProps={{
        onClick: () => {
          submitButton.current?.click();
        },
        loading: isLoading,
      }}
      title={`Modifier - ${firstName} ${lastName}`}
    >
      <Form layout="vertical" onFinish={(values: any) => onSubmit(values)}>
        <Form.Item
          label={translate("users.fields.firstname")}
          name={["firstName"]}
          initialValue={firstName}
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
          name={["lastName"]}
          initialValue={lastName}
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
          label={translate("users.fields.email")}
          name={["email"]}
          initialValue={preferredEmail}
        >
          <Input disabled />
        </Form.Item>
        <Button hidden ref={submitButton} type="primary" htmlType="submit" />
      </Form>
    </Edit>
  );
};

export default UserEdit;

export const getServerSideProps = async ({
  req,
  res,
  params,
  locale,
}: {
  req: Request;
  res: Response;
  locale: string;
  params: any;
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
  const user = await client.usersApi.getUserData({ id: params.id });

  return {
    props: {
      ...translateProps,
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};
