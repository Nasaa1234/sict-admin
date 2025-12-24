import React from "react"

export interface AddDetailModalProps {
  type: string
  setSectionDetail: React.Dispatch<React.SetStateAction<SeeDetailProps>>
  sectionDetail: SeeDetailProps
}

export interface SeeDetailProps {
  content?: string
  title?: string
  images?: string[] | undefined
  listItems?: string[]
  type?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  number?: number
}

export interface EventType {
  title: string
  description: string
  image: string
  _id?: string
  sections?: SectionType[]
  type: string
  content?: string
}

export interface SectionType {
  content: string
  images?: string[]
  listItems: string[]
  title: string
  __typename?: string
}
