import { useRouter } from "next/navigation"

import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-createworkspace-modal"
import {
  CreateWorkspaceForm,
  createWorkspaceFormSchema,
} from "@/features/workspaces/validation/workspace-schemas"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

interface CreateWorkspaceModalProps {
  isModalClosable?: boolean
}

export function CreateWorkspaceModal({
  isModalClosable = true,
}: CreateWorkspaceModalProps) {
  const router = useRouter()
  const { isWorkspaceModalOpen, closeWorkspaceModal } =
    useCreateWorkspaceModal()

  const workspaceCreationForm = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: {
      name: "",
    },
  })

  const { mutate: createWorkspace, isPending: isCreatingWorkspace } =
    useMutation({
      mutationFn: useConvexMutation(api.workspaces.createWorkspace),
    })

  const handleModalClose = () => {
    if (!isCreatingWorkspace) {
      workspaceCreationForm.reset()
      closeWorkspaceModal()
    }
  }

  const handleSubmit = (values: CreateWorkspaceForm) => {
    const validationResult = createWorkspaceFormSchema.safeParse(values)

    if (!validationResult.success) {
      toast.error("Invalid form data")
      return
    }

    createWorkspace(validationResult.data, {
      onSuccess: (id) => {
        toast.success(`Workspace "${validationResult.data.name}" created`)
        router.push(`/workspace/${id}`)
        handleModalClose()
      },
      onError: (err: Error) => {
        toast.error(
          handleConvexMutationError(err, "Failed to create workspace")
        )
      },
    })
  }

  return (
    <Dialog open={isWorkspaceModalOpen} onOpenChange={handleModalClose}>
      <DialogContent showCloseButton={isModalClosable && !isCreatingWorkspace}>
        <DialogHeader>
          <DialogTitle>Create a New Workspace</DialogTitle>
        </DialogHeader>
        <Form {...workspaceCreationForm}>
          <form
            onSubmit={workspaceCreationForm.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={workspaceCreationForm.control}
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
              <Button type="submit" disabled={isCreatingWorkspace}>
                {isCreatingWorkspace ? "Creating..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
