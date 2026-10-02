"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import MuiTheme from "../../theme/MuiTheme";

const standaloneRoutes = [
  "/login",
  "/register",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/instructor",
];

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isStandalonePage = standaloneRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  return (
    <MuiTheme>
      {!isStandalonePage && <Header />}
      <main className="flex-1">{children}</main>
      {!isStandalonePage && <Footer />}
    </MuiTheme>
  );
};


export default Wrapper;

