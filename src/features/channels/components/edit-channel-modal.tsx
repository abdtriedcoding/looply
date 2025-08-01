"use client"

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
import { Textarea } from "@/components/ui/textarea"

import {
  EditChannelForm,
  editChannelFormSchema,
} from "@/features/channels/validation/channel-schemas"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

export function EditChannelModal({
  open,
  onOpenChange,
  channel,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  channel: Doc<"channel">
}) {
  const form = useForm<EditChannelForm>({
    resolver: zodResolver(editChannelFormSchema),
    defaultValues: {
      name: channel.name,
      description: channel.description,
    },
  })

  function handleClose() {
    form.reset()
    onOpenChange(false)
  }

  const { mutate: updateChannel, isPending: isUpdateChannelPending } =
    useMutation({
      mutationFn: useConvexMutation(api.channels.updateChannel),
    })

  function handleSubmit(values: EditChannelForm) {
    const validationResult = editChannelFormSchema.safeParse(values)

    if (!validationResult.success) {
      toast.error("Invalid form data")
      return
    }

    const payload = {
      ...validationResult.data,
      workspaceId: channel.workspaceId,
      channelId: channel._id,
    }

    updateChannel(payload, {
      onSuccess: () => {
        toast.success(`Channel "${channel.name}" updated`)
        handleClose()
      },
      onError: (err: Error) => {
        toast.error(handleConvexMutationError(err, "Failed to update channel"))
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update channel <span className="text-primary">{channel.name}</span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
              <Button
                type="submit"
                disabled={isUpdateChannelPending}
                className="w-full"
              >
                {isUpdateChannelPending ? "Updating..." : "Update Channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
