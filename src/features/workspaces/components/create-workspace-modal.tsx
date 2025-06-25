import { useRouter } from "next/navigation"

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

import { useCreateWorkspace } from "@/features/workspaces/api/useCreateWorkspace"
import { useWorkspaceModalStore } from "@/features/workspaces/store/useWorkspaceModalStore"
import {
  CreateWorkspaceForm,
  createWorkspaceFormSchema,
} from "@/features/workspaces/validation/workspaceSchemas"

export function CreateWorkspaceModal({
  isModalClosable = true,
}: {
  isModalClosable?: boolean
}) {
  const router = useRouter()
  const { isOpen, setIsOpen } = useWorkspaceModalStore()

  const form = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: {
      name: "",
    },
  })

  function handleClose() {
    form.reset()
    setIsOpen(false)
  }

  const { mutate: createWorkspace, isPending: isCreateWorkspacePending } =
    useCreateWorkspace()

  function handleSubmit(values: CreateWorkspaceForm) {
    createWorkspace(values, {
      onSuccess: (id) => {
        router.push(`/workbench/${id}`)
        handleClose()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={isModalClosable && !isCreateWorkspacePending}
      >
        <DialogHeader>
          <DialogTitle>Create a New Workspace</DialogTitle>
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
            <DialogFooter>
              <Button type="submit" disabled={isCreateWorkspacePending}>
                {isCreateWorkspacePending ? "Creating..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
