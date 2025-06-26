"use client"

import { useState } from "react"

import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation as useTanStackMutation } from "@tanstack/react-query"
import { useMutation } from "convex/react"

import { Editor } from "@/components/editor"

import { useChannelId } from "@/hooks/useChannelId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { processFileUploads } from "@/lib/file-upload"

import { api } from "../../../../../../convex/_generated/api"
import { Doc, Id } from "../../../../../../convex/_generated/dataModel"

export default function ChannelPage() {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl)

  const [messages, setMessages] = useState<Doc<"message">[]>([])

  const { mutate: createMessage, isPending: isCreateMessagePending } =
    useTanStackMutation({
      mutationFn: useConvexMutation(api.messages.createMessage),
    })

  const handleSend = async (content: string, files: File[]) => {
    let uploadedStorageIds: Id<"_storage">[] = []

    if (files.length > 0) {
      const postUrl = await generateUploadUrl()
      const result = await processFileUploads(files, postUrl)

      if (result.success && result.urls) {
        uploadedStorageIds = result.urls
      }
    }

    createMessage({
      text: content,
      files: uploadedStorageIds,
      workspaceId: workspaceId,
      channelId: channelId,
    })
  }

  return (
    <div className="flex min-h-screen flex-col p-2">
      <div className="flex-1 overflow-y-auto">
        <p>hiii</p>
      </div>

      <Editor placeholder="Type your message here..." onSend={handleSend} />
    </div>
  )
}
