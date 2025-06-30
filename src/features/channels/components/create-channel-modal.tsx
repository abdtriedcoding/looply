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
import { Textarea } from "@/components/ui/textarea"

import {
  CreateChannelForm,
  createChannelFormSchema,
} from "@/features/channels/validation/channel-schemas"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"

export function CreateChannelModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const currentWorkspaceId = useWorkspaceId()

  const form = useForm<CreateChannelForm>({
    resolver: zodResolver(createChannelFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  function handleClose() {
    form.reset()
    onOpenChange(false)
  }

  const { mutate: createChannel, isPending: isCreateChannelPending } =
    useMutation({
      mutationFn: useConvexMutation(api.channels.createChannel),
    })

  function handleSubmit(values: CreateChannelForm) {
    const validationResult = createChannelFormSchema.safeParse(values)

    if (!validationResult.success) {
      toast.error("Invalid form data")
      return
    }

    const payload = {
      ...validationResult.data,
      workspaceId: currentWorkspaceId,
    }

    createChannel(payload, {
      onSuccess: ({ channelId, channelName }) => {
        toast.success(`Channel "${channelName}" created`)
        router.replace(`/workspace/${currentWorkspaceId}/channel/${channelId}`)
      },
      onError: (err: Error) => {
        toast.error(handleConvexMutationError(err, "Failed to create channel"))
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Create Channel</DialogTitle>
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
                disabled={isCreateChannelPending}
                className="w-full"
              >
                {isCreateChannelPending ? "Creating..." : "Create Channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
