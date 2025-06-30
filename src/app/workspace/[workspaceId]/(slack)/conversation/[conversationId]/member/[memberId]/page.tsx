"use client"

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useQuery,
  useMutation as useTanStackMutation,
} from "@tanstack/react-query"
import { useMutation, usePaginatedQuery } from "convex/react"
import { Loader2, TriangleAlert } from "lucide-react"

import { Editor } from "@/components/editor"
import { Button } from "@/components/ui/button"

import { MessageList } from "@/features/channels/components/message-list"
import { MemberHeader } from "@/features/conversation/components/member-header"

import { useConversationId } from "@/hooks/useConversationId"
import { useMemberId } from "@/hooks/useMemberId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { processFileUploads } from "@/lib/file-upload"

import { api } from "../../../../../../../../../convex/_generated/api"
import { Id } from "../../../../../../../../../convex/_generated/dataModel"

export default function ConversationPage() {
  const workspaceId = useWorkspaceId()
  const conversationId = useConversationId()
  const memberId = useMemberId()
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl)

  const {
    data: member,
    error: memberError,
    isLoading: memberPending,
  } = useQuery(
    convexQuery(api.members.getMemberById, { workspaceId, memberId })
  )

  const {
    results: messagesData,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.getMessages,
    { workspaceId, conversationId },
    { initialNumItems: 20 }
  )

  const { mutate: createMessage } = useTanStackMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  })

  if (memberPending || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
      </div>
    )
  }

  if (memberError || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="h-full w-full" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          Member not found
        </span>
      </div>
    )
  }

  if (!messagesData) {
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
      conversationId: conversationId,
    })
  }

  return (
    <div className="flex h-screen flex-col">
      <MemberHeader member={member} />
      <MessageList
        variant="direct"
        messages={messagesData}
        member={member}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <div className="p-2">
        <Editor
          placeholder={`Message # ${member.user.name}`}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}
