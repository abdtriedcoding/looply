"use client"

import { useEffect, useState } from "react"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import {
  Bookmark,
  ChevronDown,
  Ellipsis,
  HashIcon,
  MessageSquare,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

import { useCreateChannelModalStore } from "@/features/channels/store/useCreateChannelModal"
import { useEditChannelModalStore } from "@/features/channels/store/useEditChannelModal"

import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { api } from "../../../../convex/_generated/api"

const CHAT_SIDEBAR_ITEMS = [
  {
    id: "saved",
    label: "Saved",
    icon: Bookmark,
    href: "/chat/saved",
  },
  {
    id: "channels",
    label: "Channels",
    icon: HashIcon,
    href: "/chat/channels",
  },
]

export const WorkspaceSidebar = () => {
  const [channelsOpen, setChannelsOpen] = useState(true)
  const { setCreateChannelIsOpen } = useCreateChannelModalStore()

  useEffect(() => {
    const stored = localStorage.getItem("sidebar_channels_open")
    if (stored !== null) {
      setChannelsOpen(stored === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar_channels_open", String(channelsOpen))
  }, [channelsOpen])

  return (
    <aside className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-2">
            <DropdownMenuItem
              className="h-10"
              onClick={() => setCreateChannelIsOpen(true)}
            >
              <HashIcon className="h-5 w-5" />
              <span>New Channel</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="h-10">
              <MessageSquare className="h-5 w-5" />
              <span>New Direct Chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="border-border flex flex-col border-b px-3 py-4">
        {CHAT_SIDEBAR_ITEMS.map((item) => (
          <Button
            key={item.id}
            className="hover:bg-muted/70 h-11 w-full justify-start gap-3 rounded-lg px-4 py-2 transition-colors"
            variant="ghost"
          >
            <item.icon className="text-muted-foreground h-5 w-5" />
            <span className="text-muted-foreground text-base font-medium">
              {item.label}
            </span>
          </Button>
        ))}
      </nav>

      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <div className="group mb-2 flex items-center justify-between px-1 select-none">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setChannelsOpen((open) => !open)}
              className="h-7 w-7"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${channelsOpen ? "rotate-0" : "-rotate-90"}`}
              />
            </Button>
            <span className="text-muted-foreground text-sm font-semibold">
              Channels
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCreateChannelIsOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {channelsOpen && <AllChannels />}
      </div>
    </aside>
  )
}

export function AllChannels() {
  const workspaceId = useWorkspaceId()
  const { setEditChannelIsOpen } = useEditChannelModalStore()

  const { data, isPending } = useQuery({
    ...convexQuery(api.channels.getChannels, { workspaceId }),
    initialData: [],
  })

  if (isPending) {
    return (
      <div className="space-y-2 px-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-8 w-3/4 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-muted-foreground px-1 py-2 text-sm">
        No channels yet.
      </div>
    )
  }

  return (
    <ul className="space-y-1">
      {data?.map((item) => (
        <li
          key={item._id}
          className="group relative flex items-center justify-between gap-2"
        >
          <Button
            variant="secondary"
            className="hover:bg-accent/80 h-10 w-full justify-start gap-3 rounded-lg px-3 py-2 transition-colors"
          >
            <HashIcon className="text-muted-foreground h-5 w-5" />
            <span className="text-muted-foreground truncate font-medium">
              {item.name}
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 p-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="rounded-lg shadow-lg"
              side="bottom"
              align="start"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setEditChannelIsOpen(true)}
              >
                Edit channel
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Delete channel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer">
                Leave channel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ))}
    </ul>
  )
}
