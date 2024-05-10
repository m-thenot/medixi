import { logger } from "./logger";

export const getSignedUrl = async (filename: string) => {
  const response = await fetch(`/api/patients/files?filename=${filename}`);

  if (!response.ok) {
    logger.error("Failed to get pre-signed URL.");
    return null;
  }

  const { url } = await response.json();

  return url;
};
