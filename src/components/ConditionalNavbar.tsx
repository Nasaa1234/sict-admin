"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    return null
  }

  return (
    <>
      <Sidebar />
      <Navbar />
    </>
  )
}
