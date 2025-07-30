"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"

import { FallbackScreen } from "@/components/fallback-screen"
import { LoadingScreen } from "@/components/loading-screen"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../../convex/_generated/api"

export default function WorkspacePage() {
  const router = useRouter()
  const currentWorkspaceId = useWorkspaceId()

  const {
    data: workspaceChannels,
    isPending: isWorkspaceChannelsLoading,
    error: channelsLoadingError,
  } = useQuery(
    convexQuery(api.channels.getChannels, { workspaceId: currentWorkspaceId })
  )

  useEffect(() => {
    if (isWorkspaceChannelsLoading) return

    const mostRecentChannelId = workspaceChannels?.[0]?._id
    if (mostRecentChannelId) {
      router.replace(
        `/workspace/${currentWorkspaceId}/channel/${mostRecentChannelId}`
      )
    }
  }, [
    workspaceChannels,
    currentWorkspaceId,
    router,
    isWorkspaceChannelsLoading,
  ])

  if (isWorkspaceChannelsLoading) return <LoadingScreen />

  if (channelsLoadingError)
    return (
      <FallbackScreen
        title="Channels Error"
        description="Unable to load channels. Please refresh the page to try again."
        buttonLabel="Reload"
        buttonLink="/"
      />
    )

  return null
}
