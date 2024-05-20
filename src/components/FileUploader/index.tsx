"use client";
import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { logger } from "src/services/logger";
import { IFile } from "@types";

const { Dragger } = Upload;

interface IFileUploaderProps {
  setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
}

const FileUploader: React.FC<IFileUploaderProps> = ({ setFiles }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const props: UploadProps = {
    name: "file",
    customRequest: async ({ onSuccess, onError, file }) => {
      try {
        setUploading(true);
        const response = await fetch("/api/patients/files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            filename: (file as File).name,
            contentType: (file as File).type
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

        onSuccess?.({
          key: fields.key,
          contentType: (file as File).type,
          bucket: fields.bucket
        });
      } catch (error: any) {
        logger.error("Failed to upload document:", error);
        onError?.(error);
      } finally {
        setUploading(false);
      }
    },
    onChange(info) {
      if (info.file.status === "done") {
        setFiles((prev) => [...prev, info.file.response]);
        message.success(
          t("patients.fields.upload.notifications.success", {
            filename: info.file.name
          })
        );
      } else if (info.file.status === "error") {
        message.error(
          t("patients.fields.upload.notifications.error", {
            filename: info.file.name
          })
        );
      }
    }
  };

  return (
    <Dragger {...props} disabled={uploading} multiple>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{t("patients.fields.upload.title")}</p>
      <p className="ant-upload-hint">
        {t("patients.fields.upload.description")}
      </p>
    </Dragger>
  );
};

export default FileUploader;
