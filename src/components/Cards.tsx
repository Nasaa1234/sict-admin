"use client"

import React, { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useMutation, useQuery } from "@apollo/client"
import { GET_ALL_NEWS, DELETE_NEWS } from "@/graphql"
import { EDIT_NEWS } from "@/graphql/mutations"
import { EventType } from "@/interface"
import Image from "next/image"
import { EditNewsModal } from "./EditNewsModal"

interface CardsProps {
  onSuccess?: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void
}

const SeeDetail = (props: EventType) => {
  const { title, image, sections, description, type, _id } = props

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl  border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {type || "Unknown"}
              </span>
              {_id && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  ID: {_id.slice(-8)}
                </span>
              )}
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        {image && (
          <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              src={image}
              alt={title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      {sections && sections.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sections ({sections.length})
            </h2>
          </div>
          <div className="grid gap-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    {section.title && (
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {section.title}
                      </h3>
                    )}
                    {section.content && (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {section.content}
                      </p>
                    )}
                  </div>
                </div>

                {section.images && section.images.length > 0 && (
                  <div className="ml-14">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Images ({section.images.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {section.images.map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <Image
                            src={img}
                            alt={`Section ${idx + 1} image ${imgIdx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section.listItems && section.listItems.length > 0 && (
                  <div className="ml-14">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      List Items ({section.listItems.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {section.listItems.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                          <Image
                            src={item}
                            alt={`Section ${idx + 1} list item ${itemIdx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No sections added to this news article
          </p>
        </div>
      )}
    </div>
  )
}

export const Cards: React.FC<CardsProps> = ({ onSuccess }) => {
  const { data, loading, refetch } = useQuery(GET_ALL_NEWS)
  const [deleteNews] = useMutation(DELETE_NEWS)
  const [editNewsMutation] = useMutation(EDIT_NEWS)
  const [selectedSection, setSelectedSection] = useState<EventType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [editingNews, setEditingNews] = useState<EventType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const filteredNews = useMemo(() => {
    if (!data?.getAllNews) return []

    return data.getAllNews.filter((news: EventType) => {
      const matchesSearch =
        news.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = filterType === "all" || news.type === filterType

      return matchesSearch && matchesType
    })
  }, [data?.getAllNews, searchQuery, filterType])

  const handleDelete = async (newsId: string) => {
    if (!newsId) return

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this news? This action cannot be undone."
    )

    if (!isConfirmed) {
      return
    }

    try {
      const { data: deleteData } = await deleteNews({
        variables: { newsId },
      })

      if (deleteData?.deleteNews?.success) {
        onSuccess?.("News deleted successfully", "success")
        await refetch()
        setIsModalOpen(false)
        setSelectedSection(null)
      } else {
        onSuccess?.("Failed to delete news", "error")
      }
    } catch (error) {
      console.error("Error deleting news:", error)
      onSuccess?.(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error"
      )
    }
  }

  const uniqueTypes = useMemo(() => {
    if (!data?.getAllNews) return []
    const types = new Set(data.getAllNews.map((news: EventType) => news.type))
    return Array.from(types) as string[]
  }, [data?.getAllNews])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search news by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="sm:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type: string) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>
          Total:{" "}
          <strong className="text-gray-900 dark:text-white">
            {data?.getAllNews?.length || 0}
          </strong>
        </span>
        <span>
          Showing:{" "}
          <strong className="text-gray-900 dark:text-white">
            {filteredNews.length}
          </strong>
        </span>
      </div>

      {/* News Cards Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || filterType !== "all"
              ? "No news found matching your criteria"
              : "No news articles yet. Create your first one!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((news: EventType, index: number) => (
            <div
              key={news._id || index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => {
                setSelectedSection(news as EventType)
                setIsModalOpen(true)
              }}
            >
              {news.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={news.image}
                    alt={news.title || "News image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                    {news.title || "Untitled"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {news.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {news.type || "Unknown"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {news.sections?.length || 0} sections
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      {selectedSection && (
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) {
              setSelectedSection(null)
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>News Details</DialogTitle>
            </DialogHeader>
            <div>
              <SeeDetail {...selectedSection} />

              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 -mx-6 px-6 py-5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{selectedSection.sections?.length || 0} sections</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/30"
                    onClick={() => {
                      setEditingNews(selectedSection)
                      setIsEditModalOpen(true)
                      setIsModalOpen(false)
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit News
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false)
                      setSelectedSection(null)
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${selectedSection.title}"? This action cannot be undone.`
                        ) &&
                        selectedSection._id
                      ) {
                        handleDelete(selectedSection._id)
                      }
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete News
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit News Modal */}
      {editingNews && (
        <EditNewsModal
          news={editingNews}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingNews(null)
          }}
          onSave={async (updatedNews) => {
            try {
              // Ensure all required fields are present and valid
              if (
                !updatedNews.title ||
                !updatedNews.description ||
                !updatedNews.type
              ) {
                throw new Error(
                  "Title, description, and type are required fields"
                )
              }

              // Build input object, only include image if it exists
              const input: {
                title: string
                description: string
                type: string
                sections: typeof updatedNews.sections
                image?: string
              } = {
                title: updatedNews.title.trim(),
                description: updatedNews.description.trim(),
                type: updatedNews.type.trim(),
                sections: updatedNews.sections || [],
              }

              // Only include image if it has a value
              if (updatedNews.image && updatedNews.image.trim().length > 0) {
                input.image = updatedNews.image.trim()
              }

              await editNewsMutation({
                variables: {
                  newsId: updatedNews._id,
                  input,
                },
              })
              onSuccess?.("News updated successfully!", "success")
              await refetch()
              setIsEditModalOpen(false)
              setEditingNews(null)
            } catch (error) {
              console.error("Edit news error:", error)
              onSuccess?.(
                `Failed to update news: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
                "error"
              )
            }
          }}
        />
      )}
    </div>
  )
}
