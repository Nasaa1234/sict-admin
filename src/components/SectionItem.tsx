"use client"

import React from "react"
import { Button } from "./ui/button"
import { SectionType } from "@/interface"

interface SectionItemProps {
  section: SectionType
  index: number
  onEdit: () => void
  onDelete: () => void
}

export const SectionItem: React.FC<SectionItemProps> = ({
  section,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3 flex-1">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          {section.title ? (
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
              {section.title}
            </h4>
          ) : (
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Section {index + 1}
            </h4>
          )}
          {section.content && (
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {section.content}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {section.content && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Text
              </span>
            )}
            {section.images && section.images.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {section.images.length} image
                {section.images.length !== 1 ? "s" : ""}
              </span>
            )}
            {section.listItems && section.listItems.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {section.listItems.length} item
                {section.listItems.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onEdit}
          title="Edit section"
          className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          title="Delete section"
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </Button>
      </div>
    </div>
  )
}
