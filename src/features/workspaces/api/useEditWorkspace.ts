import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

import {
  UpdateWorkspaceArgs,
  updateWorkspaceArgsSchema,
} from "@/features/workspaces/validation/workspaceSchemas"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

export function useEditWorkspace(onSuccess?: () => void) {
  const convexMutate = useConvexMutation(api.workspaces.updateWorkspace)
  return useMutation({
    mutationFn: async (args: UpdateWorkspaceArgs) => {
      const result = updateWorkspaceArgsSchema.safeParse(args)
      if (!result.success) throw new ConvexError("Invalid arguments")
      return convexMutate(result.data)
    },
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to update workspace"))
    },
    onSuccess: (_result, variables) => {
      toast.success(`${variables.name} workspace has been updated`)
      onSuccess?.()
    },
  })
}
