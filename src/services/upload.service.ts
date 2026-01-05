import axios from 'axios'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    // DEBUG: Log the config being used (masked for safety)
    console.log('Cloudinary Config:', {
        cloudName: CLOUD_NAME || 'MISSING',
        preset: UPLOAD_PRESET || 'MISSING',
        url: CLOUDINARY_URL
    })

    if (!CLOUD_NAME || CLOUD_NAME.startsWith('your_') || !UPLOAD_PRESET || UPLOAD_PRESET.startsWith('your_')) {
        console.error('CRITICAL: Cloudinary env vars appear to be placeholders or missing.')
        console.error('Please check your .env file and restart the dev server.')
        throw new Error('Cloudinary environment variables are not strictly configured')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    try {
        const response = await axios.post(CLOUDINARY_URL, formData)
        return response.data.secure_url
    } catch (error) {
        console.error('Image upload failed:', error)
        throw error
    }
}
