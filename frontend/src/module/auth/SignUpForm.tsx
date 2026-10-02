"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useRegister } from "@/api/hooks/auth/hooks";
import { sToast } from "@/components/ui/alert/stoast";
import { registerZodSchema, TRegisterFormData } from "./auth.zod";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TRegisterFormData>({
    resolver: zodResolver(registerZodSchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const selectedRole = watch("role");
  const { mutate: registerUser, isPending } = useRegister();

  const onSubmit = (data: TRegisterFormData) => {
    registerUser(data, {
      onSuccess: (res) => {
        sToast.success("Registration successful! Please check your email for the 6-digit OTP.");
        const userId = res.data?.id;
        router.push(`/verify-otp?userId=${userId}&email=${encodeURIComponent(data.email)}`);
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message || err?.message || "Failed to create account";
        sToast.error(message);
      },
    });
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full p-6 sm:p-12 overflow-y-auto">
      <div className="w-full max-w-md mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 transition dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to Home
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Create an Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select your role and start your journey on UpTech-Z today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            {/* Role Selection Tabs */}
            <div>
              <Label>
                I want to join as <span className="text-error-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setValue("role", "student", { shouldValidate: true })}
                  className={`p-3.5 text-center rounded-lg border text-sm font-medium transition cursor-pointer ${
                    selectedRole === "student"
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-500"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  <span className="block text-base mb-0.5">🎓</span>
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setValue("role", "instructor", { shouldValidate: true })}
                  className={`p-3.5 text-center rounded-lg border text-sm font-medium transition cursor-pointer ${
                    selectedRole === "instructor"
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-500"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  <span className="block text-base mb-0.5">👨‍🏫</span>
                  Instructor
                </button>
              </div>
              {errors.role && (
                <p className="mt-1.5 text-xs text-error-500">{errors.role.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="name">
                Full Name <span className="text-error-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                error={!!errors.name}
                hint={errors.name?.message}
                disabled={isPending}
              />
            </div>

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

            <div>
              <Label htmlFor="password">
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password")}
                  error={!!errors.password}
                  hint={errors.password?.message}
                  disabled={isPending}
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
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters with uppercase, lowercase, number & special character.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
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
