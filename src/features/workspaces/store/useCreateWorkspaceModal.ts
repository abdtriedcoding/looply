import { create } from "zustand"

interface CreateWorkspaceModalState {
  createWorkspaceIsOpen: boolean
  setCreateWorkspaceIsOpen: (open: boolean) => void
}

export const useCreateWorkspaceModalStore = create<CreateWorkspaceModalState>()(
  (set) => ({
    createWorkspaceIsOpen: false,
    setCreateWorkspaceIsOpen: (open) => set({ createWorkspaceIsOpen: open }),
  })
)
