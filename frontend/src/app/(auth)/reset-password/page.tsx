import React, { Suspense } from "react";
import ResetPasswordForm from "@/module/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | UpTech-Z",
  description: "Set a new password for your UpTech-Z account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="text-gray-500">Loading reset form...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
