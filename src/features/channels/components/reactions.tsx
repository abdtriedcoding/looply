import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { Smile } from "lucide-react"

import { EmojiSelector } from "@/components/emoji-selector"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export const Reactions = ({
  reactions,
  messageId,
}: {
  reactions: any[]
  messageId: Id<"message">
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
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {reactions.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.emoji}`}
        >
          <button
            onClick={() => handleEmojiSelect(reaction.emoji)}
            className="bg-muted hover:bg-muted/70 flex items-center gap-1 rounded-md border px-1 py-0.5 text-sm transition-all"
          >
            <span>{reaction.emoji}</span>
            <span className="text-muted-foreground text-xs">
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}

      <EmojiSelector onEmojiSelect={handleEmojiSelect} hint="Add reaction">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:bg-muted h-auto rounded-md border px-1 py-1"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </EmojiSelector>
    </div>
  )
}
