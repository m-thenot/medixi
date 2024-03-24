"use client";

import { ErrorComponent } from "@refinedev/antd";
import { useEffect } from "react";
import { logger } from "src/services/logger";

export default function Error({
  error
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return <ErrorComponent />;
}
