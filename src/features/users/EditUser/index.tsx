"use client";

import React, { useRef, useState } from "react";
import { useNotification } from "@refinedev/core";
import { Edit } from "@refinedev/antd";
import { Button, Form, Input, Skeleton } from "antd";
import { User } from "@kinde-oss/kinde-typescript-sdk/dist/types";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { updateUser } from "src/actions";

interface IUserEditProps {
  user: User;
}

export const EditUser: React.FC<IUserEditProps> = ({ user }) => {
  const { t } = useTranslation();
  const { firstName, lastName, preferredEmail } = user;
  const submitButton = useRef<HTMLElement>(null);
  const params = useParams<{ id: string }>();

  const { open } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({
    firstName,
    lastName
  }: {
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);

    try {
      await updateUser({
        givenName: firstName,
        familyName: lastName,
        id: params.id
      });

      setIsLoading(false);
      open?.({
        type: "success",
        description: t("users.update.notifications.title"),
        message: t("users.update.notifications.message"),
        undoableTimeout: 5
      });

      close();
    } catch (e) {
      setIsLoading(false);
      open?.({
        type: "error",
        description: t("notifications.defaultErrorTitle"),
        message: t("notifications.defaultErrorMessage"),
        undoableTimeout: 5
      });
    }
  };

  return (
    <Edit
      saveButtonProps={{
        onClick: () => {
          submitButton.current?.click();
        },
        loading: isLoading
      }}
      title={`Modifier - ${firstName} ${lastName}`}
    >
      <Form layout="vertical" onFinish={(values: any) => onSubmit(values)}>
        <Form.Item
          label={t("users.fields.firstname")}
          name={["firstName"]}
          initialValue={firstName}
          rules={[
            {
              required: true,
              message: t("form.fields.required")
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("users.fields.lastname")}
          name={["lastName"]}
          initialValue={lastName}
          rules={[
            {
              required: true,
              message: t("form.fields.required")
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("users.fields.email")}
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

export default EditUser;
