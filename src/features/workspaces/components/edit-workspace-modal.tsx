import { zodResolver } from "@hookform/resolvers/zod"
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

import { useEditWorkspace } from "@/features/workspaces/api/useEditWorkspace"
import {
  EditWorkspaceForm,
  editWorkspaceFormSchema,
} from "@/features/workspaces/validation/workspaceSchemas"

import { Doc } from "../../../../convex/_generated/dataModel"

export function EditWorkspaceModal({
  open,
  onOpenChange,
  workspace,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Doc<"workspace">
}) {
  const form = useForm<EditWorkspaceForm>({
    resolver: zodResolver(editWorkspaceFormSchema),
    defaultValues: {
      name: workspace.name,
      imageUrl: workspace.imageUrl,
    },
  })

  function handleClose() {
    form.reset()
    onOpenChange(false)
  }

  const { mutate: updateWorkspace, isPending: isUpdateWorkspacePending } =
    useEditWorkspace()

  function handleSubmit(values: EditWorkspaceForm) {
    updateWorkspace(
      { ...values, workspaceId: workspace._id },
      { onSuccess: () => handleClose() }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update workspace{" "}
            <span className="text-primary">{workspace.name}</span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
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
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Image</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isUpdateWorkspacePending}>
                {isUpdateWorkspacePending ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
