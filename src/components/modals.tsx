"use client"

import { useEffect, useState } from "react"

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { DeleteWorkspaceModal } from "@/features/workspaces/components/delete-workspace-modal"
import { EditWorkspaceModal } from "@/features/workspaces/components/edit-workspace-modal"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

export function Modals() {
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
    </>
  )
}
