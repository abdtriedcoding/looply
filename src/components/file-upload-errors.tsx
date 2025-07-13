import { memo } from "react"

interface FileUploadErrorsProps {
  errors: string[]
}

export const FileUploadErrors = memo(function FileUploadErrors({
  errors,
}: FileUploadErrorsProps) {
  if (errors.length === 0) return null

  return (
    <div className="bg-destructive/10 border-destructive/20 mb-3 rounded-lg border p-3">
      <div className="text-destructive mb-1 text-sm font-medium">
        File Upload Errors:
      </div>
      <ul className="text-destructive/80 space-y-1 text-xs">
        {errors.map((error, index) => (
          <li key={index}>• {error}</li>
        ))}
      </ul>
    </div>
  )
})
