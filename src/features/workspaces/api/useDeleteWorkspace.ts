import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

import {
  DeleteWorkspaceArgs,
  deleteWorkspaceArgsSchema,
} from "@/features/workspaces/validation/workspaceSchemas"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

export function useDeleteWorkspace(onSuccess?: () => void) {
  const convexMutate = useConvexMutation(api.workspaces.deleteWorkspace)
  return useMutation({
    mutationFn: async (args: DeleteWorkspaceArgs) => {
      const result = deleteWorkspaceArgsSchema.safeParse(args)
      if (!result.success) throw new ConvexError("Invalid arguments")
      return convexMutate(result.data)
    },
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to delete workspace"))
    },
    onSuccess: () => {
      toast.success("Workspace has been deleted")
      onSuccess?.()
    },
  })
}
