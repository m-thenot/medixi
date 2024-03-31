"use client";

import { IFile } from "@types";
import { useEffect, useState } from "react";
import { logger } from "src/services/logger";

interface IFileDownloaderProps {
  file: IFile;
}

const getSignedUrl = async (filename: string) => {
  const response = await fetch(`/api/patients/documents?filename=${filename}`);

  if (!response.ok) {
    logger.error("Failed to get pre-signed URL.");
    return null;
  }

  const { url } = await response.json();

  return url;
};

const FileDownloader: React.FC<IFileDownloaderProps> = ({ file }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUrl = async () => {
      const response = await getSignedUrl(file.key);
      setUrl(response);
    };

    getUrl();
  }, []);

  if (!url) {
    return null;
  }

  return (
    <a className="block" href={url} download>
      {file.key.split("_")[1]}
    </a>
  );
};

export default FileDownloader;
