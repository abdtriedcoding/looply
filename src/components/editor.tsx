"use client"

import { useRef, useState } from "react"

import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { EditorToolbar } from "@/components/editor-toolbar"
import { FilePreview } from "@/components/file-preview"
import { FileUploadErrors } from "@/components/file-upload-errors"

import { useFileUpload } from "@/hooks/useFileUpload"

import { cn } from "@/lib/utils"

interface EditorProps {
  placeholder?: string
  maxHeight?: string
  onSend?: (content: string | undefined, files: File[]) => void
  initialContent?: string
}

export function Editor({
  placeholder = "Type your message...",
  maxHeight = "300px",
  onSend,
  initialContent = "",
}: EditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    selectedFiles,
    fileErrors,
    handleFileUpload,
    removeFile,
    clearFiles,
    getFileUrl,
  } = useFileUpload()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class:
            "text-blue-700 underline hover:text-blue-700/80 transition-colors cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
      Underline,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
          "min-h-[120px] p-4 rounded-lg border-0 bg-transparent",
          "focus:outline-none",
          "text-foreground leading-relaxed resize-none",
          "transition-all duration-200"
        ),
      },
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  })

  if (!editor) {
    return null
  }

  const handleSend = () => {
    const plainText = editor.getText().trim()
    const htmlContent = editor.getHTML()

    if ((plainText || selectedFiles.length > 0) && onSend) {
      // Send HTML content if there's text, otherwise send undefined
      const textToSend = plainText ? htmlContent : undefined

      onSend(textToSend, selectedFiles)
      editor.commands.setContent("")
      clearFiles()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <input
        type="file"
        className="hidden"
        ref={fileRef}
        accept="image/*,.pdf,.doc,.docx,.txt,.rtf"
        multiple
        onChange={handleFileUpload}
      />

      <FileUploadErrors errors={fileErrors} />

      <div
        className={cn(
          "bg-card border-border overflow-hidden rounded-lg border shadow-sm transition-all duration-200",
          isFocused && "ring-ring ring-offset-background ring-1 ring-offset-1"
        )}
      >
        <EditorToolbar
          editor={editor}
          handleSend={handleSend}
          fileRef={fileRef}
          uploadedFilesCount={selectedFiles.length}
        />

        <div className="overflow-y-auto" style={{ maxHeight }}>
          <EditorContent
            editor={editor}
            onKeyDown={handleKeyDown}
            className="[&_.ProseMirror]:text-foreground [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_code]:bg-muted [&_.is-editor-empty]:before:text-muted-foreground [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:bg-transparent [&_.ProseMirror]:p-4 [&_.ProseMirror]:text-base [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:font-normal [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-sm [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_p:last-child]:mb-0 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.is-editor-empty]:before:pointer-events-none [&_.is-editor-empty]:before:absolute [&_.is-editor-empty]:before:top-4 [&_.is-editor-empty]:before:left-4 [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:select-none"
          />
        </div>
      </div>

      <FilePreview
        files={selectedFiles}
        onRemove={removeFile}
        getFileUrl={getFileUrl}
      />
    </div>
  )
}
