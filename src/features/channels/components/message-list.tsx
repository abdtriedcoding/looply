import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Loader } from "lucide-react"

import { Message } from "@/features/channels/components/message"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

export const MessageList = ({
  messages,
  channel,
  variant = "channel",
  isLoadingMore,
  canLoadMore,
  loadMore,
}: {
  messages: (typeof api.messages.getMessages._returnType)["page"]
  channel: Doc<"channel">
  variant?: "channel" | "direct"
  isLoadingMore: boolean
  canLoadMore: boolean
  loadMore: (numItems: number) => void
}) => {
  const workspaceId = useWorkspaceId()

  const { data: currentMember } = useQuery(
    convexQuery(api.currentMember.currentMember, { workspaceId })
  )

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const dateKey = dayjs(message._creationTime).format("YYYY-MM-DD")
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(message)
      return groups
    },
    {} as Record<string, typeof messages>
  )

  const groupedArray = Object.entries(groupedMessages).map(([date, msgs]) => ({
    date,
    messages: msgs,
  }))

  return (
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
            {group.messages.map((message) => {
              return (
                <Message
                  key={message._id}
                  messageId={message._id}
                  authorName={message.user.name}
                  authorImage={message.user.image}
                  createdAt={message._creationTime}
                  body={message.text}
                  image={message.images}
                  reactions={message.reactions}
                  isAuthor={message.memberId === currentMember?._id}
                  updatedAt={message.updatedAt}
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
                if (entry.isIntersecting && canLoadMore) {
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

      {isLoadingMore && (
        <div className="relative my-2 text-center">
          <hr className="absolute top-1/2 right-0 left-0 border-t" />
          <span className="bg-muted relative inline-block rounded-full border px-4 py-1 text-xs shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}

      {variant === "channel" && (
        <div className="mx-5 mb-4 pt-20">
          <p className="mb-2 flex items-center text-2xl font-bold">
            # {channel.name}
          </p>
          <p className="text-muted-foreground pb-4 font-normal">
            This channel was created on{" "}
            {dayjs(channel._creationTime).format("MMMM D, YYYY")}. This is the
            very beginning of the <strong>{channel.name}</strong> channel.
          </p>
        </div>
      )}
    </div>
  )
}
