import { useParams } from "next/navigation"

import { Id } from "../../convex/_generated/dataModel"

/**
 * Hook to get the current conversation ID from the route params.
 */
export const useConversationId = (): Id<"conversation"> => {
  const params = useParams()
  const id = params.conversationId as Id<"conversation">
  if (!id) {
    console.warn(
      "[useConversationId] conversationId param is missing from route."
    )
  }
  return id
}
