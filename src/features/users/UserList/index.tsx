"use client";

import { BaseRecord, useNotification } from "@refinedev/core";
import { DateField, EditButton, List, useModalForm } from "@refinedev/antd";
import { Button, Form, Input, Modal, Space, Table } from "antd";
import { User } from "@kinde-oss/kinde-typescript-sdk/dist/types";
import { useRef, useState } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Organization } from "@kinde-oss/kinde-typescript-sdk";

import { useTranslation } from "react-i18next";
import { inviteUserToOrganization } from "src/actions";

interface IUserListProps {
  users: User[];
  organization: Organization;
}

const UserList: React.FC<IUserListProps> = ({ users, organization }) => {
  const { t } = useTranslation();
  const { user } = useKindeAuth();
  const { open } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const submitButton = useRef<HTMLElement>(null);
  const {
    show: createModalShow,
    close,
    modalProps: createModalProps,
    formProps: createFormProps
  } = useModalForm({
    action: "create",
    warnWhenUnsavedChanges: false
  });

  const onSubmit = async ({
    email,
    firstname,
    lastname
  }: {
    email: string;
    firstname: string;
    lastname: string;
  }) => {
    setIsLoading(true);

    try {
      await inviteUserToOrganization({
        email,
        firstname,
        lastname,
        orgCode: organization.code!,
        orgName: organization.name!,
        invitedByFirstname: user?.given_name!
      });

      setIsLoading(false);
      open?.({
        type: "success",
        description: t("users.add.notifications.title"),
        message: t("users.add.notifications.message", { email }),
        undoableTimeout: 5
      });

      close();
    } catch {
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
    <>
      <Modal
        {...createModalProps}
        okText={t("users.add.submitButton")}
        title={t("users.add.button")}
        style={{ maxWidth: 600 }}
        okButtonProps={{
          onClick: () => {
            submitButton.current?.click();
          },
          loading: isLoading
        }}
      >
        <Form
          {...createFormProps}
          layout="vertical"
          onFinish={(values: any) => onSubmit(values)}
        >
          <Form.Item
            label={t("users.fields.firstname")}
            name="firstname"
            validateTrigger="onBlur"
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
            name="lastname"
            validateTrigger="onBlur"
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
            label="Email"
            name="email"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                type: "email",
                message: t("users.add.invalidEmail")
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Button hidden ref={submitButton} type="primary" htmlType="submit" />
        </Form>
      </Modal>
      <List
        createButtonProps={{
          children: t("users.add.button"),
          onClick: () => {
            createModalShow();
          }
        }}
      >
        <Table scroll={{ x: true }} dataSource={users} rowKey="id">
          <Table.Column
            dataIndex="firstName"
            title={t("users.fields.firstname")}
          />
          <Table.Column
            dataIndex="lastName"
            title={t("users.fields.lastname")}
          />
          <Table.Column dataIndex="email" title={t("users.fields.email")} />
          <Table.Column
            dataIndex="createdOn"
            title={t("users.fields.createdOn")}
            render={(value) => <DateField value={value} locales="fr" />}
          />
          <Table.Column
            dataIndex="totalSignIns"
            title={t("users.fields.status")}
            render={(value) =>
              value > 0
                ? t("users.list.status.active")
                : t("users.list.status.invitationPending")
            }
          />
          <Table.Column
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                {/*                 <DeleteButton hideText size="small" recordItemId={record.id} />
                 */}{" "}
              </Space>
            )}
          />
        </Table>
      </List>
    </>
  );
};

export default UserList;
