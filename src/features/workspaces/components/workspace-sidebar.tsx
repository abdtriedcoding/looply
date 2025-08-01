"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import {
  ChevronDown,
  Ellipsis,
  HashIcon,
  MessageSquare,
  Plus,
  TriangleAlert,
} from "lucide-react"

import { Hint } from "@/components/hint"
import { LoadingScreen } from "@/components/loading-screen"
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
import {
  ModalType,
  SidebarErrorFallbackProps,
  SidebarHeaderProps,
  SidebarSectionProps,
  WorkspaceChannelsProps,
} from "@/features/workspaces/types"

import { useChannelId } from "@/hooks/useChannelId"
import { usePersistedState } from "@/hooks/usePersistedState"
import { useWorkspaceId } from "@/hooks/useWorkspaceId"

import { CHAT_SIDEBAR_ITEMS, STORAGE_KEYS } from "@/constants"
import { isAdmin } from "@/lib/is-admin"

import { api } from "../../../../convex/_generated/api"
import { Doc } from "../../../../convex/_generated/dataModel"

export function WorkspaceSidebar() {
  const currentWorkspaceId = useWorkspaceId()
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedChannelForAction, setSelectedChannelForAction] =
    useState<Doc<"channel"> | null>(null)
  const [areChannelsExpanded, setAreChannelsExpanded] = usePersistedState(
    STORAGE_KEYS.CHANNELS_SECTION,
    true
  )
  const [areConversationsExpanded, setAreConversationsExpanded] =
    usePersistedState(STORAGE_KEYS.CONVERSATIONS_SECTION, true)

  const {
    data: workspaceChannels,
    isPending: isChannelsLoading,
    error: channelsLoadingError,
  } = useQuery(
    convexQuery(api.channels.getChannels, { workspaceId: currentWorkspaceId })
  )

  const {
    data: currentWorkspaceMember,
    isPending: isMembershipLoading,
    error: membershipLoadingError,
  } = useQuery(
    convexQuery(api.members.currentMember, { workspaceId: currentWorkspaceId })
  )

  const {
    data: workspaceConversations,
    isPending: isConversationsLoading,
    error: conversationsLoadingError,
  } = useQuery(
    convexQuery(api.conversations.getAllConversations, {
      workspaceId: currentWorkspaceId,
    })
  )

  const isLoading =
    isChannelsLoading || isMembershipLoading || isConversationsLoading
  const hasDataLoadingErrors =
    channelsLoadingError ||
    membershipLoadingError ||
    conversationsLoadingError ||
    !currentWorkspaceMember

  const handleToggleChannelsSection = () => {
    setAreChannelsExpanded((prev) => !prev)
  }

  const handleToggleConversationsSection = () => {
    setAreConversationsExpanded((prev) => !prev)
  }

  const handleSelectChannelForAction = (channel: Doc<"channel">) => {
    setSelectedChannelForAction(channel)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (hasDataLoadingErrors) {
    return <SidebarErrorFallback errorMessage="Failed to load workspace data" />
  }

  const isCurrentUserAdmin = isAdmin(currentWorkspaceMember)

  return (
    <aside className="flex h-full flex-col">
      <SidebarHeader
        isCurrentUserAdmin={isCurrentUserAdmin}
        onCreateChannel={() => setActiveModal("createChannel")}
        onCreateConversation={() => setActiveModal("createConversation")}
      />

      <SidebarNavigation />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <SidebarSection
          title="Channels"
          isExpanded={areChannelsExpanded}
          onToggle={handleToggleChannelsSection}
          showCreateButton={isCurrentUserAdmin}
          onCreateAction={() => setActiveModal("createChannel")}
          createButtonLabel="New Channel"
        >
          {areChannelsExpanded && (
            <WorkspaceChannelsList
              workspaceChannels={workspaceChannels}
              isCurrentUserAdmin={isCurrentUserAdmin}
              onSetSelectedChannel={handleSelectChannelForAction}
              onOpenEditModal={() => setActiveModal("editChannel")}
              onOpenDeleteModal={() => setActiveModal("deleteChannel")}
            />
          )}
        </SidebarSection>

        <SidebarSection
          title="Conversations"
          isExpanded={areConversationsExpanded}
          onToggle={handleToggleConversationsSection}
          showCreateButton={true}
          onCreateAction={() => setActiveModal("createConversation")}
          createButtonLabel="New Conversation"
        >
          {areConversationsExpanded && (
            <AllConversations conversations={workspaceConversations} />
          )}
        </SidebarSection>
      </div>

      <CreateChannelModal
        open={activeModal === "createChannel"}
        onOpenChange={(open) =>
          open ? setActiveModal("createChannel") : setActiveModal(null)
        }
      />
      {selectedChannelForAction && (
        <EditChannelModal
          open={activeModal === "editChannel"}
          onOpenChange={(open) =>
            open ? setActiveModal("editChannel") : setActiveModal(null)
          }
          channel={selectedChannelForAction}
        />
      )}
      {selectedChannelForAction && (
        <DeleteChannelModal
          open={activeModal === "deleteChannel"}
          onOpenChange={(open) =>
            open ? setActiveModal("deleteChannel") : setActiveModal(null)
          }
          channel={selectedChannelForAction}
        />
      )}
      <CreateConversationModal
        open={activeModal === "createConversation"}
        onOpenChange={(open) =>
          open ? setActiveModal("createConversation") : setActiveModal(null)
        }
      />
    </aside>
  )
}

