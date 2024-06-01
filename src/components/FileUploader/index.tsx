"use client";
import React, { useState } from "react";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";

interface IFileUploaderProps {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  files: File[];
}

const FileUploader: React.FC<IFileUploaderProps> = ({ setFiles, files }) => {
  const { t } = useTranslation();

  const onDropAccepted = (acceptedFiles: File[]) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    accept: {
      "application/dicom": [".dcm"],
      "application/zip": [".zip"]
    }
  });

  const onRemove = (filename: string) => () => {
    const findIndex = files.findIndex((file) => file.name === filename);
    if (findIndex !== -1) {
      const newFiles = [...files];
      newFiles.splice(findIndex, 1);
      setFiles(newFiles);
    }
  };

  return (
    <div className="relative" onClick={() => console.log("ok")}>
      <div {...getRootProps({ className: "ant-upload-wrapper" })}>
        <input {...getInputProps()} />
        <div className="relative w-full h-full text-center bg-white bg-opacity-[0.04] hover:border-[#3c89e8] border border-dashed border-gray-600 rounded-lg cursor-pointer transition-colors duration-300 px-4">
          <InboxOutlined
            className="text-5xl mt-4 mb-3"
            style={{ color: "#3c89e8" }}
          />
          <p className="text-base mb-1">{t("patients.fields.upload.title")}</p>
          <p className="text-slate-500 mt-2">
            {t("patients.fields.upload.description")}
          </p>
        </div>
      </div>
      <ul className="max-h-36 overflow-y-auto mt-2 p-0">
        {files.map((file) => (
          <li
            key={file.name}
            className="w-full py-1 px-1 list-none flex justify-between hover:bg-[rgba(255,255,255,0.05)]"
          >
            {file.name}
            <button
              onClick={onRemove(file.name)}
              className="hover:bg-[rgba(255,255,255,0.1)] cursor-pointer bg-transparent outline-none border-none hover:text-red-500"
            >
              <DeleteOutlined style={{ color: "currentcolor" }} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
