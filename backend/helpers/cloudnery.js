import { v2 as cloudinary} from 'cloudinary'
import dotenv from "dotenv"

dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// console.log(process.env.CLOUDINARY_CLOUD_NAME)
// console.log(process.env.CLOUDINARY_API_KEY)
// console.log(process.env.CLOUDINARY_API_SECRET)

const UploadMeida = async(filePath) => {
    // console.log(filePath)
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })

        return result
    } catch (error) {
        console.log(error)
        throw new Error("Error while uploding to cloud")
    }
}

const deleteMedia = async(publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log(error)
        throw new Error("Failed to delete asset from Cloudinary")
    }
}

export {UploadMeida,deleteMedia}