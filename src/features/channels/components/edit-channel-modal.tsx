"use client"

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
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
import { Textarea } from "@/components/ui/textarea"

import { useChannelId } from "@/hooks/useChannelId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"
import { useEditChannelModalStore } from "../store/useEditChannelModal"
import { editChannelFormSchema } from "../validation/channelSchemas"

export function EditChannelModal() {
  const { editChannelIsOpen, setEditChannelIsOpen } = useEditChannelModalStore()

  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const { data } = useQuery(
    convexQuery(api.channels.getChannelById, { workspaceId, channelId })
  )

  const { mutateAsync, isPending: isUpdating } = useMutation({
    mutationFn: useConvexMutation(api.channels.updateChannel),
  })

  const form = useForm<z.infer<typeof editChannelFormSchema>>({
    resolver: zodResolver(editChannelFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
    },
  })

  async function onSubmit(values: z.infer<typeof editChannelFormSchema>) {
    try {
      const result = await mutateAsync({ ...values, workspaceId, channelId })
      if (result && typeof result === "object" && "error" in result) {
        toast.error(result.error)
        return
      }
      toast.success(`${values.name} channel has been updated`)
      handleClose()
    } catch {
      toast.error("Failed to update channel")
    }
  }

  const handleClose = () => {
    form.reset()
    setEditChannelIsOpen(false)
  }

  return (
    <Dialog open={editChannelIsOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. design-team"
                      {...field}
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's this channel about?"
                      {...field}
                      className="focus-visible:ring-primary min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isUpdating} className="w-full">
                {isUpdating ? "Updating..." : "Update Channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
