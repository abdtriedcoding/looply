import { Doc } from "../../../convex/_generated/dataModel"

export type WorkspaceModalType =
  | "createWorkspace"
  | "editWorkspace"
  | "deleteWorkspace"
  | "inviteWorkspace"

export type SidebarErrorFallbackProps = {
  errorMessage: string
}

export type SidebarHeaderProps = {
  isCurrentUserAdmin: boolean
  onCreateChannel: () => void
  onCreateConversation: () => void
}

export type SidebarSectionProps = {
  title: string
  isExpanded: boolean
  onToggle: () => void
  showCreateButton: boolean
  onCreateAction: () => void
  createButtonLabel: string
  children: React.ReactNode
}

export type WorkspaceChannelsProps = {
  workspaceChannels: Doc<"channel">[]
  isCurrentUserAdmin: boolean
  onSetSelectedChannel: (channel: Doc<"channel">) => void
  onOpenEditModal: () => void
  onOpenDeleteModal: () => void
}
