"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useLogin } from "@/api/hooks/auth/hooks";
import { useAuth } from "@/context/AuthContext";
import { sToast } from "@/components/ui/alert/stoast";
import { loginZodSchema, TLoginFormData } from "./auth.zod";

const REMEMBER_ME_KEY = "uptechz_remember_me";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const callbackUrl = searchParams.get("callbackUrl");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TLoginFormData>({
    resolver: zodResolver(loginZodSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLogin();

  // Load remembered credentials on mount
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_ME_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) {
          setValue("email", parsed.email, { shouldValidate: true });
        }
        setIsChecked(true);
      } catch {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
    }
  }, [setValue]);

  const onSubmit = (data: TLoginFormData) => {
    login(data, {
      onSuccess: (res) => {
        if (res?.data) {
          setUser({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            isVerified: res.data.isVerified,
          });
        }

        if (isChecked) {
          localStorage.setItem(
            REMEMBER_ME_KEY,
            JSON.stringify({ email: data.email })
          );
        } else {
          localStorage.removeItem(REMEMBER_ME_KEY);
        }

        sToast.success("Logged in successfully!");

        // Determine target redirect
        const targetUrl = callbackUrl
          ? decodeURIComponent(callbackUrl)
          : res?.data?.role === "instructor"
          ? "/instructor/dashboard"
          : "/student/dashboard";

        router.replace(targetUrl);
        router.refresh();
      },
      onError: (err: unknown) => {
        const errObj = err as { response?: { data?: { message?: string } }; message?: string };
        const message =
          errObj?.response?.data?.message || errObj?.message || "Failed to sign in";
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
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Enter your email and password to access your account.
          </p>
        </div>

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

            <div>
              <Label htmlFor="password">
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={isChecked}
                onChange={setIsChecked}
                label="Remember me"
                disabled={isPending}
              />
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
