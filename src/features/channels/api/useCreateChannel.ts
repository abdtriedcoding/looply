import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

import {
  CreateChannelArgs,
  createChannelArgsSchema,
} from "@/features/channels/validation/channelSchemas"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

export function useCreateChannel(onSuccess?: () => void) {
  const convexMutate = useConvexMutation(api.channels.createChannel)
  return useMutation({
    mutationFn: async (args: CreateChannelArgs) => {
      const result = createChannelArgsSchema.safeParse(args)
      if (!result.success) throw new ConvexError("Invalid arguments")
      return convexMutate(result.data)
    },
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to create channel"))
    },
    onSuccess: (_result, variables) => {
      toast.success(`${variables.name} channel has been added`)
      onSuccess?.()
    },
  })
}
