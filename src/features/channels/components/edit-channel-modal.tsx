"use client"

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
import { Textarea } from "@/components/ui/textarea"

import { useEditChannel } from "@/features/channels/api/useEditChannel"
import {
  EditChannelForm,
  editChannelFormSchema,
} from "@/features/channels/validation/channelSchemas"

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
  const { mutate: updateChannel, isPending: isUpdateChannelPending } =
    useEditChannel()

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

  function handleSubmit(values: EditChannelForm) {
    updateChannel(
      { ...values, workspaceId: channel.workspaceId, channelId: channel._id },
      { onSuccess: () => handleClose() }
    )
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
