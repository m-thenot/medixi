import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { DatePicker, Form, Input } from "antd";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

const PatientCreate: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { formProps, saveButtonProps } = useForm({
    meta: { fields: ["id", "firstname", "lastname", "birth_date"] },
  });

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={translate("patients.create.title")}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={translate("patients.fields.firstname")}
          name={["firstname"]}
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
          label={translate("patients.fields.lastname")}
          name={["lastname"]}
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
          label={translate("patients.fields.birthDate")}
          name={["birth_date"]}
          rules={[
            {
              required: true,
              message: translate("form.fields.required"),
            },
          ]}
        >
          <DatePicker
            placeholder={translate("patients.fields.birthDatePlaceholder")}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};

export default PatientCreate;

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
          "/patients/create"
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
