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
}: {
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
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { openProfile } = useProfilePannelStore()
  const { openThread } = useThreadStore()

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleDelete = () => {
    setIsDeleting(true)
  }

  const { mutate: updateMessage } = useMutation({
    mutationFn: useConvexMutation(api.messages.updateMessage),
    onSuccess: () => {
      setIsEditing(false)
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

  if (isCompact)
    return (
      <>
        <div className="group hover:bg-muted relative flex flex-col p-1.5 px-5">
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(dayjs(createdAt))}>
              <button className="text-muted-foreground text-center text-xs opacity-0 group-hover:opacity-100 hover:underline">
                {dayjs(createdAt).format("hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <Editor
                initialContent={body}
                onCancel={handleCancel}
                onUpdate={handleSave}
                variant="edit"
              />
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm">
                  <h2 className="text-primary font-bold hover:underline">
                    {authorName}
                  </h2>
                </div>

                {body && (
                  <div className="flex items-center gap-2">
                    <Renderer value={body} />
                    {updatedAt && (
                      <span className="text-foreground pt-1 text-xs opacity-70">
                        (edited)
                      </span>
                    )}
                  </div>
                )}
                {image.length > 0 && <Thumbnail url={image} />}
                {reactions.length > 0 && (
                  <Reactions reactions={reactions} messageId={messageId} />
                )}
              </div>
            )}

            {!isEditing && (
              <Toolbar
                isAuthor={isAuthor}
                messageId={messageId}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleThreadOpen={handleThreadOpen}
                isThread={isThread}
              />
            )}
          </div>
        </div>
        {isDeleting && (
          <DeleteMessageModal
            open={isDeleting}
            onOpenChange={setIsDeleting}
            messageId={messageId}
          />
        )}
      </>
    )

  return (
    <>
      <div className="group hover:bg-muted relative flex flex-col p-1.5 px-5">
        <div className="flex items-start gap-2">
          <button onClick={() => openProfile(authorId)}>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback>
                {authorName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>

          {isEditing ? (
            <Editor
              initialContent={body}
              onCancel={handleCancel}
              onUpdate={handleSave}
              variant="edit"
            />
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => openProfile(authorId)}
                  className="text-primary font-bold hover:underline"
                >
                  {authorName}
                </button>
                <Hint label={formatFullTime(dayjs(createdAt))}>
                  <button className="text-muted-foreground text-xs hover:underline">
                    {dayjs(createdAt).format("h:mm a")}
                  </button>
                </Hint>
              </div>

              {body && (
                <div className="flex items-center gap-2">
                  <Renderer value={body} />
                  {updatedAt && (
                    <span className="text-foreground pt-1 text-xs opacity-70">
                      (edited)
                    </span>
                  )}
                </div>
              )}
              {image.length > 0 && <Thumbnail url={image} />}
              {reactions.length > 0 && (
                <Reactions reactions={reactions} messageId={messageId} />
              )}
            </div>
          )}

          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              messageId={messageId}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleThreadOpen={handleThreadOpen}
              isThread={isThread}
            />
          )}
        </div>
      </div>
      {isDeleting && (
        <DeleteMessageModal
          open={isDeleting}
          onOpenChange={setIsDeleting}
          messageId={messageId}
        />
      )}
    </>
  )
}
