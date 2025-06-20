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

export function TeamSwitcher() {
  const workspaceId = useWorkspaceId()
  const { data, isPending } = useQuery(
    convexQuery(api.workspaces.getWorkspaceById, { id: workspaceId })
  )
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
        <DropdownMenuItem className="gap-2 p-2">
            <Avatar className="size-7">
              <AvatarImage src={data?.imageUrl} />
              <AvatarFallback>
                {data?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          {data?.name}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <Plus className="size-4" />
          </div>
          <div className="text-muted-foreground font-medium">Add workspace</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
