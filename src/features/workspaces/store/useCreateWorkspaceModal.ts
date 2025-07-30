import { create } from "zustand"

interface WorkspaceCreationModalState {
  isWorkspaceModalOpen: boolean
  openWorkspaceModal: () => void
  closeWorkspaceModal: () => void
}

export const useCreateWorkspaceModal = create<WorkspaceCreationModalState>()(
  (set) => ({
    isWorkspaceModalOpen: false,
    openWorkspaceModal: () => set({ isWorkspaceModalOpen: true }),
    closeWorkspaceModal: () => set({ isWorkspaceModalOpen: false }),
  })
)
