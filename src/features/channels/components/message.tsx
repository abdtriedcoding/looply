import { useState } from "react"

import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import dayjs from "dayjs"
import { toast } from "sonner"

import { Editor } from "@/components/editor"
import { Hint } from "@/components/hint"
import { Renderer } from "@/components/renderer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Thumbnail } from "@/features/channels/components/thumbnail"
import { Toolbar } from "@/features/channels/components/toolbar"
import { useProfilePannelStore } from "@/features/members/store/useProfilePannel"
import { useThreadStore } from "@/features/messages/store/useThread"
import { MessageContentProps, MessageProps } from "@/features/messages/types"

import { COMPACT_TIME_FORMAT, FULL_TIME_FORMAT } from "@/constants"
import { handleConvexMutationError } from "@/lib/convex-mutation-error"
import { formatFullTime } from "@/lib/date-formatter"

import { api } from "../../../../convex/_generated/api"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { DeleteMessageModal } from "./delete-message-modal"
import { Reactions } from "./reactions"

export const Message = ({
  messageId,
  authorId,
  authorName,
  authorImage,
  createdAt,
  body,
  image,
  reactions,
  isAuthor,
  isCompact,
  updatedAt,
  isThread,
}: MessageProps) => {
  const [isEditingMessage, setIsEditingMessage] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const messageText = body
  const attachedImages = image
  const messageReactions = reactions
  const messageAuthorId = authorId
  const messageAuthorName = authorName || "Unknown User"
  const messageAuthorAvatar = authorImage
  const messageTimestamp = createdAt
  const lastEditedAt = updatedAt
  const isInThreadView = isThread
  const isCompactView = isCompact

  const { openMemberProfile } = useProfilePannelStore()
  const { openThread } = useThreadStore()

  const handleEdit = () => {
    setIsEditingMessage(true)
  }

  const handleCancel = () => {
    setIsEditingMessage(false)
  }

  const handleDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const { mutate: updateMessage } = useMutation({
    mutationFn: useConvexMutation(api.messages.updateMessage),
    onSuccess: () => {
      setIsEditingMessage(false)
    },
    onError: (error) => {
      toast.error(handleConvexMutationError(error, "Failed to update message"))
    },
  })

  const handleSave = async (content: string | undefined) => {
    if (!content) return

    updateMessage({
      messageId,
      text: content,
    })
  }

  const handleThreadOpen = () => {
    openThread(messageId)
  }

  const handleOpenAuthorProfile = () => {
    openMemberProfile(messageAuthorId)
  }

  if (isCompactView)
    return (
      <>
        <CompactMessage
          messageId={messageId}
          messageText={messageText}
          attachedImages={attachedImages}
          messageReactions={messageReactions}
          messageTimestamp={messageTimestamp}
          lastEditedAt={lastEditedAt}
          messageAuthorName={messageAuthorName}
          isEditingMessage={isEditingMessage}
          isCurrentUserMessage={isAuthor}
          isInThreadView={isInThreadView}
          onStartEditing={handleEdit}
          onCancelEdit={handleCancel}
          onSaveEdit={handleSave}
          onOpenThread={handleThreadOpen}
          onDeleteMessage={handleDelete}
        />
        {isDeleteModalOpen && (
          <DeleteMessageModal
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            messageId={messageId}
          />
        )}
      </>
    )

  return (
    <>
      <FullMessage
        messageId={messageId}
        messageAuthorName={messageAuthorName}
        messageAuthorAvatar={messageAuthorAvatar}
        messageTimestamp={messageTimestamp}
        messageText={messageText}
        attachedImages={attachedImages}
        messageReactions={messageReactions}
        lastEditedAt={lastEditedAt}
        isEditingMessage={isEditingMessage}
        isCurrentUserMessage={isAuthor}
        isInThreadView={isInThreadView}
        onOpenAuthorProfile={handleOpenAuthorProfile}
        onStartEditing={handleEdit}
        onCancelEdit={handleCancel}
        onSaveEdit={handleSave}
        onOpenThread={handleThreadOpen}
        onDeleteMessage={handleDelete}
      />
      {isDeleteModalOpen && (
        <DeleteMessageModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          messageId={messageId}
        />
      )}
    </>
  )
}

