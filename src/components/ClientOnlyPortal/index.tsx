"use client";
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface IClientOnlyPortalProps {
  selector: string;
  children: React.ReactNode;
}

const ClientOnlyPortal: React.FC<IClientOnlyPortalProps> = ({
  children,
  selector,
}) => {
  const ref = useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement>;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector) as HTMLElement;
    setMounted(true);
  }, [selector]);

  return mounted ? createPortal(children, ref.current) : null;
};

export default ClientOnlyPortal;
