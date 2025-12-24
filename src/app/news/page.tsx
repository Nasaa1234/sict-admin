"use client"

import { Cards } from "@/components/Cards"
import React from "react"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/useToast"
import { ProtectedRoute } from "@/components/ui/protected-route"

const NewsPage = () => {
  const { toast, showToast, hideToast } = useToast()

  return (
    <ProtectedRoute>
      <div className="w-full p-6 max-w-7xl mx-auto">
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        <div className="w-full">
          <Cards onSuccess={(message, type) => showToast(message, type)} />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default NewsPage
