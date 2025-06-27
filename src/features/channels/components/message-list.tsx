import { Message } from "@/features/channels/components/message"

import { Doc } from "../../../../convex/_generated/dataModel"

export const MessageList = ({ messages }: { messages: any }) => {
  return (
    <div className="messages-scrollbar flex flex-1 flex-col overflow-y-auto">
      {messages?.length > 0 &&
        messages.map((message) => (
          <Message
            key={message._id}
            authorName={message.user.name}
            authorImage={message.user.image}
            createdAt={message.createdAt}
            body={message.text}
            image={message.images}
          />
        ))}
    </div>
  )
}
