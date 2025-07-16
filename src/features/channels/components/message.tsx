import dayjs from "dayjs"

import { Hint } from "@/components/hint"
import { Renderer } from "@/components/renderer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Thumbnail } from "@/features/channels/components/thumbnail"
import { Toolbar } from "@/features/channels/components/toolbar"

import { formatFullTime } from "@/lib/date-formatter"

import { Id } from "../../../../convex/_generated/dataModel"
import { Reactions } from "./reactions"

export const Message = ({
  messageId,
  authorName,
  authorImage,
  createdAt,
  body,
  image,
  reactions,
  isAuthor,
}: {
  messageId: Id<"message">
  authorName: string
  authorImage: string
  createdAt: string
  body: string
  image: string[]
  reactions: any[]
  isAuthor: boolean
}) => {
  return (
    <div className="group hover:bg-muted relative flex flex-col p-1.5 px-5">
      <div className="flex items-start gap-2">
        <Avatar>
          <AvatarImage src={authorImage} />
          <AvatarFallback>{authorName?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm">
            <h2 className="text-primary font-bold hover:underline">
              {authorName}
            </h2>
            <Hint label={formatFullTime(dayjs(createdAt))}>
              <button className="text-muted-foreground text-xs hover:underline">
                {dayjs(createdAt).format("h:mm a")}
              </button>
            </Hint>
          </div>

          {body && <Renderer value={body} />}
          {image.length > 0 && <Thumbnail url={image} />}
          {reactions.length > 0 && (
            <Reactions reactions={reactions} messageId={messageId} />
          )}
        </div>

        <Toolbar isAuthor={isAuthor} messageId={messageId} />
      </div>
    </div>
  )
}
