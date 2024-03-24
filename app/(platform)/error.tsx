"use client";

import { ErrorComponent } from "@refinedev/antd";
import { useEffect } from "react";

export default function Error({
  error
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorComponent />;
}
