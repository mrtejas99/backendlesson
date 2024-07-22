import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload an image
const uploadFile = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    return response
  } catch (e) {
    console.log(`File upload failed: ${e}`)
  }
  fs.unlinkSync(localFilePath)
}

//delete only image from cloudinary in case a new one is added
const deleteFile = async (url) => {
  try {
    const match = url.match(/\/([^\/]+)\.[^\/]+$/)
    let shortId = ""
    if (match) shortId = match[1]

    const response = await cloudinary.uploader.destroy(shortId, (result) => {
      console.log(result)
    })
    console.log(response)
    return response
  } catch (e) {
    console.log(`File upload failed: ${e}`)
  }
}
export { uploadFile, deleteFile }
