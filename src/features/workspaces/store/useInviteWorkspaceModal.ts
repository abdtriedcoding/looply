import { create } from "zustand"

interface InviteWorkspaceModalState {
  inviteWorkspaceIsOpen: boolean
  setInviteWorkspaceIsOpen: (open: boolean) => void
}

export const useInviteWorkspaceModalStore = create<InviteWorkspaceModalState>()(
  (set) => ({
    inviteWorkspaceIsOpen: false,
    setInviteWorkspaceIsOpen: (open) => set({ inviteWorkspaceIsOpen: open }),
  })
)
