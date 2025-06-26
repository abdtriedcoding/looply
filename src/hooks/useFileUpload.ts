import { useCallback, useEffect, useRef, useState } from "react"

import { MAX_FILES, validateFiles } from "@/lib/file-upload"

interface UseFileUploadReturn {
  selectedFiles: File[]
  fileErrors: string[]
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (index: number) => void
  clearFiles: () => void
  clearErrors: () => void
  getFileUrl: (file: File) => string
}

export function useFileUpload(): UseFileUploadReturn {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileErrors, setFileErrors] = useState<string[]>([])
  const objectUrlsRef = useRef<Map<File, string>>(new Map())

  // Clean up object URLs when files are removed
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url)
      })
      objectUrlsRef.current.clear()
    }
  }, [])

  const getFileUrl = useCallback((file: File): string => {
    if (!objectUrlsRef.current.has(file)) {
      const url = URL.createObjectURL(file)
      objectUrlsRef.current.set(file, url)
    }
    return objectUrlsRef.current.get(file)!
  }, [])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files) return

      const newFiles = Array.from(files)
      const { errors, validFiles } = validateFiles(newFiles, selectedFiles)

      if (errors.length > 0) {
        setFileErrors(errors)
        setTimeout(() => setFileErrors([]), 5000)
      }

      if (validFiles.length > 0) {
        const remainingSlots = MAX_FILES - selectedFiles.length
        const filesToAdd = validFiles.slice(0, remainingSlots)
        setSelectedFiles((prev) => [...prev, ...filesToAdd])
      }

      // Reset input
      if (event.target) {
        event.target.value = ""
      }
    },
    [selectedFiles]
  )

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index)

      // Clean up object URL for removed file
      const removedFile = prev[index]
      if (removedFile && objectUrlsRef.current.has(removedFile)) {
        const url = objectUrlsRef.current.get(removedFile)!
        URL.revokeObjectURL(url)
        objectUrlsRef.current.delete(removedFile)
      }

      return newFiles
    })
  }, [])

  const clearFiles = useCallback(() => {
    // Clean up all object URLs
    objectUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url)
    })
    objectUrlsRef.current.clear()
    setSelectedFiles([])
  }, [])

  const clearErrors = useCallback(() => {
    setFileErrors([])
  }, [])

  return {
    selectedFiles,
    fileErrors,
    handleFileUpload,
    removeFile,
    clearFiles,
    clearErrors,
    getFileUrl,
  }
}
