"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { SectionFormFields } from "./SectionFormFields"
import { SeeDetailProps, SectionType } from "@/interface"

const getSectionType = (section?: SectionType): string => {
  if (!section) return "Content"
  if (section.images && section.images.length > 0) return "Images"
  if (section.listItems && section.listItems.length > 0) return "List"
  return "Content"
}

interface SectionEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (section: SectionType) => void
  initialSection?: SectionType
  mode: "add" | "edit"
}

export const SectionEditorModal: React.FC<SectionEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSection,
  mode,
}) => {
  const [sectionDetail, setSectionDetail] = useState<SeeDetailProps>(
    initialSection
      ? {
          title: initialSection.title || "",
          content: initialSection.content || "",
          images: initialSection.images || [],
          listItems: initialSection.listItems || [],
        }
      : { content: "" }
  )
  const [addType, setAddType] = useState<string>(getSectionType(initialSection))

  const handleSave = () => {
    const newSection: SectionType = {
      content: sectionDetail.content || "",
      title: sectionDetail.title || "",
      images: sectionDetail.images || [],
      listItems: sectionDetail.listItems || [],
    }
    onSave(newSection)
    setSectionDetail({ content: "" })
    setAddType("Content")
  }

  const handleClose = () => {
    setSectionDetail(
      initialSection
        ? {
            title: initialSection.title || "",
            content: initialSection.content || "",
            images: initialSection.images || [],
            listItems: initialSection.listItems || [],
          }
        : { content: "" }
    )
    setAddType(getSectionType(initialSection))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Section" : "Add Section"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {mode === "edit" ? "Edit Section" : "Add Section"}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {mode === "edit"
                ? "Update the section content"
                : "Add a new content section"}
            </p>
          </div>

          <SectionFormFields
            sectionDetail={sectionDetail}
            setSectionDetail={setSectionDetail}
            addType={addType}
            setAddType={setAddType}
          />

          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 -mx-6 px-6 py-5 flex items-center justify-end gap-4 shadow-lg">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              {mode === "edit" ? "Update Section" : "Add Section"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
