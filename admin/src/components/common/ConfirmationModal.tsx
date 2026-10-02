"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { AppIcon } from "@/components/ui/app-icon";

export type TConfirmModalVariant = "danger" | "warning" | "primary" | "success";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: TConfirmModalVariant;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "lucide:alert-triangle",
          iconBg: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400",
          confirmButton: "bg-error-500 hover:bg-error-600 text-white focus:ring-error-500/20",
        };
      case "warning":
        return {
          icon: "lucide:alert-circle",
          iconBg: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
          confirmButton: "bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500/20",
        };
      case "success":
        return {
          icon: "lucide:check-circle-2",
          iconBg: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
          confirmButton: "bg-success-500 hover:bg-success-600 text-white focus:ring-success-500/20",
        };
      case "primary":
      default:
        return {
          icon: "lucide:info",
          iconBg: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
          confirmButton: "bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500/20",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-6">
      <div className="flex flex-col items-center text-center">
        {/* Dynamic Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.iconBg} mb-3.5 transition-transform`}
        >
          <AppIcon icon={styles.icon} className="h-6 w-6" />
        </div>

        {/* Dynamic Title */}
        <h3 className="text-base font-bold text-gray-800 dark:text-white/90">
          {title.trim().toLowerCase().startsWith("are you sure")
            ? title
            : `Are you sure you want to ${title}`}
        </h3>

        {/* Optional Description */}
        {description && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
            {description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex w-full items-center justify-center gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="w-full rounded-xl border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-sm font-medium transition shadow-theme-xs disabled:opacity-50 ${styles.confirmButton}`}
          >
            {isLoading && (
              <AppIcon icon="lucide:loader" className="h-4 w-4 animate-spin" />
            )}
            <span>{isLoading ? "Processing..." : confirmText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
