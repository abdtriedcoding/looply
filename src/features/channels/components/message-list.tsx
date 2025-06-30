import { useCallback } from "react"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Loader } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Message } from "@/features/channels/components/message"
import { MessageHeaderProps, MessageListProps } from "@/features/messages/types"

import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger"
import { useMessagesGroupedByDate } from "@/hooks/useMessagesGroupedByDate"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import {
  LOAD_MORE_BATCH_SIZE,
  MESSAGE_COMPACT_TIME_WINDOW_MINUTES,
} from "@/constants"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

export const MessageList = ({
  messages,
  channel,
  member,
  variant = "channel",
  isLoadingMore,
  canLoadMore,
  loadMore,
}: MessageListProps) => {
  const workspaceId = useWorkspaceId()

  const { data: currentMember } = useQuery(
    convexQuery(api.members.currentMember, { workspaceId })
  )

  const messageGroupsByDate = useMessagesGroupedByDate(messages)

  const handleLoadMoreMessages = useCallback(() => {
    loadMore(LOAD_MORE_BATCH_SIZE)
  }, [loadMore])

  const infiniteScrollRef = useInfiniteScrollTrigger(
    canLoadMore,
    isLoadingMore,
    handleLoadMoreMessages
  )

  return (
    <div className="messages-scrollbar relative flex flex-1 flex-col-reverse overflow-y-auto">
      {messageGroupsByDate.map((messageGroup) => (
        <div key={messageGroup.date}>
          <DateSeparator
            date={dayjs(messageGroup.date).format("MMMM D, YYYY")}
          />
          <div className="flex flex-col-reverse">
            {messageGroup.messages.map((message, messageIndex) => {
              const subsequentMessage = messageGroup.messages[messageIndex + 1]
              const shouldCompactMessage = shouldMessageBeCompact(
                message,
                subsequentMessage
              )

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
                  isCompact={shouldCompactMessage}
                  updatedAt={message.updatedAt}
                />
              )
            })}
          </div>
        </div>
      ))}

      <div className="h-1" ref={infiniteScrollRef} />

      {isLoadingMore && <LoadingMoreIndicator />}

      <MessageListHeader variant={variant} channel={channel} member={member} />
    </div>
  )
}

function DateSeparator({ date }: { date: string }) {
  return (
    <div className="relative my-2 text-center">
      <hr className="absolute top-1/2 right-0 left-0 border-t" />
      <span className="bg-muted relative inline-block rounded-full border px-4 py-1 text-xs shadow-sm">
        {date}
      </span>
    </div>
  )
}

function LoadingMoreIndicator() {
  return (
    <div className="relative my-2 text-center">
      <hr className="absolute top-1/2 right-0 left-0 border-t" />
      <span className="bg-muted relative inline-block rounded-full border px-4 py-1 text-xs shadow-sm">
        <Loader className="size-4 animate-spin" />
      </span>
    </div>
  )
}

function MessageListHeader({ variant, channel, member }: MessageHeaderProps) {
  if (variant === "channel" && channel) {
    return <ChannelHeader channel={channel} />
  }

  if (variant === "direct" && member) {
    return <DirectMessageHeader member={member} />
  }

  return null
}

function ChannelHeader({ channel }: { channel: Doc<"channel"> }) {
  const channelCreatedDate = dayjs(channel._creationTime).format("MMMM D, YYYY")

  return (
    <div className="mx-5 mb-4 pt-20">
      <p className="mb-2 flex items-center text-2xl font-bold">
        # {channel.name}
      </p>
      <p className="text-muted-foreground pb-4 font-normal">
        This channel was created on {channelCreatedDate}. This is the very
        beginning of the <strong>{channel.name}</strong> channel.
      </p>
    </div>
  )
}

function DirectMessageHeader({
  member,
}: {
  member: Doc<"workspaceMember"> & { user: Doc<"users"> }
}) {
  const userName = member.user.name || "Unknown User"
  const userImage = member.user.image
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="mx-5 mb-4 pt-20">
      <div className="mb-2 flex items-center gap-x-1">
        <Avatar className="mr-2 size-14">
          <AvatarImage src={userImage} alt={`${userName} avatar`} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{userName}</p>
      </div>
      <p className="text-muted-foreground mb-4 font-normal">
        This conversation is just between you and <strong>{userName}</strong>
      </p>
    </div>
  )
}

function shouldMessageBeCompact(
  currentMessage: MessageListProps["messages"][number],
  subsequentMessage: MessageListProps["messages"][number]
): boolean {
  if (!subsequentMessage) return false

  const isSameAuthor = subsequentMessage.memberId === currentMessage.memberId
  const timeDifference = dayjs(currentMessage._creationTime).diff(
    subsequentMessage._creationTime,
    "minute"
  )

  return isSameAuthor && timeDifference < MESSAGE_COMPACT_TIME_WINDOW_MINUTES
}
