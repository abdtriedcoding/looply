import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

import {
  DeleteChannelArgs,
  deleteChannelArgsSchema,
} from "@/features/channels/validation/channelSchemas"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

export function useDeleteChannel(onSuccess?: () => void) {
  const convexMutate = useConvexMutation(api.channels.deleteChannel)
  return useMutation({
    mutationFn: async (args: DeleteChannelArgs) => {
      const result = deleteChannelArgsSchema.safeParse(args)
      if (!result.success) throw new ConvexError("Invalid arguments")
      return convexMutate(result.data)
    },
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to delete channel"))
    },
    onSuccess: () => {
      toast.success("Channel has been deleted")
      onSuccess?.()
    },
  })
}
