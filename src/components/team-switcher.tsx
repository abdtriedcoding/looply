"use client"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import * as React from "react"

import { Loader2, Plus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"
import { api } from "../../convex/_generated/api"
import { useCreateWorkspaceModalStore } from "@/features/workspaces/store/useCreateWorkspaceModal"

export function TeamSwitcher() {
  const workspaceId = useWorkspaceId()
  const { data, isPending } = useQuery(
    convexQuery(api.workspaces.getWorkspaceById, { id: workspaceId })
  )

  const { setIsOpen } = useCreateWorkspaceModalStore()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            data?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        align="start"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Active Workspace
        </DropdownMenuLabel>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={data?.imageUrl} alt={data?.name} />
              <AvatarFallback className="rounded-lg">
                {data?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{data?.name}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 p-2"
          onClick={() => setIsOpen(true)}
        >
          <Plus />
          Add workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
