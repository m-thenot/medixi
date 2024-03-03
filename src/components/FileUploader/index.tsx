"use client";
import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { PutBlobResult } from "@vercel/blob";
import { useTranslate } from "@refinedev/core";

const { Dragger } = Upload;

interface IFileUploaderProps {
  setFiles: React.Dispatch<React.SetStateAction<PutBlobResult[]>>;
}

const FileUploader: React.FC<IFileUploaderProps> = ({ setFiles }) => {
  const translate = useTranslate();

  const props: UploadProps = {
    name: "file",
    action: (file) => `/api/patients/upload?filename=${file.name}`,
    onChange(info) {
      if (info.file.status === "done") {
        setFiles((prev) => [...prev, info.file.response]);
        message.success(
          translate("patients.fields.upload.notifications.success", {
            filename: info.file.name,
          })
        );
      } else if (info.file.status === "error") {
        message.error(
          translate("patients.fields.upload.notifications.error", {
            filename: info.file.name,
          })
        );
      }
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        {translate("patients.fields.upload.title")}
      </p>
      <p className="ant-upload-hint">
        {translate("patients.fields.upload.description")}
      </p>
    </Dragger>
  );
};

export default FileUploader;
