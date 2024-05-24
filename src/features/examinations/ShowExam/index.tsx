"use client";

import { useNotification, useShow } from "@refinedev/core";
import { DateField, Show, TextField } from "@refinedev/antd";
import { Button, Card, Typography } from "antd";
import { EditorEvent } from "tinymce";
import { useEffect, useState } from "react";
import { IExamination } from "src/types";
import { useTranslation } from "react-i18next";
import { logger } from "src/services/logger";
import FileDownloader from "@components/FileDownloader";
import { LinkButton } from "@components/Button";
import { usePageVisibility } from "src/hooks";
import { getSignedUrl } from "src/services";
import Report from "./Report";

const { Title } = Typography;

interface IShowExamination extends IExamination {
  patient: {
    firstname: string;
    lastname: string;
  };
}

const ShowExamination: React.FC = () => {
  const { t } = useTranslation();
  const { queryResult } = useShow({
    meta: {
      fields: [
        "id",
        "examination_type",
        "examination_date",
        "description",
        "state",
        "files",
        "report",
        "patient { firstname, lastname }"
      ]
    }
  });
  const { data, isLoading, refetch } = queryResult;
  usePageVisibility(refetch);

  const [report, setReport] = useState<string | null>(null);
  const record = data?.data as IShowExamination;
  const [isPDFGenerationLoading, setIsPDFGenerationLoading] = useState(false);
  const { open } = useNotification();

  const handleGeneratePdf = async () => {
    let content = report || (record?.report as string);
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
        a.download = `CR_${record?.patient.firstname}-${record?.patient.lastname}.pdf`;
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

  useEffect(() => {
    const getUrl = async (initialReport: string) => {
      let reportWithCaptures = initialReport;

      const matches = [...initialReport.matchAll(/data-key='([^']+)'/g)];
      const keys = matches.map((match) => match[1]);

      await Promise.all(
        keys.map(async (key) => {
          const url = await getSignedUrl(key);

          const newSrc = `src="${url}"`;

          const regex = new RegExp(`(data-key='${key}'[^>]*)`, "g");

          reportWithCaptures = reportWithCaptures.replace(regex, (match) => {
            // Check if the src attribute exists
            if (/src="[^']*"/.test(match)) {
              // If src attribute exists, replace it
              return match.replace(/src="[^"]*"/, newSrc);
            } else {
              // If src attribute does not exist, add it after data-key
              return match.replace(/(data-key='[^']*')/, `$1 ${newSrc}`);
            }
          });
        })
      );

      setReport(reportWithCaptures);
    };

    if (record?.report) {
      getUrl(record.report);
    }
  }, [record]);

  const onReportChange = (e: EditorEvent<unknown>) => {
    setReport(e.target.getContent());
  };

  return (
    <>
      <Show
        isLoading={isLoading}
        title={`${t("examinations.title")} - ${record?.patient.firstname} ${
          record?.patient.lastname
        }`}
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
            </div>
          );
        }}
      />

      <div className="md:flex md:gap-4 mt-4 w-full">
        <div className="w-full mb-3 md:mb-0 md:w-5/12">
          <Card bordered={false}>
            <Title level={4}>{t("examinations.title")}</Title>
            <div className="flex justify-between *:w-1/2 mb-3">
              <div>
                <Title level={5}>{t("patients.fields.examType")}</Title>
                <TextField
                  value={t(
                    "examinationTypes.".concat(record?.examination_type)
                  )}
                />
              </div>
              <div>
                <Title level={5}>{t("patients.fields.examDate")}</Title>
                <DateField value={record?.examination_date} locales="fr" />
              </div>
            </div>

            <Title level={5}>{t("patients.fields.examDetails")}</Title>
            <TextField value={record?.description} />

            <Title level={5}>{t("patients.fields.examDocuments")}</Title>

            {record?.files.map((file) => (
              <>
                <FileDownloader key={file.key} file={file} />
              </>
            ))}
          </Card>

          <div className="mt-3">
            <Card bordered={false}>
              <Title level={4}>{t("examinations.analyzeTitle")}</Title>
              <LinkButton
                size="large"
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_VIEWER_URL}/viewer?StudyInstanceUIDs=${record?.files[0].studyInstanceUid}&examId=${record?.id}`}
              >
                {t("examinations.analyseButton")}
              </LinkButton>
            </Card>
          </div>
        </div>

        <Report
          onChange={onReportChange}
          report={report || t("patients.fields.reportPlaceholder")}
          examId={record?.id}
        />
      </div>
    </>
  );
};

export default ShowExamination;
