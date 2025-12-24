"use client"

import React, { useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { EventType, SeeDetailProps, SectionType } from "@/interface"
import { useMutation } from "@apollo/client"
import { ADD_NEWS } from "@/graphql/mutations"
import { NewsFormFields } from "./NewsFormFields"
import { SectionManager } from "./SectionManager"
import { SectionEditorModal } from "./SectionEditorModal"
import { useImageUpload } from "@/hooks/useImageUpload"
import { useSectionUpload } from "@/hooks/useSectionUpload"
import { SectionPreview } from "./SectionPreview"

interface AddCardProps {
  onSuccess?: () => void
  onError?: (error: Error | unknown) => void
}

export const AddCard: React.FC<AddCardProps> = ({ onSuccess, onError }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState<boolean>(false)
  const [selectedSection, setSelectedSection] = useState<SeeDetailProps | null>(
    null
  )
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null
  )
  const [addNewsValue, setAddNewsValue] = useState<EventType>({
    title: "",
    description: "",
    type: "Education",
    sections: [],
    image: "",
  })

  const [addNews] = useMutation(ADD_NEWS)
  const { isUploading, uploadProgress, uploadImage } = useImageUpload()
  const { uploadSectionImages } = useSectionUpload()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isUploading || isSubmitting) return

    try {
      setIsSubmitting(true)

      let finalImage = addNewsValue.image
      if (addNewsValue.image && typeof addNewsValue.image !== "string") {
        finalImage = ""
      } else if (addNewsValue.image && !addNewsValue.image.startsWith("http")) {
        finalImage = addNewsValue.image
      }

      const sectionsWithUploadedImages = await uploadSectionImages(
        addNewsValue.sections || []
      )

      const { data } = await addNews({
        variables: {
          input: {
            ...addNewsValue,
            image: finalImage,
            sections: sectionsWithUploadedImages,
          },
        },
      })

      if (data) {
        setAddNewsValue({
          title: "",
          description: "",
          type: "Education",
          sections: [],
          image: "",
        })
        onSuccess?.()
      } else {
        throw new Error("Failed to add news")
      }
    } catch (error) {
      console.error("Error submitting news:", error)
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file)
      setAddNewsValue((prevValue) => ({
        ...prevValue,
        image: imageUrl,
      }))
    } catch (error) {
      console.error("Error uploading image:", error)
      alert(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    }
  }

  const handleAddSection = (section: SectionType) => {
    setAddNewsValue({
      ...addNewsValue,
      sections: [...(addNewsValue.sections || []), section],
    })
  }

  const handleEditSection = (index: number, section: SectionType) => {
    const updatedSections = [...(addNewsValue.sections || [])]
    updatedSections[index] = section
    setAddNewsValue({
      ...addNewsValue,
      sections: updatedSections,
    })
  }

  const handleDeleteSection = (index: number) => {
    if (
      window.confirm(`Are you sure you want to delete section ${index + 1}?`)
    ) {
      setAddNewsValue({
        ...addNewsValue,
        sections: (addNewsValue.sections || []).filter((_, i) => i !== index),
      })
    }
  }

  return (
    <div className="w-full max-w-5xl ">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h2>
          <NewsFormFields
            news={addNewsValue}
            onChange={setAddNewsValue}
            isUploading={isUploading}
            onImageUpload={handleImageUpload}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Content Sections
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add sections to organize your content
            </p>
          </div>
          <SectionManager
            sections={addNewsValue.sections || []}
            onAddSection={() => {
              setEditingSectionIndex(null)
              setIsSectionModalOpen(true)
            }}
            onEditSection={(index, section) => {
              handleEditSection(index, section)
            }}
            onDeleteSection={handleDeleteSection}
          />
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4 mt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {addNewsValue.sections?.length || 0} section
              {(addNewsValue.sections?.length || 0) !== 1 ? "s" : ""} added
            </div>
            <Button
              type="submit"
              disabled={isUploading || isSubmitting}
              size="lg"
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {uploadProgress || "Publishing..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Publish News Article
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>

      <SectionEditorModal
        isOpen={isSectionModalOpen}
        onClose={() => {
          setIsSectionModalOpen(false)
          setEditingSectionIndex(null)
        }}
        onSave={(section) => {
          if (editingSectionIndex !== null) {
            handleEditSection(editingSectionIndex, section)
          } else {
            handleAddSection(section)
          }
          setIsSectionModalOpen(false)
          setEditingSectionIndex(null)
        }}
        initialSection={
          editingSectionIndex !== null
            ? (addNewsValue.sections || [])[editingSectionIndex]
            : undefined
        }
        mode={editingSectionIndex !== null ? "edit" : "add"}
      />

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            <SectionPreview {...selectedSection} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
