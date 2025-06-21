import { create } from "zustand"

import { Doc } from "../../../../convex/_generated/dataModel"

interface EditWorkspaceModalState {
  editWorkspaceIsOpen: boolean
  setEditWorkspaceIsOpen: (open: boolean) => void
  editWorkspaceData: Doc<"workspace"> | null
  setEditWorkspaceData: (data: Doc<"workspace"> | null) => void
}

export const useEditWorkspaceModalStore = create<EditWorkspaceModalState>()(
  (set) => ({
    editWorkspaceIsOpen: false,
    setEditWorkspaceIsOpen: (open) => set({ editWorkspaceIsOpen: open }),
    editWorkspaceData: null,
    setEditWorkspaceData: (data) => set({ editWorkspaceData: data }),
  })
)
