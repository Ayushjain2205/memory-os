import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ProfileProvider } from "@/components/profile-provider"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "MemoryOS - Programmable Memory Vault for AI",
  description: "Your second brain - structured and searchable memory management for AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  )
}
