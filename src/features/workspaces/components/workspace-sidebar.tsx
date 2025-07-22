"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import {
  Bookmark,
  ChevronDown,
  Ellipsis,
  HashIcon,
  Loader2,
  MessageSquare,
  Plus,
  TriangleAlert,
} from "lucide-react"

import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { CreateChannelModal } from "@/features/channels/components/create-channel-modal"
import { DeleteChannelModal } from "@/features/channels/components/delete-channel-modal"
import { EditChannelModal } from "@/features/channels/components/edit-channel-modal"
import { AllConversations } from "@/features/conversation/components/all-conversations"
import { CreateConversationModal } from "@/features/conversation/components/create-conversation-modal"

import { useChannelId } from "@/hooks/useChannelId"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { ADMIN } from "@/constants"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

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
  const workspaceId = useWorkspaceId()

  const [channelsOpen, setChannelsOpen] = useState(true)
  const [conversationsOpen, setConversationsOpen] = useState(true)
  const [isCreateChannelOpen, setCreateChannelOpen] = useState(false)
  const [isEditChannelOpen, setEditChannelOpen] = useState(false)
  const [isDeleteChannelOpen, setDeleteChannelOpen] = useState(false)
  const [isDirectChatModalOpen, setIsDirectChatModalOpen] = useState(false)

  const [selectedChannel, setSelectedChannel] = useState<Doc<"channel"> | null>(
    null
  )

  const {
    data: channels,
    isPending: isChannelsPending,
    error: channelsError,
  } = useQuery(convexQuery(api.channels.getChannels, { workspaceId }))

  const {
    data: member,
    isPending: isMemberLoading,
    error: memberError,
  } = useQuery(convexQuery(api.members.currentMember, { workspaceId }))

  const {
    data: conversations,
    isPending: isConversationsPending,
    error: conversationsError,
  } = useQuery(
    convexQuery(api.conversations.getAllConversations, { workspaceId })
  )

  useEffect(() => {
    const stored = localStorage.getItem("sidebar_channels_open")
    if (stored !== null) {
      setChannelsOpen(stored === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sidebar_channels_open", String(channelsOpen))
  }, [channelsOpen])

  useEffect(() => {
    const stored = localStorage.getItem("sidebar_conversations_open")
    if (stored !== null) {
      setConversationsOpen(stored === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "sidebar_conversations_open",
      String(conversationsOpen)
    )
  }, [conversationsOpen])

  if (isChannelsPending || isMemberLoading || isConversationsPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
      </div>
    )
  }

  if (channelsError || !channels) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="h-full w-full" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          Failed to load channels
        </span>
      </div>
    )
  }

  if (memberError || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="h-full w-full" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          Failed to load member
        </span>
      </div>
    )
  }

  if (conversationsError || !conversations) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <Button size="icon" variant="destructive">
          <TriangleAlert className="h-full w-full" />
        </Button>
        <span className="text-muted-foreground text-sm font-medium">
          Failed to load conversations
        </span>
      </div>
    )
  }

  const isAdmin = member.role === ADMIN

  return (
    <aside className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b p-4">
        <h1 className="text-2xl font-bold">Chat</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="iconSmall">
              <Plus className="text-muted-foreground size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-2">
            {isAdmin && (
              <DropdownMenuItem
                className="h-10"
                onClick={() => setCreateChannelOpen(true)}
              >
                <HashIcon className="text-muted-foreground size-4" />
                New Channel
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="h-10"
              onClick={() => setIsDirectChatModalOpen(true)}
            >
              <MessageSquare className="text-muted-foreground size-4" />
              New Direct Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="border-border flex flex-col border-b p-2">
        {CHAT_SIDEBAR_ITEMS.map((item) => (
          <Button
            key={item.id}
            size="lg"
            className="w-full justify-start"
            variant="ghost"
          >
            <item.icon className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-base font-medium">
              {item.label}
            </span>
          </Button>
        ))}
      </nav>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="group flex items-center justify-between p-4 select-none">
          <div className="flex items-center gap-2">
            <Hint label="Toggle Channels">
              <Button
                variant="outline"
                size="iconSmall"
                onClick={() => setChannelsOpen((open) => !open)}
              >
                <ChevronDown
                  className={`text-muted-foreground size-4 transition-transform duration-200 ${channelsOpen ? "rotate-0" : "-rotate-90"}`}
                />
              </Button>
            </Hint>
            <span className="text-muted-foreground text-sm font-semibold">
              Channels
            </span>
          </div>
          {isAdmin && (
            <Hint label="New Channel">
              <Button
                variant="outline"
                size="iconSmall"
                onClick={() => setCreateChannelOpen(true)}
              >
                <Plus className="text-muted-foreground size-4" />
              </Button>
            </Hint>
          )}
        </div>
        {channelsOpen && (
          <AllChannels
            channels={channels}
            setEditChannelOpen={setEditChannelOpen}
            setDeleteChannelOpen={setDeleteChannelOpen}
            setSelectedChannel={setSelectedChannel}
            isAdmin={isAdmin}
          />
        )}

        <div className="group flex items-center justify-between p-4 select-none">
          <div className="flex items-center gap-2">
            <Hint label="Toggle Conversations">
              <Button
                variant="outline"
                size="iconSmall"
                onClick={() => setConversationsOpen((open) => !open)}
              >
                <ChevronDown
                  className={`text-muted-foreground size-4 transition-transform duration-200 ${conversationsOpen ? "rotate-0" : "-rotate-90"}`}
                />
              </Button>
            </Hint>
            <span className="text-muted-foreground text-sm font-semibold">
              Conversations
            </span>
          </div>
          <Hint label="New Conversation">
            <Button
              variant="outline"
              size="iconSmall"
              onClick={() => setIsDirectChatModalOpen(true)}
            >
              <Plus className="text-muted-foreground size-4" />
            </Button>
          </Hint>
        </div>
        {conversationsOpen && (
          <AllConversations conversations={conversations} />
        )}
      </div>
      <CreateChannelModal
        open={isCreateChannelOpen}
        onOpenChange={setCreateChannelOpen}
      />
      {selectedChannel && (
        <EditChannelModal
          open={isEditChannelOpen}
          onOpenChange={setEditChannelOpen}
          channel={selectedChannel}
        />
      )}
      {selectedChannel && (
        <DeleteChannelModal
          open={isDeleteChannelOpen}
          onOpenChange={setDeleteChannelOpen}
          channel={selectedChannel}
        />
      )}
      <CreateConversationModal
        open={isDirectChatModalOpen}
        onOpenChange={setIsDirectChatModalOpen}
      />
    </aside>
  )
}

export function AllChannels({
  channels,
  setEditChannelOpen,
  setDeleteChannelOpen,
  setSelectedChannel,
  isAdmin,
}: {
  channels: Doc<"channel">[]
  setEditChannelOpen: (open: boolean) => void
  setDeleteChannelOpen: (open: boolean) => void
  setSelectedChannel: (channel: Doc<"channel">) => void
  isAdmin: boolean
}) {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const handleChannelAction = (
    channel: Doc<"channel">,
    action: "edit" | "delete"
  ) => {
    setSelectedChannel(channel)
    if (action === "edit") {
      setEditChannelOpen(true)
    } else {
      setDeleteChannelOpen(true)
    }
  }

  return (
    <ul className="space-y-1 px-2">
      {channels?.map((channel) => (
        <li
          key={channel._id}
          className="group relative flex items-center justify-between gap-2"
        >
          <Button
            onClick={() =>
              router.push(`/workbench/${workspaceId}/channel/${channel._id}`)
            }
            size="lg"
            variant={channelId === channel._id ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <HashIcon className="text-muted-foreground size-4" />
            <span className="text-muted-foreground truncate font-medium">
              {channel.name}
            </span>
          </Button>

          {/* Only show dropdown if not on this channel's page */}
          {channelId !== channel._id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="iconSmall"
                  className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
                >
                  <Ellipsis className="text-muted-foreground size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="rounded-lg shadow-lg"
                side="bottom"
                align="start"
              >
                {isAdmin && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleChannelAction(channel, "edit")}
                    >
                      Edit channel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleChannelAction(channel, "delete")}
                    >
                      Delete channel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer">
                  Leave channel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </li>
      ))}
    </ul>
  )
}
