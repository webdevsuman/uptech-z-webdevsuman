"use client";

import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store/store";
import { redirect } from "next/navigation";

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user, role } = useSelector((state: RootState) => state.auth);
  // console.log("Role:", role);

  // Redirect in effect, not during render
  useEffect(() => {
    if (!user) {
      redirect("/auth");
    }
  }, [user, role]);

  // If not logged in, don’t render children until redirect happens
  if (!user) {
    return null;
  }

  // Role check
  if (!allowedRoles.includes(role || "")) {
    return <p>Access denied 🚫</p>;
  }

  return <>{children}</>;
}
