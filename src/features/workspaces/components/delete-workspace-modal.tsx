import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

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

import { api } from "../../../../convex/_generated/api"
import { useDeleteWorkspaceModalStore } from "../store/useDeleteWorkspaceModal"

export function DeleteWorkspaceModal() {
  const router = useRouter()
  const { isOpen, setIsOpen, data } = useDeleteWorkspaceModalStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.deleteWorkspace),
  })

  function handleDelete() {
    if (!data) return
    const promise = mutateAsync({ id: data })
    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        setIsOpen(false)
        router.push("/")
        return "Workspace has been deleted"
      },
      error: () => {
        return "Failed to delete workspace"
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            workspace and remove your data from our servers.
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
