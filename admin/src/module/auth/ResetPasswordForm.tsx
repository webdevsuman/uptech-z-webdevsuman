"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {useRouter} from "nextjs-toploader/app"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {
  ChevronLeftIcon,
  EyeCloseIcon,
  EyeIcon,
  AlertIcon,
} from "@/icons";
import { ROUTES } from "@/navigation/sidebar/routes";
import { useResetPassword } from "@/api/hooks/auth/hooks";
import { sToast } from "@/components/ui/alert/stoast";
import { resetPasswordZodSchema, TResetPasswordFormData } from "./auth.zod";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const userId = searchParams.get("id") || searchParams.get("userId") || "";

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
          router.push(ROUTES.auth.login);
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
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password below to reset your credentials.
            </p>
          </div>

          <div>
            {isInvalidLink ? (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-error-50 border border-error-200 dark:bg-error-950/20 dark:border-error-800/40">
                  <div className="flex items-start gap-3">
                    <AlertIcon className="w-5 h-5 text-error-600 dark:text-error-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-error-800 dark:text-error-300">
                      <p className="font-semibold mb-1">Invalid Reset Link</p>
                      <p>
                        This password reset link is invalid or incomplete.
                        Please request a new reset link to proceed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href={ROUTES.auth["forgot-password"]} className="block">
                    <Button className="w-full" size="sm">
                      Request New Reset Link
                    </Button>
                  </Link>

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
                      New Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        {...register("password")}
                        error={!!errors.password}
                        hint={errors.password?.message}
                        disabled={isPending}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>
                      Confirm New Password{" "}
                      <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        hint={errors.confirmPassword?.message}
                        disabled={isPending}
                      />
                      <span
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Button className="w-full" size="sm" disabled={isPending}>
                      {isPending ? "Resetting password..." : "Reset Password"}
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
