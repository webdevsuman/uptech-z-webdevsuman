"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { useResendOtp, useVerifyOtp } from "@/api/hooks/auth/hooks";
import { sToast } from "@/components/ui/alert/stoast";
import { TVerifyOtpFormData, verifyOtpZodSchema } from "./auth.zod";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryUserId = searchParams.get("userId") || searchParams.get("id") || "";
  const queryEmail = searchParams.get("email") || "";

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TVerifyOtpFormData>({
    resolver: zodResolver(verifyOtpZodSchema),
    mode: "all",
    defaultValues: {
      userId: queryUserId,
      otp: "",
    },
  });

  const userIdValue = watch("userId");

  useEffect(() => {
    if (queryUserId) {
      setValue("userId", queryUserId);
    }
  }, [queryUserId, setValue]);

  // Timer countdown for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const onSubmit = (data: TVerifyOtpFormData) => {
    verifyOtp(data, {
      onSuccess: () => {
        sToast.success("Email verified successfully! You can now log in.");
        router.push("/login");
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message || err?.message || "Invalid or expired OTP";
        sToast.error(message);
      },
    });
  };

  const handleResend = () => {
    if (!userIdValue) {
      sToast.error("User ID is missing. Please sign up again.");
      return;
    }

    resendOtp(
      { userId: userIdValue },
      {
        onSuccess: () => {
          sToast.success("New OTP sent to your registered email!");
          setCountdown(60);
          setCanResend(false);
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || err?.message || "Failed to resend OTP";
          sToast.error(message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full p-6 sm:p-12 overflow-y-auto">
      <div className="w-full max-w-md mx-auto mb-6">
        <Link
          href="/register"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to Register
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Verify Email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {queryEmail ? (
              <>
                We sent a 6-digit verification code to{" "}
                <strong className="text-gray-800 dark:text-gray-200">{queryEmail}</strong>.
              </>
            ) : (
              "Enter the 6-digit verification code sent to your email address."
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            {!queryUserId && (
              <div>
                <Label htmlFor="userId">
                  User ID <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter your user ID"
                  {...register("userId")}
                  error={!!errors.userId}
                  hint={errors.userId?.message}
                  disabled={isVerifying}
                />
              </div>
            )}

            <div>
              <Label htmlFor="otp">
                6-Digit Verification Code <span className="text-error-500">*</span>
              </Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="123456"
                className="text-center text-lg tracking-widest font-mono font-semibold"
                {...register("otp")}
                error={!!errors.otp}
                hint={errors.otp?.message}
                disabled={isVerifying}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Didn&apos;t receive the code?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400 cursor-pointer"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <span className="text-gray-400">Resend in {countdown}s</span>
          )}
        </div>
      </div>
    </div>
  );
}
