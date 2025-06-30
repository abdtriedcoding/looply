"use client"

import Link from "next/link"

import { Home, LucideIcon, MessageSquare } from "lucide-react"

import { TeamSwitcher } from "@/components/team-switcher"

import { Hint } from "./hint"
import { Button } from "./ui/button"

export function Sidebar() {
  return (
    <div className="flex h-full w-16 flex-col items-center gap-y-4 border-r p-4">
      <TeamSwitcher />
      <SidebarItem icon={Home} label="Home" href="/" isActive />
      <SidebarItem icon={MessageSquare} label="Messages" href="/messages" />
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
