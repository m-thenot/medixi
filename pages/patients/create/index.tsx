import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React, { useRef, useState } from "react";
import {
  IResourceComponentsProps,
  useTranslate,
  useCreate,
} from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Col, DatePicker, Form, Row, Input, Typography, Button } from "antd";
import FileUploader from "@components/FileUploader";
import { PutBlobResult } from "@vercel/blob";
import { useRouter } from "next/router";

const { Title } = Typography;
const { TextArea } = Input;

interface IPatientCreate {
  firstname: string;
  lastname: string;
  birth_date: number;
  examination_type: string;
  examination_date: string;
  description: string;
}

const PatientCreate: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { formProps } = useForm<IPatientCreate>();
  const submitButton = useRef<HTMLElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<PutBlobResult[]>([]);

  const { mutate } = useCreate();

  const onFinish = (values: IPatientCreate) => {
    setIsLoading(true);

    const {
      firstname,
      lastname,
      birth_date,
      examination_date,
      examination_type,
      description,
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
                files,
              },
            ],
          },
        },
        meta: {
          fields: ["id"],
        },
        errorNotification: (_data, _values, _resource) => {
          return {
            message: translate("notifications.defaultErrorMessage"),
            description: translate("notifications.defaultErrorTitle"),
            type: "error",
          };
        },
      },
      {
        onError: (_error, _variables, _context) => {
          setIsLoading(false);
        },
        onSuccess: (_data, _variables, _context) => {
          setIsLoading(false);
          router.push("/patients");
        },
      }
    );
  };

  return (
    <Create
      saveButtonProps={{
        onClick: () => {
          submitButton.current?.click();
        },
        loading: isLoading,
      }}
      title={translate("patients.create.title")}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values: any) => onFinish(values)}
      >
        <Row gutter={24}>
          <Col span={12}>
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
          </Col>

          <Col span={12}>
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
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
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
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Title level={4}>{translate("patients.create.examTitle")}</Title>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={translate("patients.fields.examType")}
              name={["examination_type"]}
              rules={[
                {
                  required: true,
                  message: translate("form.fields.required"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={translate("patients.fields.examDate")}
              name={["examination_date"]}
              rules={[
                {
                  required: true,
                  message: translate("form.fields.required"),
                },
              ]}
            >
              <DatePicker
                placeholder={translate("patients.fields.examDatePlaceholder")}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={translate("patients.fields.examDetails")}
          name={["description"]}
          rules={[
            {
              required: true,
              message: translate("form.fields.required"),
            },
          ]}
        >
          <TextArea />
        </Form.Item>

        <div className="ant-form-item-label">
          <label className="ant-form-item-required">
            <span style={{ color: "#dc4446" }}>*</span>{" "}
            {translate("patients.fields.examDocuments")}
          </label>
        </div>

        <FileUploader setFiles={setFiles} />
        <Button hidden ref={submitButton} type="primary" htmlType="submit" />
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
