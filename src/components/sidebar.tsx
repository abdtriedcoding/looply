"use client"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

import { Home, LucideIcon, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { Hint } from "@/components/hint"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"

import { api } from "../../convex/_generated/api"

export function Sidebar() {
  const workspaceId = useWorkspaceId()

  const { data, isPending } = useQuery(
    convexQuery(api.workspaces.getWorkspaceById, { id: workspaceId })
  )

  return (
    <div className="flex h-full w-16 flex-col items-center gap-y-4 border-r p-4">
      <TeamSwitcher workspace={data ?? null} isPending={isPending} />
      <SidebarItem icon={Home} label="Home" href="/" isActive />
      <SidebarItem icon={MessageSquare} label="Messages" href="/messages" />
      <div className="mt-auto">
        <NavUser workspace={data ?? null} isWorkspaceLoading={isPending} />
      </div>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  disabled,
}: {
  icon: LucideIcon
  label: string
  href: string
  isActive?: boolean
  disabled?: boolean
}) {
  return (
    <Hint label={label} side="right" align="center">
      <Button
        size="icon"
        variant={isActive ? "default" : "ghost"}
        disabled={disabled}
        asChild
      >
        <Link href={href}>
          <Icon className="size-5" />
        </Link>
      </Button>
    </Hint>
  )
}
