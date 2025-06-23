import { create } from "zustand"

interface EditChannelModalState {
  editChannelIsOpen: boolean
  setEditChannelIsOpen: (open: boolean) => void
}

export const useEditChannelModalStore = create<EditChannelModalState>()(
  (set) => ({
    editChannelIsOpen: false,
    setEditChannelIsOpen: (open) => set({ editChannelIsOpen: open }),
  })
)
