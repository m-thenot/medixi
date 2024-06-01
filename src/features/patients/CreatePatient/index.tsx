"use client";

import React, { useRef, useState } from "react";
import {
  IResourceComponentsProps,
  useCreate,
  useNotification
} from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import {
  Col,
  DatePicker,
  Form,
  Row,
  Input,
  Typography,
  Button,
  Select
} from "antd";
import FileUploader from "@components/FileUploader";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ExaminationState, ExaminationType, IFile, InputPatient } from "@types";
import { logger } from "src/services/logger";

const { Title } = Typography;
const { TextArea } = Input;

const getStudiesUuid = async (
  keys: string
): Promise<{ studyInstanceUid: string; key: string }[] | null> => {
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
  examination_date: number;
  description: string;
}

const CreatePatient: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { formProps } = useForm<ICreatePatient>();
  const submitButton = useRef<HTMLElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { open } = useNotification();

  const { mutate } = useCreate();

  const onFinish = async (values: ICreatePatient) => {
    setIsLoading(true);

    try {
      const uploadedFiles = await uploadFiles(files);
      const studiesUuid = await getStudiesUuid(
        uploadedFiles.map((file) => file.key).join(",")
      );
      const completedFiles = mergeFileData(uploadedFiles, studiesUuid);

      const {
        firstname,
        lastname,
        birth_date,
        examination_date,
        examination_type,
        description
      } = values;
      await createPatient({
        firstname,
        lastname,
        birth_date,
        examinations: {
          data: [
            {
              state: ExaminationState.TO_REVIEW,
              examination_date,
              examination_type,
              description,
              files: completedFiles
            }
          ]
        }
      });

      setIsLoading(false);
      router.push("/patients");
    } catch (error) {
      setIsLoading(false);
      logger.error("Error during patient creation:", error);
      open?.({
        type: "error",
        description: t("notifications.defaultErrorTitle"),
        message: t("notifications.defaultErrorMessage"),
        undoableTimeout: 5
      });
    }
  };

  const uploadFiles = async (files: File[]): Promise<IFile[]> => {
    return await Promise.all(
      files.map(async (file) => {
        const response = await fetch("/api/patients/files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type
          })
        });

        if (!response.ok) {
          throw new Error("Failed to get pre-signed URL.");
        }

        const { url, fields } = await response.json();
        const formData = new FormData();

        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        formData.append("file", file);

        const uploadResponse = await fetch(url, {
          method: "POST",
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error("S3 Upload Error");
        }

        return {
          key: fields.key,
          contentType: file.type,
          bucket: fields.bucket
        };
      })
    );
  };

  const mergeFileData = (
    uploadedFiles: IFile[],
    studiesUuid: { studyInstanceUid: string; key: string }[] | null
  ) => {
    const mergedMap = new Map();

    uploadedFiles.forEach((item) =>
      mergedMap.set(item.key, { ...mergedMap.get(item.key), ...item })
    );
    studiesUuid?.forEach((item) =>
      mergedMap.set(item.key, { ...mergedMap.get(item.key), ...item })
    );

    return Array.from(mergedMap.values());
  };

  const createPatient = async (patientData: InputPatient) => {
    return new Promise<void>((resolve, reject) => {
      mutate(
        {
          resource: "patients",
          values: patientData,
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
          onError: (error) => {
            reject(error);
          },
          onSuccess: () => {
            resolve();
          }
        }
      );
    });
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
              <Select>
                {Object.keys(ExaminationType).map((key) => (
                  <Select.Option key={key} value={key}>
                    {t("examinationTypes.".concat(key))}
                  </Select.Option>
                ))}
              </Select>
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

        <FileUploader setFiles={setFiles} files={files} />
        <Button hidden ref={submitButton} type="primary" htmlType="submit" />
      </Form>
    </Create>
  );
};

export default CreatePatient;
