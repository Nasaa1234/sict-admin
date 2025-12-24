"use client"

import React from "react"
import Image from "next/image"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Button } from "./ui/button"
import { EventType } from "@/interface"

interface NewsFormFieldsProps {
  news: EventType
  onChange: (news: EventType) => void
  isUploading?: boolean
  onImageUpload?: (file: File) => Promise<void>
}

export const NewsFormFields: React.FC<NewsFormFieldsProps> = ({
  news,
  onChange,
  isUploading = false,
  onImageUpload,
}) => {
  const handleChange =
    (field: keyof EventType) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      onChange({ ...news, [field]: e.target.value })
    }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
      return
    }

    if (onImageUpload) {
      await onImageUpload(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          className="w-full"
          placeholder="Enter news article title..."
          value={news.title}
          onChange={handleChange("title")}
          required
          maxLength={200}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {news.title.length}/200 characters
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          rows={4}
          className="w-full resize-none"
          placeholder="Enter a brief description of the news article..."
          value={news.description}
          onChange={handleChange("description")}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Category <span className="text-red-500">*</span>
        </label>
        <Select
          value={news.type}
          onValueChange={(value) =>
            onChange({ ...news, type: value as EventType["type"] })
          }
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
            <SelectItem value="News">News</SelectItem>
            <SelectItem value="Announcement">Announcement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Featured Image
        </label>
        {news.image && !isUploading ? (
          <div className="relative group">
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <Image
                src={news.image}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onChange({ ...news, image: "" })}
                  className="gap-2"
                >
                  <svg
                    className="w-4 h-4"
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
                  Remove Image
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mb-3"></div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Uploading image...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Please wait
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span className="text-blue-600 dark:text-blue-400">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF or WEBP (MAX. 10MB)
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
        )}
      </div>
    </div>
  )
}
