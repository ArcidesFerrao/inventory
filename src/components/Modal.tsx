import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="modal-category modal fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full p-4 flex flex-col gap-2 relative">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {children}

        <div className="absolute top-0 right-0 text-right mt-4 ">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
