import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react"

import { EmojiSelector } from "@/components/emoji-selector"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export const Toolbar = ({
  isAuthor,
  messageId,
  handleEdit,
  handleDelete,
  handleThreadOpen,
  isThread = true,
}: {
  isAuthor: boolean
  messageId: Id<"message">
  handleEdit: () => void
  handleDelete: () => void
  handleThreadOpen: () => void
  isThread?: boolean
}) => {
  const { mutateAsync: toogleReaction } = useMutation({
    mutationFn: useConvexMutation(api.messages.toogleReaction),
  })

  const handleEmojiSelect = (emoji: string) => {
    toogleReaction({
      emoji,
      messageId,
    })
  }

  return (
    <div className="absolute top-2 right-5">
      <div className="bg-card flex rounded-md border opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <EmojiSelector
          align="end"
          hint="Insert Emoji"
          onEmojiSelect={handleEmojiSelect}
        >
          <Button variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
        </EmojiSelector>
        {isThread && (
          <Hint label="Reply in thread">
            <Button size="icon" variant="ghost" onClick={handleThreadOpen}>
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button size="icon" variant="ghost" onClick={handleEdit}>
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button size="icon" variant="ghost" onClick={handleDelete}>
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  )
}
