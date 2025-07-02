import { create } from "zustand"

import { Doc } from "../../../../convex/_generated/dataModel"

interface EditWorkspaceModalState {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  data: Doc<"workspace"> | null
  setData: (data: Doc<"workspace"> | null) => void
}

export const useEditWorkspaceModalStore = create<EditWorkspaceModalState>()(
  (set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
    data: null,
    setData: (data: Doc<"workspace"> | null) => set({ data }),
  })
)
