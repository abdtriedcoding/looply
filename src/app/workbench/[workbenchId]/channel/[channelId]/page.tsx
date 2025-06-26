"use client"

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useQuery,
  useMutation as useTanStackMutation,
} from "@tanstack/react-query"
import { useMutation } from "convex/react"
import { Loader2, TriangleAlert } from "lucide-react"

import { Editor } from "@/components/editor"
import { Button } from "@/components/ui/button"

import { ChannelHeader } from "@/features/channels/components/channel-header"
import { MessageList } from "@/features/channels/components/message-list"

import { useChannelId } from "@/hooks/useChannelId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { processFileUploads } from "@/lib/file-upload"

import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"

export default function ChannelPage() {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const generateUploadUrl = useMutation(api.upload.generateUploadUrl)

  const {
    data: channel,
    isPending: isChannelPending,
    error: channelError,
  } = useQuery(
    convexQuery(api.channels.getChannelById, { workspaceId, channelId })
  )

  const { mutate: createMessage, isPending: isCreateMessagePending } =
    useTanStackMutation({
      mutationFn: useConvexMutation(api.messages.createMessage),
    })

  const {
    data: messagesData,
    isPending: isMessagesLoading,
    error: messagesError,
  } = useQuery(
    convexQuery(api.messages.getMessages, { workspaceId, channelId })
  )

  const handleSend = async (content: string | undefined, files: File[]) => {
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

  if (isChannelPending || isMessagesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
      </div>
    )
  }

  if (channelError || !channel) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="h-full w-full" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          Channel not found
        </span>
      </div>
    )
  }

  if (messagesError || !messagesData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="h-full w-full" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          Messages not found
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <ChannelHeader channel={channel} />
      <MessageList messages={messagesData} />
      <div className="p-2">
        <Editor
          placeholder={`Message # ${channel?.name}`}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
