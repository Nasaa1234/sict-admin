"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { NewsFormFields } from "./NewsFormFields"
import { SectionManager } from "./SectionManager"
import { SectionEditorModal } from "./SectionEditorModal"
import { EventType, SectionType } from "@/interface"
import { useImageUpload } from "@/hooks/useImageUpload"
import { useSectionUpload } from "@/hooks/useSectionUpload"

interface EditNewsModalProps {
  news: EventType
  isOpen: boolean
  onClose: () => void
  onSave: (updatedNews: EventType) => Promise<void>
}

export const EditNewsModal: React.FC<EditNewsModalProps> = ({
  news,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedNews, setEditedNews] = useState<EventType>({ ...news })
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null
  )
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isUploading, uploadImage } = useImageUpload()
  const { uploadSectionImages } = useSectionUpload()

  const handleSave = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // Upload section images if needed
      // Convert SectionType[] to SeeDetailProps[] for uploadSectionImages
      const sectionsForUpload = (editedNews.sections || []).map((section) => ({
        title: section.title,
        content: section.content,
        images: section.images,
        listItems: section.listItems,
      }))

      const sectionsWithUploadedImages = await uploadSectionImages(
        sectionsForUpload
      )

      // Convert back to SectionType[]
      const sectionsAsSectionType: SectionType[] =
        sectionsWithUploadedImages.map((section) => ({
          title: section.title || "",
          content: section.content || "",
          images: section.images,
          listItems: section.listItems || [],
        }))

      const newsToSave: EventType = {
        ...editedNews,
        sections: sectionsAsSectionType,
      }

      await onSave(newsToSave)
    } catch (error) {
      console.error("Error saving news:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSection = (index: number, section: SectionType) => {
    handleUpdateSection(index, section)
  }

  const handleAddSection = (section: SectionType) => {
    setEditedNews({
      ...editedNews,
      sections: [...(editedNews.sections || []), section],
    })
  }

  const handleUpdateSection = (index: number, section: SectionType) => {
    const updatedSections = [...(editedNews.sections || [])]
    updatedSections[index] = section
    setEditedNews({ ...editedNews, sections: updatedSections })
  }

  const handleDeleteSection = (index: number) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      const updatedSections =
        editedNews.sections?.filter((_, i) => i !== index) || []
      setEditedNews({ ...editedNews, sections: updatedSections })
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file)
      setEditedNews({ ...editedNews, image: imageUrl })
    } catch (error) {
      console.error("Error uploading image:", error)
      alert(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit News</DialogTitle>
          </DialogHeader>
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Edit News Article
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Update the news article and its sections
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <NewsFormFields
                news={editedNews}
                onChange={setEditedNews}
                isUploading={isUploading}
                onImageUpload={handleImageUpload}
              />

              <SectionManager
                sections={editedNews.sections || []}
                onAddSection={() => {
                  setEditingSectionIndex(null)
                  setIsSectionModalOpen(true)
                }}
                onEditSection={handleEditSection}
                onDeleteSection={handleDeleteSection}
              />
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 -mx-6 px-6 py-5 flex items-center justify-end gap-3 shadow-lg">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SectionEditorModal
        isOpen={isSectionModalOpen}
        onClose={() => {
          setIsSectionModalOpen(false)
          setEditingSectionIndex(null)
        }}
        onSave={(section) => {
          if (editingSectionIndex !== null) {
            handleUpdateSection(editingSectionIndex, section)
          } else {
            handleAddSection(section)
          }
          setIsSectionModalOpen(false)
          setEditingSectionIndex(null)
        }}
        initialSection={
          editingSectionIndex !== null
            ? (editedNews.sections || [])[editingSectionIndex]
            : undefined
        }
        mode={editingSectionIndex !== null ? "edit" : "add"}
      />
    </>
  )
}
