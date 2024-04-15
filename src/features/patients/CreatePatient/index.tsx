"use client";

import React, { useRef, useState } from "react";
import { IResourceComponentsProps, useCreate } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Col, DatePicker, Form, Row, Input, Typography, Button } from "antd";
import FileUploader from "@components/FileUploader";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IFile } from "@types";
import { logger } from "src/services/logger";

const { Title } = Typography;
const { TextArea } = Input;

const getStudiesUuid = async (keys: string) => {
  const response = await fetch(`/api/files/dicom-parser?keys=${keys}`);

  if (!response.ok) {
    logger.error("Failed to get studies uuid");
    return null;
  }

  const { files } = await response.json();

  return files;
};

interface ICreatePatient {
  firstname: string;
  lastname: string;
  birth_date: number;
  examination_type: string;
  examination_date: string;
  description: string;
}

const CreatePatient: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { formProps } = useForm<ICreatePatient>();
  const submitButton = useRef<HTMLElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<IFile[]>([]);

  const { mutate } = useCreate();

  const onFinish = async (values: ICreatePatient) => {
    setIsLoading(true);

    const studiesUuid: { studyInstanceUid: string; key: string }[] =
      await getStudiesUuid(files.map((file) => file.key).join(","));
    const mergedMap = new Map();

    files.forEach((item) =>
      mergedMap.set(item.key, { ...mergedMap.get(item.key), ...item })
    );
    studiesUuid.forEach((item) =>
      mergedMap.set(item.key, { ...mergedMap.get(item.key), ...item })
    );
    const completedFiles = Array.from(mergedMap.values());

    const {
      firstname,
      lastname,
      birth_date,
      examination_date,
      examination_type,
      description
    } = values;
    mutate(
      {
        resource: "patients",
        values: {
          firstname,
          lastname,
          birth_date,
          examinations: {
            data: [
              {
                state: "new",
                examination_date,
                examination_type,
                description,
                files: completedFiles
              }
            ]
          }
        },
        meta: {
          fields: ["id"]
        },
        errorNotification: (_data, _values, _resource) => {
          return {
            message: t("notifications.defaultErrorMessage"),
            description: t("notifications.defaultErrorTitle"),
            type: "error"
          };
        }
      },
      {
        onError: (_error, _variables, _context) => {
          setIsLoading(false);
        },
        onSuccess: (_data, _variables, _context) => {
          setIsLoading(false);
          router.push("/patients");
        }
      }
    );
  };

  return (
    <Create
      saveButtonProps={{
        onClick: () => {
          submitButton.current?.click();
        },
        loading: isLoading
      }}
      title={t("patients.create.title")}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values: any) => onFinish(values)}
      >
        <Row gutter={24}>
          <Col span={12}>
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
          </Col>

          <Col span={12}>
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
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
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
              <DatePicker
                placeholder={t("patients.fields.birthDatePlaceholder")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Title level={4}>{t("patients.create.examTitle")}</Title>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={t("patients.fields.examType")}
              name={["examination_type"]}
              rules={[
                {
                  required: true,
                  message: t("form.fields.required")
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("patients.fields.examDate")}
              name={["examination_date"]}
              rules={[
                {
                  required: true,
                  message: t("form.fields.required")
                }
              ]}
            >
              <DatePicker
                placeholder={t("patients.fields.examDatePlaceholder")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t("patients.fields.examDetails")}
          name={["description"]}
          rules={[
            {
              required: true,
              message: t("form.fields.required")
            }
          ]}
        >
          <TextArea />
        </Form.Item>

        <div className="ant-form-item-label">
          <label className="ant-form-item-required">
            <span style={{ color: "#dc4446" }}>*</span>{" "}
            {t("patients.fields.examDocuments")}
          </label>
        </div>

        <FileUploader setFiles={setFiles} />
        <Button hidden ref={submitButton} type="primary" htmlType="submit" />
      </Form>
    </Create>
  );
};

export default CreatePatient;
