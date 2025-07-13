"use client"

import Image from "next/image"
import { memo } from "react"

import { X } from "lucide-react"

import { Hint } from "@/components/hint"

import {
  formatFileSize,
  getFileIcon,
  getFileType,
  MAX_FILES,
} from "@/lib/file-upload"

interface FilePreviewProps {
  files: File[]
  onRemove: (index: number) => void
  getFileUrl: (file: File) => string
}

export const FilePreview = memo(function FilePreview({
  files,
  onRemove,
  getFileUrl,
}: FilePreviewProps) {
  if (files.length === 0) return null

  const totalFileSize = files.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="bg-muted/30 border-border mt-3 rounded-lg border p-3">
      <div className="flex flex-wrap gap-4">
        {files.map((file, index) => {
          const fileType = getFileType(file)
          const FileIcon = getFileIcon(file)
          const isImage = fileType === "image"

          return (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="bg-background relative flex size-[80px] items-center justify-center rounded-lg border"
            >
              {isImage ? (
                <Image
                  src={getFileUrl(file)}
                  alt={file.name}
                  fill
                  className="overflow-hidden rounded-lg object-cover"
                />
              ) : (
                <div className="-mt-5 flex flex-col items-center justify-center p-2 text-center">
                  <FileIcon className="text-muted-foreground mb-1 h-6 w-6" />
                  <div className="text-muted-foreground w-full truncate text-xs">
                    {file.name.split(".").pop()?.toUpperCase()}
                  </div>
                </div>
              )}

              <Hint label="Remove file">
                <button
                  onClick={() => onRemove(index)}
                  className="absolute -top-2.5 -right-2.5 z-[4] flex size-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="h-3 w-3" />
                </button>
              </Hint>

              <div className="absolute right-0 bottom-0 left-0 truncate rounded-b-lg bg-black/50 p-1 text-xs text-white">
                {file.name}
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
        <span>
          {files.length}/{MAX_FILES} files ready to send
        </span>
        <span>Total: {formatFileSize(totalFileSize)}</span>
      </div>
    </div>
  )
})
