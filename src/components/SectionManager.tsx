"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { SectionType, SeeDetailProps } from "@/interface"
import { SectionItem } from "./SectionItem"
import { SectionFormFields } from "./SectionFormFields"

interface SectionManagerProps {
  sections: SectionType[]
  onAddSection: () => void
  onEditSection: (index: number, section: SectionType) => void
  onDeleteSection: (index: number) => void
}

const getSectionType = (section: SectionType): string => {
  if (section.images && section.images.length > 0) return "Images"
  if (section.listItems && section.listItems.length > 0) return "List"
  return "Content"
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  onAddSection,
  onEditSection,
  onDeleteSection,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editSectionDetail, setEditSectionDetail] = useState<SeeDetailProps>({
    content: "",
  })
  const [editAddType, setEditAddType] = useState<string>("Content")

  const handleStartEdit = (index: number, section: SectionType) => {
    setEditingIndex(index)
    setEditSectionDetail({
      title: section.title || "",
      content: section.content || "",
      images: section.images || [],
      listItems: section.listItems || [],
    })
    setEditAddType(getSectionType(section))
  }

  const handleSaveEdit = (index: number) => {
    const updatedSection: SectionType = {
      content: editSectionDetail.content || "",
      title: editSectionDetail.title || "",
      images: editSectionDetail.images || [],
      listItems: editSectionDetail.listItems || [],
    }
    onEditSection(index, updatedSection)
    setEditingIndex(null)
    setEditSectionDetail({ content: "" })
    setEditAddType("Content")
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditSectionDetail({ content: "" })
    setEditAddType("Content")
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Sections ({sections.length})
        </h3>
        <Button type="button" onClick={onAddSection}>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            No sections added yet
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Click &quot;Add Section&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="group bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              {editingIndex === idx ? (
                <div className="space-y-4">
                  <SectionFormFields
                    sectionDetail={editSectionDetail}
                    setSectionDetail={setEditSectionDetail}
                    addType={editAddType}
                    setAddType={setEditAddType}
                    compact
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={() => handleSaveEdit(idx)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <SectionItem
                  section={section}
                  index={idx}
                  onEdit={() => handleStartEdit(idx, section)}
                  onDelete={() => onDeleteSection(idx)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
