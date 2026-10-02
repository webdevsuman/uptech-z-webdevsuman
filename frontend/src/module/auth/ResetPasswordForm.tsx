"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { AlertIcon, ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useResetPassword } from "@/api/hooks/auth/hooks";
import { sToast } from "@/components/ui/alert/stoast";
import { resetPasswordZodSchema, TResetPasswordFormData } from "./auth.zod";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const userId = searchParams.get("userId") || searchParams.get("id") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isInvalidLink = !token || !userId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPasswordFormData>({
    resolver: zodResolver(resetPasswordZodSchema),
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: resetPassword, isPending } = useResetPassword();

  const onSubmit = (data: TResetPasswordFormData) => {
    if (isInvalidLink) {
      sToast.error("Reset token or User ID is missing from the link.");
      return;
    }

    resetPassword(
      {
        userId,
        token,
        newPassword: data.password,
      },
      {
        onSuccess: () => {
          sToast.success("Password reset successfully! Please sign in.");
          router.push("/login");
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || err?.message || "Failed to reset password";
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
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below to reset your credentials.
          </p>
        </div>

        {isInvalidLink && (
          <div className="mb-6 p-4 rounded-xl bg-error-50 border border-error-200 dark:bg-error-950/30 dark:border-error-800/40">
            <div className="flex items-start gap-3">
              <AlertIcon className="w-5 h-5 text-error-600 dark:text-error-400 shrink-0 mt-0.5" />
              <div className="text-sm text-error-800 dark:text-error-300">
                <p className="font-semibold mb-0.5">Invalid or Expired Link</p>
                <p>
                  This password reset link is invalid or has expired. Please request a new
                  link from the forgot password page.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            <div>
              <Label htmlFor="password">
                New Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("password")}
                  error={!!errors.password}
                  hint={errors.password?.message}
                  disabled={isPending || isInvalidLink}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeCloseIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                Confirm Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  hint={errors.confirmPassword?.message}
                  disabled={isPending || isInvalidLink}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeCloseIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isPending || isInvalidLink}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Remembered your credentials?{" "}
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
