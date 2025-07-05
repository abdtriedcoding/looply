import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
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

import { useCreateChannelModalStore } from "@/features/channels/store/useCreateChannelModal"
import { createChannelFormSchema } from "@/features/channels/validation/channelSchemas"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"

export function CreateChannelModal() {
  const workspaceId = useWorkspaceId()
  const { createChannelIsOpen, setCreateChannelIsOpen } =
    useCreateChannelModalStore()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.createChannel),
  })

  const form = useForm<z.infer<typeof createChannelFormSchema>>({
    resolver: zodResolver(createChannelFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof createChannelFormSchema>) {
    try {
      const result = await mutateAsync({ ...values, workspaceId })
      if (result && typeof result === "object" && "error" in result) {
        toast.error(result.error)
        return
      }
      toast.success(`${values.name} channel has been added`)
      handleClose()
    } catch {
      toast.error("Failed to create channel")
    }
  }

  const handleClose = () => {
    form.reset()
    setCreateChannelIsOpen(false)
  }

  return (
    <Dialog open={createChannelIsOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Create Channel</DialogTitle>
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
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Creating..." : "Create Channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
