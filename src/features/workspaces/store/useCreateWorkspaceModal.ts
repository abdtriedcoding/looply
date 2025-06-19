import { create } from "zustand"

interface CreateWorkspaceModalState {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const useCreateWorkspaceModalStore = create<CreateWorkspaceModalState>()(
  (set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
  })
)
