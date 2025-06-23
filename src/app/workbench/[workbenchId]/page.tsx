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

  const { data, isPending } = useQuery({
    ...convexQuery(api.channels.getChannels, { workspaceId }),
    initialData: [],
  })

  useEffect(() => {
    const channelId = data?.[0]?._id
    if (channelId) {
      router.replace(`/workbench/${workspaceId}/channel/${channelId}`)
    }
  }, [data, workspaceId, router])

  if (isPending)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )

  return null
}
