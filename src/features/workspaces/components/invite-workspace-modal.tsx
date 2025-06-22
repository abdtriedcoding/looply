import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"

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
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"
import { useInviteWorkspaceModalStore } from "../store/useInviteWorkspaceModal"

export function InviteWorkspaceModal() {
  const origin = useOrigin()
  const workspaceId = useWorkspaceId()
  const [isCopied, setIsCopied] = useState(false)
  const { inviteWorkspaceIsOpen, setInviteWorkspaceIsOpen } =
    useInviteWorkspaceModalStore()

  const { data } = useQuery({
    ...convexQuery(api.workspaces.getWorkspaceById, { id: workspaceId }),
    initialData: null,
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.updateWorkspaceJoinCode),
  })

  const handleNewCode = async () => {
    if (!data) return
    const promise = mutateAsync({
      id: data._id,
    })
    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        return "New code generated"
      },
      error: () => {
        return "Failed to generate new code"
      },
    })
  }

  const handleCopy = async () => {
    setIsCopied(true)
    const link = `${origin}/join/${workspaceId}`
    await navigator.clipboard.writeText(link)
    toast.success("Link copied to clipboard")
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <Dialog
      open={inviteWorkspaceIsOpen}
      onOpenChange={setInviteWorkspaceIsOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Invite people to{" "}
            <span className="text-primary font-semibold">{data?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-y-4 py-10">
          <p className="text-4xl font-bold tracking-widest">{data?.joinCode}</p>
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
              <Copy className="ml-2 size-4" />
            )}
          </Button>
        </div>
        <div className="flex w-full items-center justify-between">
          <Button
            onClick={handleNewCode}
            variant="outline"
            disabled={isPending}
          >
            New code
            <RefreshCcw className="ml-2 size-4" />
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
