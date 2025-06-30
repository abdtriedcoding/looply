import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  EditWorkspaceForm,
  editWorkspaceFormSchema,
} from "@/features/workspaces/validation/workspaceSchemas"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

interface EditWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Doc<"workspace">
}

export function EditWorkspaceModal({
  open,
  onOpenChange,
  workspace,
}: EditWorkspaceModalProps) {
  const workspaceEditForm = useForm<EditWorkspaceForm>({
    resolver: zodResolver(editWorkspaceFormSchema),
    defaultValues: {
      name: workspace.name,
    },
  })

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useMutation({
      mutationFn: useConvexMutation(api.workspaces.updateWorkspace),
    })

  const handleModalClose = () => {
    if (!isUpdatingWorkspace) {
      workspaceEditForm.reset()
      onOpenChange(false)
    }
  }

  const handleWorkspaceUpdate = (values: EditWorkspaceForm) => {
    updateWorkspace(
      { ...values, workspaceId: workspace._id },
      { onSuccess: () => handleModalClose() }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update workspace{" "}
            <span className="text-primary">{workspace.name}</span>
          </DialogTitle>
        </DialogHeader>
        <Form {...workspaceEditForm}>
          <form
            onSubmit={workspaceEditForm.handleSubmit(handleWorkspaceUpdate)}
            className="space-y-5"
          >
            <FormField
              control={workspaceEditForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Design Team, Marketing Hub"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isUpdatingWorkspace}>
                {isUpdatingWorkspace ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
