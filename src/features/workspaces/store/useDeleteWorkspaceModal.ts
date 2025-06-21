import { create } from "zustand"

import { Id } from "../../../../convex/_generated/dataModel"

interface DeleteWorkspaceModalState {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  data: Id<"workspace"> | null
  setData: (data: Id<"workspace"> | null) => void
}

export const useDeleteWorkspaceModalStore = create<DeleteWorkspaceModalState>()(
  (set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
    data: null,
    setData: (data) => set({ data }),
  })
)
