export async function uploadToCloudinary(file: string | Blob): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "unsigned_upload")

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dsrl47mtp/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to upload image: ${res.statusText}`)
  }

  const data = await res.json()
  return data.secure_url
}
