import React, { useState } from "react";
import { EventHandler } from "@tinymce/tinymce-react/lib/cjs/main/ts/Events";
import Modal from "@components/Modal";
import { useUpdate } from "@refinedev/core";
import { ExaminationState } from "@types";
import sanitizeHtml from "sanitize-html";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import RichTextEditor from "@components/RichTextEditor";

interface IReportProps {
  onChange: EventHandler<unknown>;
  report: string;
  examId: string;
}

const Report: React.FC<IReportProps> = ({ onChange, examId, report }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const { mutate } = useUpdate();
  const { t } = useTranslation();

  const onSave = () => {
    setIsSaveLoading(true);
    mutate(
      {
        resource: "examinations",
        values: {
          report: sanitizeHtml(report as string, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              img: ["src", "data-key", "width", "height"]
            }
          }),
          state: ExaminationState.REPORT_DRAFTED
        },
        id: examId,
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
          setIsModalOpen(false);
        }
      }
    );
  };

  return (
    <>
      <div className="max-w-[780px] relative w-full">
        <RichTextEditor report={report} isReadOnly />
        <div className="absolute z-50 bottom-0 flex justify-center w-full bg-black opacity-80">
          <button
            type="button"
            className="text-white bg-transparent font-semibold outline-none py-4 cursor-pointer border-none w-full h-full"
            onClick={() => setIsModalOpen(true)}
          >
            {t("examinations.editReportButton")}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <RichTextEditor report={report} onChange={onChange} />

          <div className="flex justify-end mt-4">
            <Button type="primary" onClick={onSave} loading={isSaveLoading}>
              {t("patients.saveReport")}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Report;
