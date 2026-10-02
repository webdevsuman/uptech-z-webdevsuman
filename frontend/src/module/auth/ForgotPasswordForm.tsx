"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { CheckCircleIcon, ChevronLeftIcon } from "@/icons";
import { useForgotPassword } from "@/api/hooks/auth/hooks";
import { sToast } from "@/components/ui/alert/stoast";
import { forgotPasswordZodSchema, TForgotPasswordFormData } from "./auth.zod";

export default function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordZodSchema),
    mode: "all",
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const onSubmit = (data: TForgotPasswordFormData) => {
    forgotPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setSubmittedEmail(data.email);
          setIsSubmitted(true);
          sToast.success("Password reset link sent to your email!");
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || err?.message || "Failed to send reset link";
          sToast.error(message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full p-6 sm:p-12 overflow-y-auto">
      <div className="w-full max-w-md mx-auto mb-6">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to Sign In
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your registered email address and we&apos;ll send you a password reset link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-success-50 border border-success-200 dark:bg-success-950/30 dark:border-success-800/40">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-success-600 dark:text-success-400 shrink-0 mt-0.5" />
                <div className="text-sm text-success-800 dark:text-success-300">
                  <p className="font-semibold mb-1 text-base">Reset Link Sent</p>
                  <p>
                    If an account exists for{" "}
                    <span className="font-medium underline">{submittedEmail}</span>, a
                    password reset email has been sent. Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/login" className="block w-full">
              <Button variant="outline" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-5">
              <div>
                <Label htmlFor="email">
                  Email Address <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  error={!!errors.email}
                  hint={errors.email?.message}
                  disabled={isPending}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Sending link..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
