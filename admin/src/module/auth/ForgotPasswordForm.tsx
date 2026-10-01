"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, CheckCircleIcon } from "@/icons";
import { ROUTES } from "@/navigation/sidebar/routes";
import { useForgotPassword } from "@/api/hooks/auth/hooks";
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
        },
      }
    );
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          <div>
            {isSubmitted ? (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-success-50 border border-success-200 dark:bg-success-950/20 dark:border-success-800/40">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-success-600 dark:text-success-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-success-800 dark:text-success-300">
                      <p className="font-semibold mb-1">Reset Link Sent</p>
                      <p>
                        If an account exists for{" "}
                        <span className="font-medium underline">
                          {submittedEmail}
                        </span>
                        , a password reset email has been sent. Please check
                        your inbox and spam folder.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Resend link or try another email
                  </Button>

                  <div className="text-center pt-2">
                    <Link
                      href={ROUTES.auth.login}
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                      Back to Sign in
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      placeholder="info@gmail.com"
                      type="email"
                      {...register("email")}
                      error={!!errors.email}
                      hint={errors.email?.message}
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <Button className="w-full" size="sm" disabled={isPending}>
                      {isPending ? "Sending reset link..." : "Send Reset Link"}
                    </Button>
                  </div>

                  <div className="text-center pt-2">
                    <Link
                      href={ROUTES.auth.login}
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                      Back to Sign in
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
