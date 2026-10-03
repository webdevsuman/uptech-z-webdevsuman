import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import NextTopLoader from "nextjs-toploader";
import { TanstackQueryProvider } from '@/context/TanstackQueryProvider';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <NextTopLoader height={4} showSpinner={false} />
        <ThemeProvider>
          <TanstackQueryProvider>
            <AuthProvider>
              <SocketProvider>
                <SidebarProvider>{children}</SidebarProvider>
                <Toaster position="top-right" richColors />
              </SocketProvider>
            </AuthProvider>
          </TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