function WorkspaceChannelsList({
  workspaceChannels,
  isCurrentUserAdmin,
  onSetSelectedChannel,
  onOpenEditModal,
  onOpenDeleteModal,
}: WorkspaceChannelsProps) {
  const router = useRouter()
  const currentWorkspaceId = useWorkspaceId()
  const currentChannelId = useChannelId()

  const handleChannelNavigation = (channelId: string) => {
    router.push(`/workspace/${currentWorkspaceId}/channel/${channelId}`)
  }

  const handleChannelAction = (
    channel: Doc<"channel">,
    action: "edit" | "delete"
  ) => {
    onSetSelectedChannel(channel)
    if (action === "edit") {
      onOpenEditModal()
    } else {
      onOpenDeleteModal()
    }
  }

  return (
    <ul className="space-y-1 px-2">
      {workspaceChannels?.map((channel) => (
        <li
          key={channel._id}
          className="group relative flex items-center justify-between gap-2"
        >
          <Button
            onClick={() => handleChannelNavigation(channel._id)}
            size="lg"
            variant={currentChannelId === channel._id ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <HashIcon className="text-muted-foreground size-4" />
            <span className="text-muted-foreground truncate font-medium">
              {channel.name}
            </span>
          </Button>

          {currentChannelId === channel._id && (
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
                {isCurrentUserAdmin && (
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

function SidebarErrorFallback({ errorMessage }: SidebarErrorFallbackProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <Button size="icon" variant="destructive">
        <TriangleAlert className="h-full w-full" />
      </Button>
      <span className="text-muted-foreground text-sm font-medium">
        {errorMessage}
      </span>
    </div>
  )
}

function SidebarHeader({
  isCurrentUserAdmin,
  onCreateChannel,
  onCreateConversation,
}: SidebarHeaderProps) {
  return (
    <div className="border-border flex h-[49px] items-center justify-between border-b px-4">
      <h1 className="text-xl font-semibold">Chat</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="iconSmall">
            <Plus className="text-muted-foreground size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="p-2">
          {isCurrentUserAdmin && (
            <DropdownMenuItem className="h-10" onClick={onCreateChannel}>
              <HashIcon className="text-muted-foreground size-4" />
              New Channel
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="h-10" onClick={onCreateConversation}>
            <MessageSquare className="text-muted-foreground size-4" />
            New Direct Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SidebarNavigation() {
  return (
    <nav className="border-border flex flex-col border-b p-2">
      {CHAT_SIDEBAR_ITEMS.map((navigationItem) => (
        <Button
          key={navigationItem.id}
          size="lg"
          className="w-full justify-start"
          variant="ghost"
        >
          <navigationItem.icon className="text-muted-foreground size-4" />
          <span className="text-muted-foreground text-base font-medium">
            {navigationItem.label}
          </span>
        </Button>
      ))}
    </nav>
  )
}

function SidebarSection({
  title,
  isExpanded,
  onToggle,
  showCreateButton,
  onCreateAction,
  createButtonLabel,
  children,
}: SidebarSectionProps) {
  return (
    <div>
      <div className="group flex items-center justify-between p-4 select-none">
        <div className="flex items-center gap-2">
          <Hint label={`Toggle ${title}`}>
            <Button variant="outline" size="iconSmall" onClick={onToggle}>
              <ChevronDown
                className={`text-muted-foreground size-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-0" : "-rotate-90"
                }`}
              />
            </Button>
          </Hint>
          <span className="text-muted-foreground text-sm font-semibold">
            {title}
          </span>
        </div>
        {showCreateButton && (
          <Hint label={createButtonLabel}>
            <Button variant="outline" size="iconSmall" onClick={onCreateAction}>
              <Plus className="text-muted-foreground size-4" />
            </Button>
          </Hint>
        )}
      </div>
      {children}
    </div>
  )
}
