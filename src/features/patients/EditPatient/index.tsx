"use client";

import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export const EditPatient: React.FC = () => {
  const { t } = useTranslation();
  const { formProps, saveButtonProps, queryResult } = useForm({
    meta: { fields: ["id", "firstname", "lastname", "birth_date"] }
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
          birth_date: dayjs(formProps?.initialValues?.birth_date || null)
        }}
        layout="vertical"
      >
        <Form.Item
          label={t("patients.fields.firstname")}
          name={["firstname"]}
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
          label={t("patients.fields.lastname")}
          name={["lastname"]}
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
          label={t("patients.fields.birthDate")}
          name={["birth_date"]}
          rules={[
            {
              required: true,
              message: t("form.fields.required")
            }
          ]}
        >
          <DatePicker placeholder={t("patients.fields.birthDatePlaceholder")} />
        </Form.Item>
      </Form>
    </Edit>
  );
};

export default EditPatient;
