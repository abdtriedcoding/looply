// File upload utility functions and configurations
// This file handles file validation, size limits, and database integration points

import { File, FileText, Image as ImageIcon } from "lucide-react"

import { Id } from "../../convex/_generated/dataModel"

// File type configurations
export const FILE_TYPES = {
  image: {
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    icon: ImageIcon,
  },
  document: {
    extensions: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/rtf",
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    icon: FileText,
  },
} as const

export const MAX_FILES = 5
export const TOTAL_MAX_SIZE = 50 * 1024 * 1024 // 50MB total

export type FileType = keyof typeof FILE_TYPES

// Get file type based on extension and MIME type
export const getFileType = (file: File): FileType | "other" => {
  const extension = "." + file.name.split(".").pop()?.toLowerCase()
  const mimeType = file.type.toLowerCase()

  if (
    FILE_TYPES.image.extensions.includes(extension) ||
    FILE_TYPES.image.mimeTypes.includes(mimeType)
  ) {
    return "image"
  }
  if (
    FILE_TYPES.document.extensions.includes(extension) ||
    FILE_TYPES.document.mimeTypes.includes(mimeType)
  ) {
    return "document"
  }
  return "other"
}

// Validate individual file
export const validateFile = (file: File): string | null => {
  const fileType = getFileType(file)

  if (fileType === "other") {
    return "Unsupported file type"
  }

  const config = FILE_TYPES[fileType as FileType]
  if (file.size > config.maxSize) {
    return `File too large. Max size: ${(config.maxSize / (1024 * 1024)).toFixed(1)}MB`
  }

  return null
}

// Validate multiple files and check limits
export const validateFiles = (
  newFiles: File[],
  existingFiles: File[]
): { errors: string[]; validFiles: File[] } => {
  const errors: string[] = []
  const validFiles: File[] = []

  // Check total file count
  if (existingFiles.length + newFiles.length > MAX_FILES) {
    errors.push(`Maximum ${MAX_FILES} files allowed`)
  }

  // Check total size
  const currentTotalSize = existingFiles.reduce(
    (sum, file) => sum + file.size,
    0
  )
  const newTotalSize = newFiles.reduce((sum, file) => sum + file.size, 0)
  if (currentTotalSize + newTotalSize > TOTAL_MAX_SIZE) {
    errors.push(
      `Total file size exceeds ${(TOTAL_MAX_SIZE / (1024 * 1024)).toFixed(1)}MB`
    )
  }

  // Validate each file
  newFiles.forEach((file) => {
    const error = validateFile(file)
    if (error) {
      errors.push(`${file.name}: ${error}`)
    } else {
      validFiles.push(file)
    }
  })

  return { errors, validFiles }
}

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Get appropriate icon for file type
export const getFileIcon = (file: File) => {
  const fileType = getFileType(file)
  if (fileType === "image") return FILE_TYPES.image.icon
  if (fileType === "document") return FILE_TYPES.document.icon
  return File
}

export const uploadFileToStorage = async (
  file: File,
  postUrl: string
): Promise<string> => {
  const res = await fetch(postUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  })

  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)

  const data = await res.json()
  if (!data.storageId) throw new Error("No storage ID returned")

  return data.storageId
}

export const processFileUploads = async (
  files: File[],
  postUrl: string
): Promise<{
  success: boolean
  urls?: Id<"_storage">[]
  errors?: string[]
}> => {
  if (!files.length) return { success: true, urls: [] }

  const results = await Promise.allSettled(
    files.map((file) => uploadFileToStorage(file, postUrl))
  )

  const urls: Id<"_storage">[] = []
  const errors: string[] = []

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      urls.push(result.value as Id<"_storage">)
    } else {
      errors.push(`Failed to upload ${files[i].name}: ${result.reason}`)
    }
  })

  return {
    success: urls.length > 0,
    ...(urls.length > 0 && { urls }),
    ...(errors.length > 0 && { errors }),
  }
}
