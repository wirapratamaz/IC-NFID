import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/site-header";
import React from "react";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Login NFID ICP",
  description: "is about the food hunt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <title>Simple Login NFID ICP.</title>
      </head>
      <body>
        <Providers>
          <div className="relative flex min-h-screen flex-col" style={{}}>
            <SiteHeader />
            <main className="relative pb-6 lg:gap-10 lg:pb-8 mx-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
