"use client"

import { useState } from "react"
import { uploadToCloudinary } from "@/lib/cloudinary"

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true)
    setUploadProgress("Uploading image...")

    try {
      const imageUrl = await uploadToCloudinary(file)
      setUploadProgress("")
      return imageUrl
    } catch (error) {
      setUploadProgress("")
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return {
    isUploading,
    uploadProgress,
    uploadImage,
  }
}
