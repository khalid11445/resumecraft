import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeCraft | Resumes built for your profession",
  description:
    "Pick your profession, edit with a live preview, and download a clean, professional resume PDF.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Suspense fallback={<div className="h-14 border-b border-gray-200 bg-white" />}>
          <SiteHeader />
        </Suspense>
        <div className="flex-1">{children}</div>
        <Suspense fallback={null}>
          <SiteFooter />
        </Suspense>
      </body>
    </html>
  );
}