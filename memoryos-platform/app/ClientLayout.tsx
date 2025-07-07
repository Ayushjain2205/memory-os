"use client";
import { usePathname } from "next/navigation";
import { ProfileProvider } from "@/components/profile-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRoot = pathname === "/";
  return isRoot ? (
    <>{children}</>
  ) : (
    <ProfileProvider>{children}</ProfileProvider>
  );
}
