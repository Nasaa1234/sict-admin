"use client"

import React from "react"
import Image from "next/image"
import { SeeDetailProps } from "@/interface"

export const SectionPreview: React.FC<SeeDetailProps> = ({
  content,
  title,
  images,
  listItems,
}) => {
  return (
    <div className="mt-3 mb-10 text-center md:text-start flex flex-col gap-2">
      <div className="font-extrabold">{title}</div>
      <div className="text-l md:text-2xl">{content}</div>
      {images?.map((item: string, index: number) => (
        <div key={index} className="w-full">
          image {index + 1}
          <Image
            src={item}
            alt={`colleague-image-${index}`}
            width={1000}
            height={500}
          />
        </div>
      ))}
      {listItems?.map((item: string, index: number) => (
        <div key={index} className="w-full">
          image {index + 1}
          <Image
            src={item}
            alt={`colleague-image-${index}`}
            width={1000}
            height={500}
          />
        </div>
      ))}
    </div>
  )
}
