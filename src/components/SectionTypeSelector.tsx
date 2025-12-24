"use client"

import React from "react"

interface SectionTypeOption {
  value: string
  label: string
  icon: string
  desc?: string
}

interface SectionTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  compact?: boolean
}

const TYPE_OPTIONS: SectionTypeOption[] = [
  {
    value: "Content",
    label: "Text Content",
    icon: "M4 6h16M4 12h16M4 18h16",
    desc: "Add text content",
  },
  {
    value: "Images",
    label: "Image Gallery",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    desc: "Upload multiple images",
  },
  {
    value: "List",
    label: "List Items",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    desc: "Add list items",
  },
]

export const SectionTypeSelector: React.FC<SectionTypeSelectorProps> = ({
  value,
  onChange,
  compact = false,
}) => {
  const options = compact
    ? TYPE_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label
          .replace(" Content", "")
          .replace(" Gallery", "")
          .replace(" Items", ""),
        icon: option.icon,
      }))
    : TYPE_OPTIONS

  return (
    <div
      className={`grid ${compact ? "grid-cols-3 gap-4" : "grid-cols-3 gap-6"}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`${
            compact ? "p-4 rounded-lg" : "p-6 rounded-xl"
          } border-2 transition-all text-left ${
            value === option.value
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
          }`}
        >
          <svg
            className={`${compact ? "w-6 h-6 mb-2" : "w-8 h-8 mb-3"} ${
              value === option.value
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={option.icon}
            />
          </svg>
          <div
            className={`${compact ? "text-sm" : "text-base"} font-semibold ${
              compact ? "mb-0" : "mb-1"
            } ${
              value === option.value
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {option.label}
          </div>
          {!compact &&
            TYPE_OPTIONS.find((o) => o.value === option.value)?.desc && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {TYPE_OPTIONS.find((o) => o.value === option.value)?.desc}
              </div>
            )}
        </button>
      ))}
    </div>
  )
}
