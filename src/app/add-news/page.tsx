"use client"

import { AddCard } from "@/components/AddCard"
import React from "react"
import { useRouter } from "next/navigation"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/useToast"
import { ProtectedRoute } from "@/components/ui/protected-route"

const AddNewsPage = () => {
  const router = useRouter()
  const { toast, showToast, hideToast } = useToast()

  const handleSuccess = () => {
    showToast("News added successfully!", "success")
    setTimeout(() => {
      router.push("/news")
    }, 1000)
  }

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
          <AddCard
            onSuccess={handleSuccess}
            onError={(error) =>
              showToast(
                `Failed to add news: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
                "error"
              )
            }
          />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default AddNewsPage
