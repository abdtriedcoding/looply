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

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export function DeleteMessageModal({
  open,
  onOpenChange,
  messageId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: Id<"message">
}) {
  const { mutateAsync: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: useConvexMutation(api.messages.deleteMessage),
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to delete message"))
    },
    onSuccess: () => {
      toast.success(`Message deleted`)
    },
  })

  function handleDelete() {
    deleteMessage({ messageId })
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this message ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The message will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
