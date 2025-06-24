"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { useWorkspaceModalStore } from "@/features/workspaces/store/useWorkspaceModalStore"

import { api } from "../../convex/_generated/api"

export default function HomePage() {
  const router = useRouter()
  const { isOpen, setIsOpen } = useWorkspaceModalStore()

  const { data: workspaces, isPending: isWorkspacesLoading } = useQuery(
    convexQuery(api.workspaces.getWorkspaces, {})
  )

  useEffect(() => {
    if (isWorkspacesLoading) return

    const workbenchId = workspaces?.[0]?._id
    if (workbenchId) {
      router.replace(`/workbench/${workbenchId}`)
    } else if (!isOpen) {
      setIsOpen(true)
    }
  }, [isWorkspacesLoading, workspaces, setIsOpen, router, isOpen])

  if (isWorkspacesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return null
}
