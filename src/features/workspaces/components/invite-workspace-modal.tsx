import { useState } from "react"

import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { Check, Copy, RefreshCcw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useOrigin } from "@/hooks/useOrigin"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

export function InviteWorkspaceModal({
  open,
  onOpenChange,
  workspace,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Doc<"workspace">
}) {
  const origin = useOrigin()
  const [isCopied, setIsCopied] = useState(false)

  const { mutate: updateJoinCode, isPending: isUpdateJoinCodePending } =
    useMutation({
      mutationFn: useConvexMutation(api.workspaces.updateWorkspaceJoinCode),
      onError: (err: Error) => {
        toast.error(
          handleConvexMutationError(err, "Failed to generate new code")
        )
      },
      onSuccess: () => {
        toast.success("New code generated")
      },
    })

  const handleNewCode = () => {
    updateJoinCode({ workspaceId: workspace._id })
  }

  const handleCopy = async () => {
    setIsCopied(true)
    const link = `${origin}/join/${workspace._id}`
    await navigator.clipboard.writeText(link)
    toast.success("Link copied to clipboard")
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Invite people to{" "}
            <span className="text-primary font-semibold">{workspace.name}</span>
          </DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-y-4 py-10">
          <p className="text-4xl font-bold tracking-widest">
            {workspace.joinCode}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={isCopied}
          >
            {isCopied ? "Copied" : "Copy link"}
            {isCopied ? (
              <Check className="ml-2 size-4 text-emerald-500" />
            ) : (
              <Copy className="text-muted-foreground ml-2 size-4" />
            )}
          </Button>
        </div>
        <div className="flex w-full items-center justify-between">
          <Button
            onClick={handleNewCode}
            variant="outline"
            disabled={isUpdateJoinCodePending}
          >
            {isUpdateJoinCodePending ? "Generating..." : "New code"}
            <RefreshCcw className="text-muted-foreground ml-2 size-4" />
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
