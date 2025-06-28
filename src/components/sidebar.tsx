"use client"

import Link from "next/link"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { Home, LucideIcon, MessageSquare, TriangleAlert } from "lucide-react"

import { Hint } from "@/components/hint"
import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { ADMIN } from "@/constants"

import { api } from "../../convex/_generated/api"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
  isActive?: boolean
  disabled?: boolean
}

export function Sidebar() {
  const workspaceId = useWorkspaceId()

  const {
    data: workspace,
    isPending: isWorkspaceLoading,
    error: workspaceError,
  } = useQuery(convexQuery(api.workspaces.getWorkspaceById, { workspaceId }))

  const {
    data: user,
    isPending: isUserLoading,
    error: userError,
  } = useQuery(convexQuery(api.currentuser.user, {}))

  const {
    data: member,
    isPending: isMemberLoading,
    error: memberError,
  } = useQuery(convexQuery(api.members.currentMember, { workspaceId }))

  if (isWorkspaceLoading || isUserLoading || isMemberLoading) {
    return <SidebarSkeleton />
  }

  if (workspaceError || !workspace) {
    return (
      <div className="flex h-full w-16 flex-col items-center justify-center border-r p-4">
        <Hint label="Failed to load workspace" side="right" align="center">
          <Button size="icon" variant="destructive">
            <TriangleAlert className="h-full w-full" />
          </Button>
        </Hint>
      </div>
    )
  }

  if (userError || !user) {
    return (
      <div className="flex h-full w-16 flex-col items-center justify-center border-r p-4">
        <Hint label="Failed to load user" side="right" align="center">
          <Button size="icon" variant="destructive">
            <TriangleAlert className="h-full w-full" />
          </Button>
        </Hint>
      </div>
    )
  }

  if (memberError || !member) {
    return (
      <div className="flex h-full w-16 flex-col items-center justify-center border-r p-4">
        <Hint label="Failed to load member" side="right" align="center">
          <Button size="icon" variant="destructive">
            <TriangleAlert className="h-full w-full" />
          </Button>
        </Hint>
      </div>
    )
  }

  const isAdmin = member.role === ADMIN

  return (
    <div className="flex h-full w-16 flex-col items-center gap-y-4 border-r p-4">
      <WorkspaceSwitcher workspace={workspace} isAdmin={isAdmin} />
      <SidebarItem icon={Home} label="Home" href="/" isActive />
      <SidebarItem icon={MessageSquare} label="Messages" href="/messages" />
      <div className="mt-auto">
        <NavUser workspace={workspace} user={user} isAdmin={isAdmin} />
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
        variant={isActive ? "default" : "ghost"}
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
