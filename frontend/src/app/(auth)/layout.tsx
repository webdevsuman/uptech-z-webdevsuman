import GridShape from "@/components/common/GridShape";
import { projectConfig } from "@/config/project-config";
import DarkModeToggle from "@/ui/DarkModeToggle";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white z-1 dark:bg-gray-900">
      <div className="relative flex lg:flex-row w-full min-h-screen justify-center flex-col dark:bg-gray-900">
        {children}
        <div className="lg:w-1/2 w-full min-h-screen bg-gradient-to-l from-brand-950 to-brand-600 dark:from-brand-600 dark:to-brand-950 lg:grid items-center hidden relative overflow-hidden">
          <div className="relative items-center justify-center flex z-1 w-full">
            <GridShape />
            <div className="flex flex-col items-center max-w-sm text-center px-6">
              <Link href="/" className="block mb-6">
                <Image
                  width={220}
                  height={50}
                  src={projectConfig.logo || "/Logo.svg"}
                  alt="Logo"
                  priority
                />
              </Link>
              <p className="text-center text-gray-200 text-sm leading-relaxed">
                {projectConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Floating Dark Mode Toggle */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="p-1 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md border border-gray-200 dark:border-gray-700 backdrop-blur-sm flex items-center justify-center">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

