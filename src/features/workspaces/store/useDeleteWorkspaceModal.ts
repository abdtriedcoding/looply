import { create } from "zustand"

import { Id } from "../../../../convex/_generated/dataModel"

interface DeleteWorkspaceModalState {
  deleteWorkspaceIsOpen: boolean
  setDeleteWorkspaceIsOpen: (open: boolean) => void
  deleteWorkspaceData: Id<"workspace"> | null
  setDeleteWorkspaceData: (data: Id<"workspace"> | null) => void
}

export const useDeleteWorkspaceModalStore = create<DeleteWorkspaceModalState>()(
  (set) => ({
    deleteWorkspaceIsOpen: false,
    setDeleteWorkspaceIsOpen: (open) => set({ deleteWorkspaceIsOpen: open }),
    deleteWorkspaceData: null,
    setDeleteWorkspaceData: (data) => set({ deleteWorkspaceData: data }),
  })
)
