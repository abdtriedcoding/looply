"use client"

import { useConversationId } from "@/hooks/useConversationId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

export default function ConversationPage() {
  const workspaceId = useWorkspaceId()
  const conversationId = useConversationId()

  return <div>Conversation {conversationId}</div>
}
