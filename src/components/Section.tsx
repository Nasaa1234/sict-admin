import { SeeDetailProps } from "@/interface"
import React from "react"

export const Section = ({
  title,
  content,
  images,
  number,
  onClick,
}: SeeDetailProps) => {
  return (
    <div
      onClick={onClick}
      className="shadow-sm bg-gray-50 border border-gray-300 p-2.5 rounded-lg mb-3 flex gap-3 cursor-pointer hover:bg-gray-100"
    >
      <div>{number})</div>
      <div>{images ? "images" : title ? title : content}</div>
    </div>
  )
}
