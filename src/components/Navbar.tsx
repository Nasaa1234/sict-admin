"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

export const Navbar = () => {
  const { isAuthenticated, username } = useAuth()

  return (
    <nav className="sticky top-0 z-50 ml-64 w-[calc(100%-16rem)] border-b border-gray-200 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-opacity hover:opacity-80"
          >
            <div className="relative h-10 w-10 sm:h-12 sm:w-12">
              <Image
                src="/assets/images/ccs-logo.png"
                alt="CCS Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                CCS Admin
              </span>
              <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                Computer Communication & Security
              </span>
            </div>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold">
                  {username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {username}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
