"use client"

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

import { useCreateWorkspaceModalStore } from "@/features/workspaces/store/useCreateWorkspaceModal"

import { Doc } from "../../convex/_generated/dataModel"

interface TeamSwitcherProps {
  workspace: Doc<"workspace"> | null
  isWorkspaceLoading: boolean
}

export function TeamSwitcher({
  workspace,
  isWorkspaceLoading,
}: TeamSwitcherProps) {
  const { setCreateWorkspaceIsOpen } = useCreateWorkspaceModalStore()
  const fallbackName = workspace?.name?.charAt(0).toUpperCase()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isWorkspaceLoading}>
        <Button size="icon" variant="secondary">
          {isWorkspaceLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            fallbackName
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
              <AvatarImage src={workspace?.imageUrl} alt={workspace?.name} />
              <AvatarFallback className="rounded-lg">
                {fallbackName}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{workspace?.name}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 p-2"
          onClick={() => setCreateWorkspaceIsOpen(true)}
        >
          <Plus />
          Add workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
