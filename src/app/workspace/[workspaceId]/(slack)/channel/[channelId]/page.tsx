"use client"

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useQuery,
  useMutation as useTanStackMutation,
} from "@tanstack/react-query"
import { useMutation, usePaginatedQuery } from "convex/react"
import { TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { Editor } from "@/components/editor"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"

import { ChannelHeader } from "@/features/channels/components/channel-header"
import { MessageList } from "@/features/channels/components/message-list"

import { useChannelId } from "@/hooks/useChannelId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { LOAD_MORE_BATCH_SIZE } from "@/constants"
import { processFileUploads } from "@/lib/file-upload"

import { api } from "../../../../../../../convex/_generated/api"
import { Id } from "../../../../../../../convex/_generated/dataModel"

export default function ChannelPage() {
  const currentWorkspaceId = useWorkspaceId()
  const currentChannelId = useChannelId()

  const {
    data: currentChannel,
    isPending: isChannelLoading,
    error: channelLoadingError,
  } = useQuery(
    convexQuery(api.channels.getChannelById, {
      workspaceId: currentWorkspaceId,
      channelId: currentChannelId,
    })
  )

  const {
    results: channelMessages,
    status: messagesLoadingStatus,
    loadMore: loadMoreMessages,
  } = usePaginatedQuery(
    api.messages.getMessages,
    { workspaceId: currentWorkspaceId, channelId: currentChannelId },
    { initialNumItems: LOAD_MORE_BATCH_SIZE }
  )

  const generateFileUploadUrl = useMutation(api.upload.generateUploadUrl)

  const { mutate: createChannelMessage, isPending: isChannelMessagePending } =
    useTanStackMutation({
      mutationFn: useConvexMutation(api.messages.createMessage),
    })

  const isLoadingInitialData =
    isChannelLoading || messagesLoadingStatus === "LoadingFirstPage"
  const isLoadingMoreMessages = messagesLoadingStatus === "LoadingMore"
  const canLoadMoreMessages = messagesLoadingStatus === "CanLoadMore"

  const handleSend = async (content: string | undefined, files: File[]) => {
    let uploadedStorageIds: Id<"_storage">[] = []

    if (files.length > 0) {
      const postUrl = await generateFileUploadUrl()
      const result = await processFileUploads(files, postUrl)

      if (result.success && result.urls) {
        uploadedStorageIds = result.urls
      }
    }

    createChannelMessage(
      {
        text: content,
        files: uploadedStorageIds,
        workspaceId: currentWorkspaceId,
        channelId: currentChannelId,
      },
      {
        onError: () => {
          toast.error("Failed to send message")
        },
      }
    )
  }

  if (isLoadingInitialData) {
    return <LoadingScreen />
  }

  if (channelLoadingError || !currentChannel) {
    return <SidebarErrorFallback errorMessage="Channel not found" />
  }

  if (!channelMessages) {
    return <SidebarErrorFallback errorMessage="Messages not found" />
  }

  return (
    <div className="flex h-screen flex-col">
      <ChannelHeader channel={currentChannel} />
      <MessageList
        messages={channelMessages}
        channel={currentChannel}
        loadMore={loadMoreMessages}
        isLoadingMore={isLoadingMoreMessages}
        canLoadMore={canLoadMoreMessages}
      />
      <div className="p-2">
        <Editor
          placeholder={`Message # ${currentChannel.name}`}
          onSend={handleSend}
          disabled={isChannelMessagePending}
        />
      </div>
    </div>
  )
}

function SidebarErrorFallback({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <Button size="icon" variant="destructive">
        <TriangleAlert className="h-full w-full" />
      </Button>
      <span className="text-muted-foreground text-sm font-medium">
        {errorMessage}
      </span>
    </div>
  )
}
