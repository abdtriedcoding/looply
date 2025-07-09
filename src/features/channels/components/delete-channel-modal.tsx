"use client"

import { useRouter } from "next/navigation"

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

import { useDeleteChannel } from "@/features/channels/api/useDeleteChannel"

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
    useDeleteChannel()

  function handleDelete() {
    deleteChannel(
      { workspaceId: channel.workspaceId, channelId: channel._id },
      {
        onSuccess: () => {
          onOpenChange(false)
          router.replace(`/workbench/${channel.workspaceId}`)
        },
      }
    )
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
