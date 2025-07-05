"use client"

import React, { useEffect, useState } from "react"

import { CreateChannelModal } from "@/features/channels/components/create-channel-modal"
import { DeleteChannelModal } from "@/features/channels/components/delete-channel-modal"
import { EditChannelModal } from "@/features/channels/components/edit-channel-modal"
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { DeleteWorkspaceModal } from "@/features/workspaces/components/delete-workspace-modal"
import { EditWorkspaceModal } from "@/features/workspaces/components/edit-workspace-modal"
import { InviteWorkspaceModal } from "@/features/workspaces/components/invite-workspace-modal"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

/**
 * Global modals portal for workspace-related modals.
 * Ensures modals are only rendered on the client to avoid hydration mismatches.
 */
export function Modals(): React.ReactNode {
  const [isMounted, setIsMounted] = useState(false)
  const workspaceId = useWorkspaceId()
  const isModalClosable = !!workspaceId

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  return (
    <>
      <CreateWorkspaceModal isModalClosable={isModalClosable} />
      <EditWorkspaceModal />
      <DeleteWorkspaceModal />
      <InviteWorkspaceModal />
      <CreateChannelModal />
      <EditChannelModal />
      <DeleteChannelModal />
    </>
  )
}
