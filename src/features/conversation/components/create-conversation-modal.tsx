import { useRouter } from "next/navigation"
import { useState } from "react"

import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { handleConvexMutationError } from "@/lib/convex-mutation-error"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export function CreateConversationModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const workspaceId = useWorkspaceId()
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const router = useRouter()

  const { data: members } = useQuery(
    convexQuery(api.members.getAllMembers, { workspaceId })
  )

  const { mutate: createConversation, isPending: isCreating } = useMutation({
    mutationFn: useConvexMutation(api.conversations.createConversation),
    onError: (err: Error) => {
      toast.error(
        handleConvexMutationError(err, "Failed to create conversation")
      )
    },
    onSuccess: (conversationId: Id<"conversation">) => {
      toast.success(`Conversation created`)
      router.push(
        `/workspace/${workspaceId}/conversation/${conversationId}/member/${selectedMemberId}`
      )
      setSelectedMemberId("")
      onOpenChange(false)
    },
  })

  const handleSubmit = () => {
    createConversation({
      workspaceId,
      memberId: selectedMemberId as Id<"workspaceMember">,
    })
  }

  function handleClose() {
    setSelectedMemberId("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Create Conversation</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input type="text" placeholder="Search" className="pr-4 pl-10" />
        </div>
        <div className="mt-4 max-h-[200px] space-y-2 overflow-y-auto">
          {members?.map((member) => (
            <div
              key={member._id}
              className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg px-3 py-2"
              onClick={() =>
                setSelectedMemberId((prev) =>
                  prev === member._id ? "" : member._id
                )
              }
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={member.user.image || "https://github.com/shadcn.png"}
                    alt={"User avatar"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {member.user.name}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{member.user.name}</span>
              </div>
              <Checkbox
                className="border-muted-foreground"
                checked={selectedMemberId === member._id}
              />
            </div>
          ))}
        </div>
        <DialogFooter className="pt-2">
          <Button
            type="button"
            disabled={!selectedMemberId || isCreating}
            className="w-full"
            onClick={handleSubmit}
          >
            Create Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
