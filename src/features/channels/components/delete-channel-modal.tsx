"use client"

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

import { useChannelId } from "@/hooks/useChannelId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"
import { useDeleteChannelModalStore } from "../store/useDeleteChannelModal"

export function DeleteChannelModal() {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()
  const { deleteChannelIsOpen, setDeleteChannelIsOpen } =
    useDeleteChannelModalStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.deleteChannel),
  })

  async function handleDelete() {
    try {
      const result = await mutateAsync({ workspaceId, channelId })
      if (result && typeof result === "object" && "error" in result) {
        toast.error(result.error)
        return
      }
      toast.success(`${channelId} channel has been deleted`)
      setDeleteChannelIsOpen(false)
    } catch {
      toast.error("Failed to delete channel")
    }
  }
  return (
    <AlertDialog
      open={deleteChannelIsOpen}
      onOpenChange={setDeleteChannelIsOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            channel and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
