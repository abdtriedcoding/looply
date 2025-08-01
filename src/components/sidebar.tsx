"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { LucideIcon, TriangleAlert } from "lucide-react"

import { Hint } from "@/components/hint"
import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { SIDEBAR_ITEMS } from "@/constants"
import { isAdmin } from "@/lib/is-admin"

import { api } from "../../convex/_generated/api"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
  isActive?: boolean
  disabled?: boolean
}

interface SidebarErrorFallbackProps {
  errorMessage: string
}

export function Sidebar() {
  const pathname = usePathname()
  const currentWorkspaceId = useWorkspaceId()

  const {
    data: currentWorkspace,
    isPending: isWorkspaceLoading,
    error: workspaceLoadingError,
  } = useQuery(
    convexQuery(api.workspaces.getWorkspaceById, {
      workspaceId: currentWorkspaceId,
    })
  )

  const {
    data: currentUser,
    isPending: isUserLoading,
    error: userLoadingError,
  } = useQuery(convexQuery(api.currentuser.user, {}))

  const {
    data: currentMember,
    isPending: isMemberLoading,
    error: memberLoadingError,
  } = useQuery(
    convexQuery(api.members.currentMember, { workspaceId: currentWorkspaceId })
  )

  const isLoading = isWorkspaceLoading || isUserLoading || isMemberLoading
  const hasLoadingErrors =
    workspaceLoadingError || userLoadingError || memberLoadingError

  if (isLoading) return <SidebarSkeleton />

  if (hasLoadingErrors)
    return <SidebarErrorFallback errorMessage="Failed to load sidebar data" />

  if (!currentWorkspace)
    return <SidebarErrorFallback errorMessage="Workspace not found" />

  if (!currentUser)
    return <SidebarErrorFallback errorMessage="User not found" />

  if (!currentMember)
    return <SidebarErrorFallback errorMessage="Member access denied" />

  const isCurrentUserAdmin = isAdmin(currentMember)

  return (
    <div className="flex h-full w-16 flex-col items-center gap-y-4 border-r p-4">
      <WorkspaceSwitcher
        workspace={currentWorkspace}
        isAdmin={isCurrentUserAdmin}
      />

      {SIDEBAR_ITEMS.map((navigationItem) => (
        <SidebarItem
          key={navigationItem.href}
          icon={navigationItem.icon}
          label={navigationItem.label}
          href={navigationItem.href}
          isActive={pathname === navigationItem.href}
        />
      ))}

      <div className="mt-auto">
        <NavUser
          workspace={currentWorkspace}
          user={currentUser}
          isAdmin={isCurrentUserAdmin}
        />
      </div>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive = false,
  disabled = false,
}: SidebarItemProps) {
  return (
    <Hint label={label} side="right" align="center">
      <Button
        size="icon"
        variant={isActive ? "default" : "secondary"}
        disabled={disabled}
        asChild
      >
        <Link href={href}>
          <Icon className="text-muted-foreground size-4" />
        </Link>
      </Button>
    </Hint>
  )
}

function SidebarSkeleton() {
  return (
    <div className="flex h-full w-16 flex-col items-center gap-y-4 border-r p-4">
      <Button size="icon" variant="secondary">
        <Skeleton className="h-full w-full animate-pulse" />
      </Button>
      <Button size="icon" variant="secondary">
        <Skeleton className="h-full w-full animate-pulse" />
      </Button>
      <Button size="icon" variant="secondary">
        <Skeleton className="h-full w-full animate-pulse" />
      </Button>
      <Button size="icon" variant="secondary">
        <Skeleton className="h-full w-full animate-pulse" />
      </Button>
      <Button size="icon" variant="secondary">
        <Skeleton className="h-full w-full animate-pulse" />
      </Button>
      <div className="mt-auto">
        <Button size="icon" variant="secondary">
          <Skeleton className="h-full w-full animate-pulse" />
        </Button>
      </div>
    </div>
  )
}

function SidebarErrorFallback({ errorMessage }: SidebarErrorFallbackProps) {
  return (
    <div className="flex h-full w-16 flex-col items-center justify-center border-r p-4">
      <Hint label={errorMessage} side="right" align="center">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="size-4 text-rose-400" />
        </Button>
      </Hint>
    </div>
  )
}
