"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Loader2 } from "lucide-react"
import { parseAsBoolean, useQueryState } from "nuqs"

import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces"
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"

export default function Home() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useQueryState(
    "isModalOpen",
    parseAsBoolean
  )

  const { data: workspaces, isLoading } = useGetWorkspaces()
  const workspaceId = workspaces?.[0]?._id

  useEffect(() => {
    if (isLoading) return

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!isModalOpen) {
      setIsModalOpen(true)
    }
  }, [isLoading, workspaceId, setIsModalOpen, router, isModalOpen])

  return (
    <div className="flex h-screen items-center justify-center">
      {isModalOpen ? (
        <CreateWorkspaceModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      ) : (
        <Loader2 className="size-6 animate-spin" />
      )}
    </div>
  )
}
