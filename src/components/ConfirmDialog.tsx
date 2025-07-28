import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-250"
          enterFrom="opacity-100"
          leave="ease-in duration-400"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-400"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-gray-800">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </DialogTitle>
              <Description className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {description}
              </Description>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-red-400 px-4 py-2 text-sm text-white hover:bg-red-700"
                  onClick={onConfirm}
                >
                  Yes, Delete
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
