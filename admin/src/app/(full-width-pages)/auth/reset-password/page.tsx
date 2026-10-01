import { Suspense } from "react";
import { Metadata } from "next";
import ResetPasswordForm from "@/module/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | UpTech-Z Admin",
  description: "Set a new password for your UpTech-Z account",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col flex-1 lg:w-1/2 w-full justify-center items-center">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <span className="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
