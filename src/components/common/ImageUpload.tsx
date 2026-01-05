import { useState, useRef } from 'react'
import { uploadImageToCloudinary } from '@/services/upload.service'
import { toast } from 'react-hot-toast'

interface ImageUploadProps {
    images: string[]
    onUploadStart: () => void
    onUploadSuccess: (url: string) => void
    onUploadError: (error: Error) => void
    onRemove: (imageToRemove: string) => void
}

interface ActiveUpload {
    id: string
    file: File
    preview: string // Local object URL
    status: 'uploading' | 'error'
    progress: number // Just a placeholder for now, since simple fetch/axios doesn't always track perfectly without config
}

const ImageUpload = ({
    images,
    onUploadStart,
    onUploadSuccess,
    onUploadError,
    onRemove,
}: ImageUploadProps) => {
    const [activeUploads, setActiveUploads] = useState<ActiveUpload[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        // Clear input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = ''

        // Start uploads
        files.forEach((file) => {
            const uploadId = Math.random().toString(36).substring(7)
            const previewUrl = URL.createObjectURL(file)

            // 1. Update Local State
            setActiveUploads((prev) => [
                ...prev,
                { id: uploadId, file, preview: previewUrl, status: 'uploading', progress: 0 },
            ])

            // 2. Notify Parent
            onUploadStart()

            // 3. Perform Upload
            uploadImageToCloudinary(file)
                .then((url) => {
                    // Success
                    onUploadSuccess(url)
                    // Remove from active uploads
                    setActiveUploads((prev) => prev.filter((u) => u.id !== uploadId))
                })
                .catch((error) => {
                    // Error
                    console.error('Upload error:', error)
                    onUploadError(error)
                    // Remove from active uploads (or keep with error state if we wanted retry, but simpler to remove)
                    setActiveUploads((prev) => prev.filter((u) => u.id !== uploadId))
                    toast.error(`Failed to upload ${file.name}`)
                })
        })
    }

    return (
        <div className="space-y-4">
            {/* Grid of Images */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Existing Images */}
                {images.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900">
                        <img
                            src={url}
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => onRemove(url)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}

                {/* Active Uploads (Ghosts) */}
                {activeUploads.map((upload) => (
                    <div key={upload.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 group">
                        {/* Preview Image */}
                        <img
                            src={upload.preview}
                            alt="Uploading..."
                            className="w-full h-full object-cover opacity-50"
                        />

                        {/* Spinner Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                            <span className="text-xs text-slate-700 dark:text-neutral-200 font-medium truncate w-full text-center bg-white/50 dark:bg-black/50 rounded px-1">
                                {upload.file.name}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Add Button */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-neutral-900/50 flex flex-col items-center justify-center cursor-pointer transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 group-hover:text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm text-slate-500 group-hover:text-blue-600">Add Image</span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-neutral-500">
                Supported formats: JPG, PNG, WEBP. Max size: 5MB.
            </p>
        </div>
    )
}

export default ImageUpload
