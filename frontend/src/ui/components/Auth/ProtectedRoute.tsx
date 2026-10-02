"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // While checking auth state
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Checking authorization...</p>
      </div>
    );
  }

  // If not logged in, don't render children
  if (!user) {
    return null;
  }

  // Role check
  if (role && !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-error-500 font-medium">Access denied 🚫</p>
      </div>
    );
  }

  return <>{children}</>;
}
