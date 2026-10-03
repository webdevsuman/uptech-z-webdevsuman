import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wrapper from "../../layout/wrapper/Wrapper";
import TanstackProvider from "@/lib/TanstackProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
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
  title: {
    default: "UpTech-Z — Empower Your Tech Journey",
    template: "%s | UpTech-Z",
  },
  description:
    "Empower your tech journey with UpTech-Z. Learn Web Development, Cloud, AI, Data Science, and Design from industry professionals.",
  keywords: [
    "UpTech-Z",
    "online learning",
    "tech courses",
    "web development",
    "programming tutorials",
    "coding bootcamp",
  ],
  authors: [{ name: "UpTech-Z Team" }],
  openGraph: {
    title: "UpTech-Z — Empower Your Tech Journey",
    description:
      "Learn cutting-edge tech skills from top industry mentors. Access interactive courses, video lessons, and verified certificates.",
    type: "website",
    locale: "en_US",
    siteName: "UpTech-Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "UpTech-Z — Empower Your Tech Journey",
    description:
      "Learn cutting-edge tech skills from top industry mentors on UpTech-Z.",
  },
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
              <SocketProvider>
                <Toaster richColors position="top-right" />
                <Wrapper>{children}</Wrapper>
              </SocketProvider>
            </AuthProvider>
          </TanstackProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