function CompactMessage({
  messageId,
  messageText,
  attachedImages,
  messageReactions,
  messageTimestamp,
  lastEditedAt,
  messageAuthorName,
  isEditingMessage,
  isCurrentUserMessage,
  isInThreadView,
  onStartEditing,
  onCancelEdit,
  onSaveEdit,
  onOpenThread,
  onDeleteMessage,
}: {
  messageId: Id<"message">
  messageText?: string
  attachedImages: string[]
  messageReactions: MessageProps["reactions"]
  messageTimestamp: Doc<"message">["_creationTime"]
  lastEditedAt?: Doc<"message">["updatedAt"]
  messageAuthorName: string
  isEditingMessage: boolean
  isCurrentUserMessage: boolean
  isInThreadView?: boolean
  onStartEditing: () => void
  onCancelEdit: () => void
  onSaveEdit: (content: string | undefined) => void
  onOpenThread: () => void
  onDeleteMessage: () => void
}) {
  const formattedCompactTime =
    dayjs(messageTimestamp).format(COMPACT_TIME_FORMAT)
  const fullTimestamp = formatFullTime(dayjs(messageTimestamp))

  return (
    <div className="group hover:bg-muted relative flex flex-col p-1.5 px-5">
      <div className="flex items-start gap-2">
        <CompactMessageTimestamp
          displayTime={formattedCompactTime}
          fullTimestamp={fullTimestamp}
        />

        {isEditingMessage ? (
          <MessageEditor
            initialContent={messageText}
            onCancel={onCancelEdit}
            onSave={onSaveEdit}
          />
        ) : (
          <MessageContent
            messageText={messageText}
            attachedImages={attachedImages}
            messageReactions={messageReactions}
            messageId={messageId}
            lastEditedAt={lastEditedAt}
            showAuthorName={true}
            authorName={messageAuthorName}
          />
        )}

        {!isEditingMessage && (
          <MessageToolbar
            isCurrentUserMessage={isCurrentUserMessage}
            messageId={messageId}
            isInThreadView={isInThreadView}
            onEdit={onStartEditing}
            onDelete={onDeleteMessage}
            onOpenThread={onOpenThread}
          />
        )}
      </div>
    </div>
  )
}

function FullMessage({
  messageId,
  messageAuthorName,
  messageAuthorAvatar,
  messageTimestamp,
  messageText,
  attachedImages,
  messageReactions,
  lastEditedAt,
  isEditingMessage,
  isCurrentUserMessage,
  isInThreadView,
  onOpenAuthorProfile,
  onStartEditing,
  onCancelEdit,
  onSaveEdit,
  onOpenThread,
  onDeleteMessage,
}: {
  messageId: Id<"message">
  messageAuthorName: string
  messageAuthorAvatar?: string
  messageTimestamp: Doc<"message">["_creationTime"]
  messageText?: string
  attachedImages: string[]
  messageReactions: MessageProps["reactions"]
  lastEditedAt?: Doc<"message">["updatedAt"]
  isEditingMessage: boolean
  isCurrentUserMessage: boolean
  isInThreadView?: boolean
  onOpenAuthorProfile: () => void
  onStartEditing: () => void
  onCancelEdit: () => void
  onSaveEdit: (content: string | undefined) => void
  onOpenThread: () => void
  onDeleteMessage: () => void
}) {
  return (
    <div className="group hover:bg-muted relative flex flex-col p-1.5 px-5">
      <div className="flex items-start gap-2">
        <MessageAuthorAvatar
          authorName={messageAuthorName}
          authorAvatar={messageAuthorAvatar}
          onOpenProfile={onOpenAuthorProfile}
        />

        {isEditingMessage ? (
          <MessageEditor
            initialContent={messageText}
            onCancel={onCancelEdit}
            onSave={onSaveEdit}
          />
        ) : (
          <div className="flex flex-col">
            <MessageAuthorHeader
              authorName={messageAuthorName}
              messageTimestamp={messageTimestamp}
              onOpenProfile={onOpenAuthorProfile}
            />

            <MessageContent
              messageText={messageText}
              attachedImages={attachedImages}
              messageReactions={messageReactions}
              messageId={messageId}
              lastEditedAt={lastEditedAt}
            />
          </div>
        )}

        {!isEditingMessage && (
          <MessageToolbar
            isCurrentUserMessage={isCurrentUserMessage}
            messageId={messageId}
            isInThreadView={isInThreadView}
            onEdit={onStartEditing}
            onDelete={onDeleteMessage}
            onOpenThread={onOpenThread}
          />
        )}
      </div>
    </div>
  )
}

