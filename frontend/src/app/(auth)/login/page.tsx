import React, { Suspense } from "react";
import SignInForm from "@/module/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | UpTech-Z",
  description: "Sign in to your UpTech-Z student or instructor account.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="text-gray-500">Loading sign in...</div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

