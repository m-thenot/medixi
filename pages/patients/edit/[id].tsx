import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";

export const PatientEdit: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { formProps, saveButtonProps, queryResult } = useForm({
    meta: { fields: ["id", "firstname", "lastname", "birth_date"] },
  });

  const patientsData = queryResult?.data?.data;

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      title={`Modifier - ${patientsData?.firstname} ${patientsData?.lastname}`}
    >
      <Form
        {...formProps}
        initialValues={{
          ...formProps.initialValues,
          birth_date: dayjs(formProps?.initialValues?.birth_date || null),
        }}
        layout="vertical"
      >
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
    </Edit>
  );
};

export default PatientEdit;

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
          "/patients"
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
