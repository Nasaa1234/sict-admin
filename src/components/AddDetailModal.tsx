"use client"
import { AddDetailModalProps, SeeDetailProps } from "@/interface"
import React, { useState } from "react"
import Image from "next/image"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { uploadToCloudinary } from "@/lib/cloudinary"

export const AddDetailModal: React.FC<AddDetailModalProps> = ({
  type,
  setSectionDetail,
  sectionDetail,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      console.error("No file selected")
      return
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
      return
    }

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAddImage = async (prop: string) => {
    if (!selectedFile) {
      alert("No image selected")
      return
    }

    try {
      setIsUploading(true)
      const imageUrl = await uploadToCloudinary(selectedFile)

      setSectionDetail((prevDetails: SeeDetailProps) => {
        const currentArray =
          prop === "images"
            ? prevDetails.images || []
            : prop === "listItems"
            ? prevDetails.listItems || []
            : []

        return {
          ...prevDetails,
          [prop]: [...currentArray, imageUrl],
        } as SeeDetailProps
      })

      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    } finally {
      setIsUploading(false)
    }
  }
  const handleRemoveImage = (prop: string, index: number) => {
    setSectionDetail((prevDetails: SeeDetailProps) => {
      const currentArray =
        prop === "images"
          ? prevDetails.images || []
          : prop === "listItems"
          ? prevDetails.listItems || []
          : []

      return {
        ...prevDetails,
        [prop]: currentArray.filter((_, i) => i !== index),
      } as SeeDetailProps
    })
  }

  const renderFileInput = (label: string, prop: string) => (
    <div>
      <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>

      <div className="mb-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <svg
                  className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF or WEBP
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        {/* Preview and Add Button */}
        {previewUrl && !isUploading && (
          <div className="mt-3 flex items-center gap-3">
            <div className="relative">
              <Image
                src={previewUrl}
                alt="Preview"
                width={100}
                height={100}
                className="rounded-lg object-cover border border-gray-300"
              />
            </div>
            <Button
              type="button"
              className="flex-1"
              onClick={() => handleAddImage(prop)}
            >
              Add Image
            </Button>
          </div>
        )}
      </div>

      {/* Uploaded Images Grid */}
      {(prop === "images" ? sectionDetail.images : sectionDetail.listItems)
        ?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Uploaded images (
            {(prop === "images"
              ? sectionDetail.images
              : sectionDetail.listItems
            )?.length || 0}
            )
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(prop === "images"
              ? sectionDetail.images
              : sectionDetail.listItems
            )?.map((el: string, index: number) => (
              <div key={index} className="relative group">
                <Image
                  src={el}
                  alt={`${label}-${index}`}
                  width={150}
                  height={150}
                  className="rounded-lg object-cover w-full h-24 border border-gray-300"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveImage(prop, index)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (type) {
      case "Images":
        return renderFileInput("Images", "images")
      case "List":
        return renderFileInput("List Items", "listItems")
      default:
        return (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Content <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={6}
              className="w-full resize-none"
              placeholder="Enter section content..."
              value={sectionDetail?.content ?? ""}
              onChange={(e) =>
                setSectionDetail((prevDetails: SeeDetailProps) => ({
                  ...prevDetails,
                  content: e.target.value,
                }))
              }
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              You can use line breaks and links in your content
            </p>
          </div>
        )
    }
  }

  return <div className="text-start">{renderContent()}</div>
}
