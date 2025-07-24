import { useParams } from "next/navigation"

import { Id } from "../../convex/_generated/dataModel"

/**
 * Hook to get the current member ID from the route params.
 */
export const useMemberId = (): Id<"workspaceMember"> => {
  const params = useParams()
  const id = params.memberId as Id<"workspaceMember">
  if (!id) {
    console.warn("[useMemberId] memberId param is missing from route.")
  }
  return id
}
