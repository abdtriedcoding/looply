"use client"

import { useRouter } from "next/navigation"

import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

export function DeleteChannelModal({
  open,
  onOpenChange,
  channel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  channel: Doc<"channel">
}) {
  const router = useRouter()

  const { mutate: deleteChannel, isPending: isDeleteChannelPending } =
    useMutation({
      mutationFn: useConvexMutation(api.channels.deleteChannel),
    })

  function handleDelete() {
    const payload = {
      workspaceId: channel.workspaceId,
      channelId: channel._id,
    }

    deleteChannel(payload, {
      onSuccess: () => {
        onOpenChange(false)
        router.replace(`/workspace/${channel.workspaceId}`)
      },
      onError: (err: Error) => {
        toast.error(handleConvexMutationError(err, "Failed to delete channel"))
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete channel <span className="text-primary">{channel.name}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All data in{" "}
            <span className="text-primary">{channel.name}</span> will be
            permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleteChannelPending}
            onClick={handleDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
