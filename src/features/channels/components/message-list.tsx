import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"

import { Message } from "@/features/channels/components/message"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"

export const MessageList = ({ messages }: { messages: any }) => {
  const workspaceId = useWorkspaceId()
  const {
    data: currentMember,
    isPending: isMemberLoading,
    error: memberError,
  } = useQuery(convexQuery(api.currentMember.currentMember, { workspaceId }))

  return (
    <div className="messages-scrollbar flex flex-1 flex-col overflow-y-auto">
      {messages?.length > 0 &&
        messages.map((message) => (
          <Message
            key={message._id}
            messageId={message._id}
            authorName={message.user.name}
            authorImage={message.user.image}
            createdAt={message.createdAt}
            body={message.text}
            image={message.images}
            reactions={message.reactions}
            isAuthor={message.memberId === currentMember?._id}
            updatedAt={message.updatedAt}
          />
        ))}
    </div>
  )
}
