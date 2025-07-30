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

import { COPY_STATUS_TIMEOUT } from "@/constants"
import { handleConvexMutationError } from "@/lib/convex-mutation-error"
import { cn } from "@/lib/utils"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

interface InviteWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Doc<"workspace">
}

export function InviteWorkspaceModal({
  open,
  onOpenChange,
  workspace,
}: InviteWorkspaceModalProps) {
  const currentOrigin = useOrigin()
  const [isInviteLinkCopied, setIsInviteLinkCopied] = useState(false)

  const {
    mutate: generateNewWorkspaceJoinCode,
    isPending: isGeneratingNewWorkspaceJoinCode,
  } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.updateWorkspaceJoinCode),
    onError: (err: Error) => {
      toast.error(handleConvexMutationError(err, "Failed to generate new code"))
    },
    onSuccess: () => {
      toast.success("New code generated")
    },
  })

  const handleGenerateNewCode = () => {
    generateNewWorkspaceJoinCode({ workspaceId: workspace._id })
  }

  const handleCopyInviteLink = async () => {
    const link = `${currentOrigin}/join/${workspace._id}`
    setIsInviteLinkCopied(true)
    try {
      await navigator.clipboard.writeText(link)
      toast.success("Link copied to clipboard")
    } catch {
      toast.error("Failed to copy link")
    } finally {
      setTimeout(() => setIsInviteLinkCopied(false), COPY_STATUS_TIMEOUT)
    }
  }

  const isModalClosable = !isGeneratingNewWorkspaceJoinCode

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
            onClick={handleCopyInviteLink}
            disabled={isInviteLinkCopied}
          >
            {isInviteLinkCopied ? "Copied" : "Copy link"}
            {isInviteLinkCopied ? (
              <Check className="ml-2 size-4 text-emerald-500" />
            ) : (
              <Copy className="text-muted-foreground ml-2 size-4" />
            )}
          </Button>
        </div>
        <div className="flex w-full items-center justify-between">
          <Button
            onClick={handleGenerateNewCode}
            variant="outline"
            disabled={isGeneratingNewWorkspaceJoinCode}
          >
            {isGeneratingNewWorkspaceJoinCode ? "Generating..." : "New code"}
            <RefreshCcw
              className={cn(
                "ml-2 size-4",
                isGeneratingNewWorkspaceJoinCode && "animate-spin"
              )}
            />
          </Button>
          <DialogClose asChild>
            <Button disabled={!isModalClosable}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
