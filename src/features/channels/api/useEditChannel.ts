import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

import {
  UpdateChannelArgs,
  updateChannelArgsSchema,
} from "@/features/channels/validation/channelSchemas"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

export function useEditChannel(onSuccess?: () => void) {
  const convexMutate = useConvexMutation(api.channels.updateChannel)
  return useMutation({
    mutationFn: async (args: UpdateChannelArgs) => {
      const result = updateChannelArgsSchema.safeParse(args)
      if (!result.success) throw new ConvexError("Invalid arguments")
      return convexMutate(result.data)
    },
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to update channel"))
    },
    onSuccess: (_result, variables) => {
      toast.success(`${variables.name} channel has been updated`)
      onSuccess?.()
    },
  })
}
