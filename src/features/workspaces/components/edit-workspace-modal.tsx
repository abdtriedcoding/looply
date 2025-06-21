import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"

import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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

import { api } from "../../../../convex/_generated/api"
import { useEditWorkspaceModalStore } from "../store/useEditWorkspaceModal"
import { editWorkspaceFormSchema } from "../validation/workspaceSchemas"

export function EditWorkspaceModal() {
  const { editWorkspaceIsOpen, setEditWorkspaceIsOpen, editWorkspaceData } =
    useEditWorkspaceModalStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.updateWorkspace),
  })

  const form = useForm<z.infer<typeof editWorkspaceFormSchema>>({
    resolver: zodResolver(editWorkspaceFormSchema),
    defaultValues: {
      name: editWorkspaceData?.name || "",
      imageUrl: editWorkspaceData?.imageUrl || "",
    },
  })

  useEffect(() => {
    if (editWorkspaceData) {
      form.reset({
        name: editWorkspaceData.name || "",
        imageUrl: editWorkspaceData.imageUrl || "",
      })
    }
  }, [editWorkspaceData, form])

  const handleClose = () => {
    setEditWorkspaceIsOpen(false)
    form.reset()
  }

  function onSubmit(values: z.infer<typeof editWorkspaceFormSchema>) {
    if (!editWorkspaceData) return
    const promise = mutateAsync({
      id: editWorkspaceData._id,
      ...values,
    })
    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        handleClose()
        return `${values.name} workspace has been updated`
      },
      error: () => {
        return "Failed to update workspace"
      },
    })
  }

  return (
    <Dialog open={editWorkspaceIsOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
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
              <Button type="submit" disabled={isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
