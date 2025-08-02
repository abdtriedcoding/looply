import { api } from "../../../convex/_generated/api"
import { Doc, Id } from "../../../convex/_generated/dataModel"

export type MessageModalType = "createConversation" | null

export type MessageVariant = "channel" | "direct"

export interface MessageListProps {
  messages: (typeof api.messages.getMessages._returnType)["page"]
  channel?: Doc<"channel">
  member?: Doc<"workspaceMember"> & { user: Doc<"users"> }
  variant?: MessageVariant
  isLoadingMore: boolean
  canLoadMore: boolean
  loadMore: (numItems: number) => void
}

export interface MessageHeaderProps {
  variant: MessageVariant
  channel?: Doc<"channel">
  member?: Doc<"workspaceMember"> & { user: Doc<"users"> }
}

export interface MessageProps {
  messageId: Id<"message">
  authorId: Id<"workspaceMember">
  authorName?: string
  authorImage?: string
  createdAt: Doc<"message">["_creationTime"]
  body?: string
  image: string[]
  reactions: Array<
    Omit<Doc<"reaction">, "memberId"> & {
      count: number
      memberIds: Id<"workspaceMember">[]
    }
  >
  isAuthor: boolean
  isCompact: boolean
  updatedAt: Doc<"message">["updatedAt"]
  isThread?: boolean
}

export interface MessageContentProps {
  messageText?: string
  attachedImages: string[]
  messageReactions: MessageProps["reactions"]
  messageId: Id<"message">
  lastEditedAt?: Doc<"message">["updatedAt"]
}
