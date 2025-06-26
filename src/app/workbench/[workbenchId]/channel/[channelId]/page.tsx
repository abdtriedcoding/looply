"use client"

import { useState } from "react"

import { useMutation } from "convex/react"

import { Editor } from "@/components/editor"

import { processFileUploads } from "@/lib/file-upload"

import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"

interface Message {
  id: string
  content: string
  files: File[]
  timestamp: Date
}

export default function ChannelPage() {
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl)

  const [messages, setMessages] = useState<Message[]>([])

  const handleSend = async (content: string, files: File[]) => {
    try {
      let uploadedStorageIds: Id<"_storage">[] = []

      // Upload files if any
      if (files.length > 0) {
        const postUrl = await generateUploadUrl()
        const result = await processFileUploads(files, postUrl)

        if (result.success && result.urls) {
          uploadedStorageIds = result.urls
          console.log("Uploaded storage IDs:", uploadedStorageIds)
        } else {
          console.error("File upload failed:", result.errors)
          // You might want to show an error message to the user here
        }
      }

      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content,
        files,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
      console.log("Message sent:", { content, files, uploadedStorageIds })
    } catch (error) {
      console.error("Failed to send message:", error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <div className="flex min-h-screen flex-col p-2">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-muted rounded-lg border p-4">
              {/* Text Content */}
              {message.content && (
                <div className="mb-3">
                  <p className="text-muted-foreground mb-1 text-sm">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                  <div className="prose prose-sm max-w-none">
                    {message.content}
                  </div>
                </div>
              )}

              {/* Files */}
              {message.files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {message.files.map((file, index) => {
                    const isImage = file.type.startsWith("image/")

                    return (
                      <div
                        key={index}
                        className="border-border bg-background relative overflow-hidden rounded-lg border"
                      >
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-32 w-32 object-cover"
                          />
                        ) : (
                          <div className="bg-muted flex h-32 w-32 items-center justify-center">
                            <div className="text-center">
                              <div className="mb-1 text-2xl">📄</div>
                              <div className="text-muted-foreground truncate px-2 text-xs">
                                {file.name.split(".").pop()?.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="absolute right-0 bottom-0 left-0 truncate bg-black/50 p-1 text-xs text-white">
                          {file.name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Editor placeholder="Type your message here..." onSend={handleSend} />
    </div>
  )
}