function CompactMessageTimestamp({
  displayTime,
  fullTimestamp,
}: {
  displayTime: string
  fullTimestamp: string
}) {
  return (
    <Hint label={fullTimestamp}>
      <button className="text-muted-foreground text-center text-xs opacity-0 group-hover:opacity-100 hover:underline">
        {displayTime}
      </button>
    </Hint>
  )
}

function MessageAuthorAvatar({
  authorName,
  authorAvatar,
  onOpenProfile,
}: {
  authorName: string
  authorAvatar?: string
  onOpenProfile: () => void
}) {
  const authorInitial = authorName.charAt(0).toUpperCase()

  return (
    <button onClick={onOpenProfile}>
      <Avatar>
        <AvatarImage src={authorAvatar} alt={`${authorName} profile picture`} />
        <AvatarFallback>{authorInitial}</AvatarFallback>
      </Avatar>
    </button>
  )
}

function MessageAuthorHeader({
  authorName,
  messageTimestamp,
  onOpenProfile,
}: {
  authorName: string
  messageTimestamp: Doc<"message">["_creationTime"]
  onOpenProfile: () => void
}) {
  const formattedTime = dayjs(messageTimestamp).format(FULL_TIME_FORMAT)
  const fullTimestamp = formatFullTime(dayjs(messageTimestamp))

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={onOpenProfile}
        className="text-primary font-bold hover:underline"
      >
        {authorName}
      </button>
      <Hint label={fullTimestamp}>
        <button className="text-muted-foreground text-xs hover:underline">
          {formattedTime}
        </button>
      </Hint>
    </div>
  )
}

function MessageContent({
  messageText,
  attachedImages,
  messageReactions,
  messageId,
  lastEditedAt,
  showAuthorName = false,
  authorName,
}: MessageContentProps & {
  showAuthorName?: boolean
  authorName?: string
}) {
  const hasText = Boolean(messageText)
  const hasImages = attachedImages.length > 0
  const hasReactions = messageReactions.length > 0
  const wasEdited = Boolean(lastEditedAt)

  return (
    <div className="flex flex-col">
      {showAuthorName && authorName && (
        <div className="flex items-center gap-2 text-sm">
          <h2 className="text-primary font-bold hover:underline">
            {authorName}
          </h2>
        </div>
      )}

      {hasText && (
        <div className="flex items-center gap-2">
          <Renderer value={messageText || ""} />
          {wasEdited && (
            <span className="text-foreground pt-1 text-xs opacity-70">
              (edited)
            </span>
          )}
        </div>
      )}

      {hasImages && <Thumbnail url={attachedImages} />}

      {hasReactions && (
        <Reactions reactions={messageReactions} messageId={messageId} />
      )}
    </div>
  )
}

function MessageEditor({
  initialContent,
  onCancel,
  onSave,
}: {
  initialContent?: string
  onCancel: () => void
  onSave: (content: string | undefined) => void
}) {
  return (
    <Editor
      initialContent={initialContent}
      onCancel={onCancel}
      onUpdate={onSave}
      variant="edit"
    />
  )
}

function MessageToolbar({
  isCurrentUserMessage,
  messageId,
  isInThreadView,
  onEdit,
  onDelete,
  onOpenThread,
}: {
  isCurrentUserMessage: boolean
  messageId: Id<"message">
  isInThreadView?: boolean
  onEdit: () => void
  onDelete: () => void
  onOpenThread: () => void
}) {
  return (
    <Toolbar
      isAuthor={isCurrentUserMessage}
      messageId={messageId}
      handleEdit={onEdit}
      handleDelete={onDelete}
      handleThreadOpen={onOpenThread}
      isThread={isInThreadView}
    />
  )
}
