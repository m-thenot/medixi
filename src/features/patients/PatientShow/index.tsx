"use client";

import { useNotification, useShow, useUpdate } from "@refinedev/core";
import { DateField, Show, TextField } from "@refinedev/antd";
import { Button, Card, Typography } from "antd";
import RichTextEditor from "@components/RichTextEditor";
import { EditorEvent } from "tinymce";
import { useState } from "react";
import { IViewPatient } from "src/types";
import sanitizeHtml from "sanitize-html";
import { useTranslation } from "react-i18next";
import { logger } from "src/services/logger";

const { Title } = Typography;

const PatientShow: React.FC = () => {
  const { t } = useTranslation();
  const { queryResult } = useShow({
    meta: {
      fields: [
        "id",
        "firstname",
        "lastname",
        "birth_date",
        "examinations {id, examination_type, examination_date, description, files, report}"
      ]
    }
  });
  const { data, isLoading } = queryResult;
  const [report, setReport] = useState<string | null>(null);
  const record = data?.data as IViewPatient;
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isPDFGenerationLoading, setIsPDFGenerationLoading] = useState(false);

  const { mutate } = useUpdate();
  const { open } = useNotification();

  const onSave = () => {
    setIsSaveLoading(true);
    mutate(
      {
        resource: "examinations",
        values: {
          report: sanitizeHtml(report as string)
        },
        id: record?.examinations?.[0].id,
        errorNotification: (_data, _values, _resource) => {
          return {
            message: t("notifications.defaultErrorMessage"),
            description: t("notifications.defaultErrorTitle"),
            type: "error"
          };
        },
        successNotification: (_data, _values, _resource) => {
          return {
            message: t("patients.saveReportSuccess"),
            type: "success"
          };
        }
      },
      {
        onError: (_error, _variables, _context) => {
          setIsSaveLoading(false);
        },
        onSuccess: (_data, _variables, _context) => {
          setIsSaveLoading(false);
        }
      }
    );
  };

  const handleGeneratePdf = async () => {
    let content = report || (record?.examinations?.[0].report as string);
    setIsPDFGenerationLoading(true);

    try {
      const response = await fetch("/api/patients/export-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ html: content })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `CR_${record?.firstname}-${record?.lastname}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      open?.({
        type: "error",
        description: t("notifications.defaultErrorTitle"),
        message: t("notifications.defaultErrorMessage"),
        undoableTimeout: 5
      });
      logger.error("Error generating PDF:", error);
    } finally {
      setIsPDFGenerationLoading(false);
    }
  };

  const onReportChange = (e: EditorEvent<unknown>) => {
    setReport(e.target.getContent());
  };

  return (
    <>
      <Show
        isLoading={isLoading}
        title={`${record?.firstname} ${record?.lastname}`}
        contentProps={{ hidden: true }}
        headerButtons={() => {
          return (
            <div className="flex gap-2">
              <Button
                type="default"
                onClick={handleGeneratePdf}
                loading={isPDFGenerationLoading}
              >
                {t("patients.exportReport")}
              </Button>
              <Button type="primary" onClick={onSave} loading={isSaveLoading}>
                {t("patients.saveReport")}
              </Button>
            </div>
          );
        }}
      />

      <div className="md:flex md:gap-4 mt-4 w-full">
        <div className="w-full mb-3 md:mb-0 md:w-5/12">
          <Card bordered={false}>
            <div className="flex justify-between *:w-1/2 mb-3">
              <div>
                <Title level={5}>{t("patients.fields.firstname")}</Title>
                <TextField value={record?.firstname} />
              </div>
              <div>
                <Title level={5}>{t("patients.fields.lastname")}</Title>
                <TextField value={record?.lastname} />
              </div>
            </div>
            <Title level={5}>{t("patients.fields.birthDate")}</Title>
            <DateField value={record?.birth_date} locales="fr" />
          </Card>

          <div className="my-3" />

          <Card bordered={false}>
            <Title level={4}>{t("patients.create.examTitle")}</Title>
            <div className="flex justify-between *:w-1/2 mb-3">
              <div>
                <Title level={5}>{t("patients.fields.examType")}</Title>
                <TextField value={record?.examinations?.[0].examination_type} />
              </div>
              <div>
                <Title level={5}>{t("patients.fields.examDate")}</Title>
                <DateField
                  value={record?.examinations?.[0].examination_date}
                  locales="fr"
                />
              </div>
            </div>

            <Title level={5}>{t("patients.fields.examDetails")}</Title>
            <TextField value={record?.examinations?.[0].description} />

            <Title level={5}>{t("patients.fields.examDocuments")}</Title>

            {record?.examinations?.[0].files.map((file) => (
              <a
                key={file.url}
                className="block"
                href={file.downloadUrl}
                download
              >
                {file.pathname}
              </a>
            ))}
          </Card>
        </div>

        <div className="*:w-full">
          <RichTextEditor
            onChange={onReportChange}
            initialValue={
              record?.examinations?.[0].report ||
              t("patients.fields.reportPlaceholder")
            }
          />
        </div>
      </div>
    </>
  );
};

export default PatientShow;
