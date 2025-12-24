"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/add-news")
  }, [router])

  return (
    <ProtectedRoute>
      <div className="w-full p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Home
