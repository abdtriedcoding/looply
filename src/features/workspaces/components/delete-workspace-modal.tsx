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

interface DeleteWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Doc<"workspace">
}

export function DeleteWorkspaceModal({
  open,
  onOpenChange,
  workspace,
}: DeleteWorkspaceModalProps) {
  const router = useRouter()

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useMutation({
      mutationFn: useConvexMutation(api.workspaces.deleteWorkspace),
    })

  const handleSubmit = () => {
    deleteWorkspace(
      { workspaceId: workspace._id },
      {
        onSuccess: () => {
          onOpenChange(false)
          router.replace("/")
          toast.success(`Workspace "${workspace.name}" deleted`)
        },
        onError: (err: Error) => {
          toast.error(
            handleConvexMutationError(err, "Failed to delete workspace")
          )
        },
      }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete workspace{" "}
            <span className="text-primary">{workspace.name}</span> ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This can&apos;t be undone. All data in{" "}
            <span className="text-primary">{workspace.name}</span> will be
            permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeletingWorkspace}
            onClick={handleSubmit}
          >
            {isDeletingWorkspace ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
