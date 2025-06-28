"use client"

import { useRouter } from "next/navigation"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { HashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useConversationId } from "@/hooks/useConversationId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

export function AllConversations({
  conversations,
}: {
  conversations: (Doc<"conversation"> & { otherMemberUser: Doc<"users"> })[]
}) {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const conversationId = useConversationId()

  const { data: currentMember } = useQuery(
    convexQuery(api.members.currentMember, { workspaceId })
  )

  return (
    <ul className="space-y-1 px-2">
      {conversations?.map((conversation) => {
        const otherMemberId =
          conversation.memberOneId === currentMember?._id
            ? conversation.memberTwoId
            : conversation.memberOneId
        return (
          <li
            key={conversation._id}
            className="group relative flex items-center justify-between gap-2"
          >
            <Button
              onClick={() =>
                router.push(
                  `/workbench/${workspaceId}/conversation/${conversation._id}/member/${otherMemberId}`
                )
              }
              size="lg"
              variant={
                conversationId === conversation._id ? "secondary" : "ghost"
              }
              className="w-full justify-start"
            >
              <HashIcon className="text-muted-foreground size-4" />
              <span className="text-muted-foreground truncate font-medium">
                {conversation.otherMemberUser.name}
              </span>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
