import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { api } from "../../../../convex/_generated/api"
import { useCreateWorkspaceModalStore } from "../store/useCreateWorkspaceModal"
import { createWorkspaceFormSchema } from "../validation/workspaceSchemas"

export function CreateWorkspaceModal({
  isModalClosable = true,
}: {
  isModalClosable: boolean
}) {
  const router = useRouter()
  const { createWorkspaceIsOpen, setCreateWorkspaceIsOpen } =
    useCreateWorkspaceModalStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.createWorkspace),
  })

  const form = useForm<z.infer<typeof createWorkspaceFormSchema>>({
    resolver: zodResolver(createWorkspaceFormSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof createWorkspaceFormSchema>) {
    const promise = mutateAsync(values)
    toast.promise(promise, {
      loading: "Loading...",
      success: (workbenchId) => {
        setCreateWorkspaceIsOpen(false)
        router.push(`/workbench/${workbenchId}`)
        return `${values.name} workspace has been added`
      },
      error: () => {
        return "Failed to create workspace"
      },
    })
  }

  return (
    <Dialog
      open={createWorkspaceIsOpen}
      onOpenChange={setCreateWorkspaceIsOpen}
    >
      <DialogContent showCloseButton={isModalClosable}>
        <DialogHeader>
          <DialogTitle>Create a New Workspace</DialogTitle>
          <DialogDescription>
            Workspaces help you organize your team, projects, and tools in one
            place.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              <Button type="submit" disabled={isPending}>
                Create Workspace
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
