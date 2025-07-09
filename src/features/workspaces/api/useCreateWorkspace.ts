import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

import {
  CreateWorkspaceArgs,
  createWorkspaceArgsSchema,
} from "@/features/workspaces/validation/workspaceSchemas"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export function useCreateWorkspace(
  onSuccess?: (
    id: Id<"workspace"> | null,
    variables: CreateWorkspaceArgs
  ) => void
) {
  const convexMutate = useConvexMutation(api.workspaces.createWorkspace)
  return useMutation({
    mutationFn: async (args: CreateWorkspaceArgs) => {
      const result = createWorkspaceArgsSchema.safeParse(args)
      if (!result.success) throw new ConvexError("Invalid arguments")
      return convexMutate(result.data)
    },
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to create workspace"))
    },
    onSuccess: (id, variables) => {
      toast.success(`${variables.name} workspace has been added`)
      onSuccess?.(id as Id<"workspace"> | null, variables)
    },
  })
}
