"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { Loader2 } from "lucide-react"

import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces"
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useCreateWorkspaceModalStore } from "@/features/workspaces/store/useCreateWorkspaceModal"

export default function Home() {
  const router = useRouter()

  const { data: workspaces, isLoading } = useGetWorkspaces()
  const workspaceId = workspaces?.[0]?._id

  const { isOpen, setIsOpen } = useCreateWorkspaceModalStore()

  useEffect(() => {
    if (isLoading) return

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!isOpen) {
      setIsOpen(true)
    }
  }, [isLoading, workspaceId, setIsOpen, router, isOpen])

  return (
    <div className="flex h-screen items-center justify-center">
      {isOpen ? (
        <CreateWorkspaceModal isOpen={isOpen} onOpenChange={setIsOpen} />
      ) : (
        <Loader2 className="size-6 animate-spin" />
      )}
    </div>
  )
}
