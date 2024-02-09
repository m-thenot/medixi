import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  IResourceComponentsProps,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { DateField, Show, TextField } from "@refinedev/antd";
import { Card, Typography } from "antd";
import RichTextEditor from "@components/RichTextEditor";
import { EditorEvent } from "tinymce";
import { useState } from "react";
import { IViewPatient } from "src/types";

const { Title } = Typography;

const PatientShow: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { queryResult } = useShow({
    meta: {
      fields: [
        "id",
        "firstname",
        "lastname",
        "birth_date",
        "examinations {examination_type, examination_date, description, files, report}",
      ],
    },
  });
  const { data, isLoading } = queryResult;
  const [report, setReport] = useState<string | null>(null);

  const record = data?.data as IViewPatient;

  console.log(record);

  const onReportChange = (e: EditorEvent<unknown>) => {
    console.log("content", e.target.getContent());
    setReport(e.target.getContent());

    //sanitizeHtml and add a column report into exams database
  };

  console.log(queryResult.data?.data);

  return (
    <>
      <Show
        isLoading={isLoading}
        title={`${record?.firstname} ${record?.lastname}`}
      >
        <Title level={4}>Patient</Title>
        <div className="flex justify-between *:w-1/2 mb-3">
          <div>
            <Title level={5}>{translate("patients.fields.firstname")}</Title>
            <TextField value={record?.firstname} />
          </div>
          <div>
            <Title level={5}>{translate("patients.fields.lastname")}</Title>
            <TextField value={record?.lastname} />
          </div>
        </div>
        <Title level={5}>{translate("patients.fields.birthDate")}</Title>
        <DateField value={record?.birth_date} locales="fr" />
      </Show>

      <div className="my-3" />

      <Card bordered={false}>
        <Title level={4}>Examen</Title>
        <div className="flex justify-between *:w-1/2 mb-3">
          <div>
            <Title level={5}>{translate("patients.fields.examType")}</Title>
            <TextField value={record?.examinations[0].examination_type} />
          </div>
          <div>
            <Title level={5}>{translate("patients.fields.examDate")}</Title>
            <DateField
              value={record?.examinations[0].examination_date}
              locales="fr"
            />
          </div>
        </div>

        <Title level={5}>{translate("patients.fields.examDetails")}</Title>
        <TextField value={record?.examinations[0].description} />
      </Card>

      <div className="my-3" />

      <RichTextEditor
        onChange={onReportChange}
        initialValue={record.examinations[0].report}
      />
    </>
  );
};

export default PatientShow;

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
