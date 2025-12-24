import { uploadToCloudinary } from "@/lib/cloudinary"
import { SeeDetailProps } from "@/interface"

export const useSectionUpload = () => {
  const uploadSectionImages = async (sections: SeeDetailProps[]) => {
    return Promise.all(
      sections.map(async (section) => {
        const updatedSection = { ...section }

        if (section.images && Array.isArray(section.images)) {
          updatedSection.images = await Promise.all(
            section.images.map(async (img: string) => {
              if (img.startsWith("http")) return img
              const response = await fetch(img)
              const blob = await response.blob()
              return await uploadToCloudinary(blob)
            })
          )
        }

        if (section.listItems && Array.isArray(section.listItems)) {
          updatedSection.listItems = await Promise.all(
            section.listItems.map(async (item: string) => {
              if (item.startsWith("http")) return item
              const response = await fetch(item)
              const blob = await response.blob()
              return await uploadToCloudinary(blob)
            })
          )
        }

        return updatedSection
      })
    )
  }

  return { uploadSectionImages }
}
