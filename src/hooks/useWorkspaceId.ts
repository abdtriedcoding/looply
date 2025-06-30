import { useParams } from "next/navigation"

import { Id } from "../../convex/_generated/dataModel"

/**
 * Hook to get the current workspace ID from the route params.
 */
export const useWorkspaceId = (): Id<"workspace"> => {
  const params = useParams()
  const id = params.workspaceId as Id<"workspace">
  if (!id) {
    console.warn("[useWorkspaceId] workspaceId param is missing from route.")
  }
  return id
}
