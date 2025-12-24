"use client"

import React from "react"
import { Input } from "./ui/input"
import { SectionTypeSelector } from "./SectionTypeSelector"
import { AddDetailModal } from "./AddDetailModal"
import { SeeDetailProps } from "@/interface"

interface SectionFormFieldsProps {
  sectionDetail: SeeDetailProps
  setSectionDetail: React.Dispatch<React.SetStateAction<SeeDetailProps>>
  addType: string
  setAddType: (type: string) => void
  compact?: boolean
}

export const SectionFormFields: React.FC<SectionFormFieldsProps> = ({
  sectionDetail,
  setSectionDetail,
  addType,
  setAddType,
  compact = false,
}) => {
  return (
    <div className={`flex flex-col ${compact ? "gap-4" : "gap-8"}`}>
      <div
        className={`bg-gray-50 dark:bg-gray-900 rounded-xl ${
          compact ? "p-4" : "p-8"
        }`}
      >
        <div className={compact ? "mb-4" : "mb-8"}>
          <label
            className={`block ${
              compact ? "mb-2 text-sm" : "mb-4 text-base"
            } font-medium text-gray-900 dark:text-white`}
          >
            Section Title{" "}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <Input
            type="text"
            className="w-full"
            placeholder="Enter section title..."
            value={sectionDetail.title || ""}
            onChange={(e) =>
              setSectionDetail((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label
            className={`block ${
              compact ? "mb-2 text-sm" : "mb-4 text-base"
            } font-medium text-gray-900 dark:text-white`}
          >
            Section Type <span className="text-red-500">*</span>
          </label>
          <SectionTypeSelector
            value={addType}
            onChange={setAddType}
            compact={compact}
          />
        </div>
      </div>

      <div
        className={`bg-white dark:bg-gray-800 rounded-xl ${
          compact ? "p-4" : "p-8"
        } border border-gray-200 dark:border-gray-700`}
      >
        <AddDetailModal
          type={addType}
          setSectionDetail={setSectionDetail}
          sectionDetail={sectionDetail}
        />
      </div>
    </div>
  )
}
