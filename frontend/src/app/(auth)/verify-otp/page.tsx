import React, { Suspense } from "react";
import VerifyOtpForm from "@/module/auth/VerifyOtpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | UpTech-Z",
  description: "Verify your email address with the 6-digit OTP sent to you.",
};

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="text-gray-500">Loading verification...</div>
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
