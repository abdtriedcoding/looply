import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useQuery,
  useMutation as useTanStackMutation,
} from "@tanstack/react-query"
import { useMutation, usePaginatedQuery } from "convex/react"
import dayjs from "dayjs"
import { Loader2, TriangleAlert, XIcon } from "lucide-react"

import { Editor } from "@/components/editor"
import { Button } from "@/components/ui/button"

import { Message } from "@/features/channels/components/message"
import { useThreadStore } from "@/features/messages/store/useThread"

import { useChannelId } from "@/hooks/useChannelId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { MESSAGE_COMPACT_TIME_WINDOW_MINUTES } from "@/constants"
import { processFileUploads } from "@/lib/file-upload"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export const ThreadPannel = ({ messageId }: { messageId: Id<"message"> }) => {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const { closeThread } = useThreadStore()

  const generateUploadUrl = useMutation(api.upload.generateUploadUrl)

  const { mutate: createMessage } = useTanStackMutation({
    mutationFn: useConvexMutation(api.messages.createMessage),
  })

  const { data: currentMember } = useQuery(
    convexQuery(api.members.currentMember, { workspaceId })
  )

  const { data: messageById, isPending: isMessageLoading } = useQuery(
    convexQuery(api.messages.getMessageById, { messageId })
  )

  const {
    results: messagesData,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.getMessages,
    { workspaceId, channelId, parentMessageId: messageId },
    { initialNumItems: 20 }
  )

  const groupedMessages = messagesData.reduce(
    (groups, message) => {
      const dateKey = dayjs(message._creationTime).format("YYYY-MM-DD")
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(message)
      return groups
    },
    {} as Record<string, typeof messagesData>
  )

  const groupedArray = Object.entries(groupedMessages).map(([date, msgs]) => ({
    date,
    messages: msgs,
  }))

  if (isMessageLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (!messageById) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="h-full w-full" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          Message not found
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
      channelId: channelId,
      parentMessageId: messageId,
    })
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={closeThread} size="iconSmall" variant="secondary">
          <XIcon className="size-5" />
        </Button>
      </div>
      <div className="messages-scrollbar relative flex flex-1 flex-col-reverse overflow-y-auto">
        {groupedArray.map((group) => (
          <div key={group.date}>
            <div className="relative my-2 text-center">
              <hr className="absolute top-1/2 right-0 left-0 border-t" />
              <span className="bg-muted relative inline-block rounded-full border px-4 py-1 text-xs shadow-sm">
                {dayjs(group.date).format("MMMM D, YYYY")}
              </span>
            </div>
            <div className="flex flex-col-reverse">
              {group.messages.map((message, index) => {
                const nextMessage = group.messages[index + 1]
                const isMessageCompact =
                  nextMessage &&
                  nextMessage.user._id === message.user._id &&
                  dayjs(message._creationTime).diff(
                    nextMessage._creationTime,
                    "minute"
                  ) < MESSAGE_COMPACT_TIME_WINDOW_MINUTES

                return (
                  <Message
                    key={message._id}
                    messageId={message._id}
                    authorId={message.memberId}
                    authorName={message.user.name}
                    authorImage={message.user.image}
                    createdAt={message._creationTime}
                    body={message.text}
                    image={message.images}
                    reactions={message.reactions}
                    isAuthor={message.memberId === currentMember?._id}
                    isCompact={!!isMessageCompact}
                    updatedAt={message.updatedAt}
                    isThread={false}
                  />
                )
              })}
            </div>
          </div>
        ))}

        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && status === "CanLoadMore") {
                    loadMore(20)
                  }
                },
                {
                  threshold: 1.0,
                }
              )
              observer.observe(el)
              return () => observer.disconnect()
            }
          }}
        ></div>

        {status === "LoadingMore" && (
          <div className="relative my-2 text-center">
            <hr className="absolute top-1/2 right-0 left-0 border-t" />
            <span className="bg-muted relative inline-block rounded-full border px-4 py-1 text-xs shadow-sm">
              <Loader2 className="size-4 animate-spin" />
            </span>
          </div>
        )}

        <Message
          key={messageById._id}
          messageId={messageById._id}
          authorId={messageById.memberId}
          authorName={messageById.user.name}
          authorImage={messageById.user.image}
          createdAt={messageById._creationTime}
          body={messageById.text}
          image={messageById.images}
          reactions={messageById.reactions}
          isAuthor={messageById.memberId === currentMember?._id}
          isCompact={false}
          updatedAt={messageById.updatedAt}
          isThread={false}
        />
      </div>
      <div className="p-2">
        <Editor placeholder="Reply..." onSend={handleSend} />
      </div>
    </div>
  )
}
