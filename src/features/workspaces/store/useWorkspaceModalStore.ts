import { create } from "zustand"

interface WorkspaceModalState {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const useWorkspaceModalStore = create<WorkspaceModalState>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}))
