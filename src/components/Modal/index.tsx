import { Close } from "@icons";
import ClientOnlyPortal from "../ClientOnlyPortal";
import React from "react";

interface IModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<IModalProps> = ({ children, onClose }) => {
  return (
    <ClientOnlyPortal selector="body">
      <div
        onClick={onClose}
        className="fixed top-0 left-0 right-0 bg-opacity-60 bg-black flex items-center justify-center w-full h-full z-50"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-slate-50 rounded-lg p-6"
        >
          <div className="flex justify-end">
            <button onClick={onClose} className="mb-3 px-0">
              <Close width={13} height={13} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </ClientOnlyPortal>
  );
};

export default Modal;
