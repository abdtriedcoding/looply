import { useParams } from "next/navigation"

import { Id } from "../../convex/_generated/dataModel"

/**
 * Hook to get the current channel ID from the route params.
 */
export const useChannelId = (): Id<"channel"> => {
  const params = useParams()
  const id = params.channelId as Id<"channel">
  if (!id) {
    console.warn("[useChannelId] channelId param is missing from route.")
  }
  return id
}
