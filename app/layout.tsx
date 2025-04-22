import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OVERLAY_CONTAINER_HTML_ID } from "@/app/reusable_in_other_projetcs/Modal/Modal";
import Header from "@/app/_cross_project/ui_components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hexacodle",
  description: "Hexacodle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <Header />
        {children}
        <div id={OVERLAY_CONTAINER_HTML_ID}></div>
      </body>
    </html>
  );
}
