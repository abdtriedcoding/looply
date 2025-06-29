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
  const workbenchId = workspaces?.[0]?._id

  const { isOpen, setIsOpen } = useCreateWorkspaceModalStore()

  useEffect(() => {
    if (isLoading) return

    if (workbenchId) {
      router.replace(`/workbench/${workbenchId}`)
    } else if (!isOpen) {
      setIsOpen(true)
    }
  }, [isLoading, workbenchId, setIsOpen, router, isOpen])

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
