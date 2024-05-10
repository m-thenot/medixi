"use client";

import { IFile } from "@types";
import { useEffect, useState } from "react";
import { getSignedUrl } from "src/services";

interface IFileDownloaderProps {
  file: IFile;
}

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
      {file.key.split("/")[2]}
    </a>
  );
};

export default FileDownloader;
