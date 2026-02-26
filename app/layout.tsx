// "use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/appbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SolanaWalletProvider } from "@/components/providers/solana-provider";

const notoSans = Noto_Sans({ variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fluffy Winner",
  description: "Fluffy Winner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable} suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SolanaWalletProvider>
            <div className="relative flex min-h-screen flex-col">
              <AppBar />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
