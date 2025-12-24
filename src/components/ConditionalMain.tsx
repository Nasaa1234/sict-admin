"use client"

import { usePathname } from "next/navigation"

export function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return <main className={isLoginPage ? "" : "ml-64"}>{children}</main>
}
