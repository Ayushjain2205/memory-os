import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MemoryOS - Programmable Memory for AI",
  description: "The programmable memory layer for your AI to think in context.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
