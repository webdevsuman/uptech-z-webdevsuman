import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "../../layout/wrapper/Wrapper";
import TanstackProvider from "@/utils/TanstackProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uptech-Z",
  description: "Platform to Upgrade Tech Skills for the Generation Z",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <TanstackProvider>
            <AuthProvider>
              <Toaster richColors position="top-right" />
              <Wrapper>{children}</Wrapper>
            </AuthProvider>
          </TanstackProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

