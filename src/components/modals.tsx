"use client"

import React, { useEffect, useState } from "react"

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"

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
    </>
  )
}
