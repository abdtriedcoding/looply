"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"

import { FallbackScreen } from "@/components/fallback-screen"
import { LoadingScreen } from "@/components/loading-screen"

import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal"

import { api } from "../../convex/_generated/api"

export default function HomePage() {
  const router = useRouter()
  const { isWorkspaceModalOpen, openWorkspaceModal } = useCreateWorkspaceModal()

  const {
    data: userWorkspaces,
    isPending: isWorkspacesLoading,
    error: workspacesLoadingError,
  } = useQuery(convexQuery(api.workspaces.getWorkspaces, {}))

  useEffect(() => {
    if (isWorkspacesLoading) return

    const mostRecentWorkspaceId = userWorkspaces?.[0]?._id
    if (mostRecentWorkspaceId) {
      router.replace(`/workspace/${mostRecentWorkspaceId}`)
    } else if (!isWorkspaceModalOpen) {
      openWorkspaceModal()
    }
  }, [
    isWorkspacesLoading,
    userWorkspaces,
    openWorkspaceModal,
    router,
    isWorkspaceModalOpen,
  ])

  if (isWorkspacesLoading) return <LoadingScreen />

  if (workspacesLoadingError) {
    return (
      <FallbackScreen
        title="Workspaces Error"
        description="Something went wrong while loading your workspaces. Please try again later."
        buttonLabel="Return Home"
        buttonLink="/"
      />
    )
  }

  return null
}
