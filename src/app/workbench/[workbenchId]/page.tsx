"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"

export default function WorkbenchPage() {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { data: channels, isPending: isChannelsLoading } = useQuery(
    convexQuery(api.channels.getChannels, { workspaceId })
  )

  useEffect(() => {
    if (isChannelsLoading) return

    const channelId = channels?.[0]?._id
    if (channelId) {
      router.replace(`/workbench/${workspaceId}/channel/${channelId}`)
    }
  }, [channels, workspaceId, router, isChannelsLoading])

  if (isChannelsLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )

  return null
}
