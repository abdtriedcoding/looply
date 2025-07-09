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

import { useDeleteWorkspace } from "@/features/workspaces/api/useDeleteWorkspace"

import { Doc } from "../../../../convex/_generated/dataModel"

export function DeleteWorkspaceModal({
  open,
  onOpenChange,
  workspace,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Doc<"workspace">
}) {
  const router = useRouter()

  const { mutate: deleteWorkspace, isPending: isDeleteWorkspacePending } =
    useDeleteWorkspace()

  function handleDelete() {
    deleteWorkspace(
      { workspaceId: workspace._id },
      {
        onSuccess: () => {
          onOpenChange(false)
          router.replace("/")
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
            disabled={isDeleteWorkspacePending}
            onClick={handleDelete}
          >
            {isDeleteWorkspacePending ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
