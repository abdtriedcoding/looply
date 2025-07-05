import { create } from "zustand"

interface DeleteChannelModalState {
  deleteChannelIsOpen: boolean
  setDeleteChannelIsOpen: (open: boolean) => void
}

export const useDeleteChannelModalStore = create<DeleteChannelModalState>()(
  (set) => ({
    deleteChannelIsOpen: false,
    setDeleteChannelIsOpen: (open) => set({ deleteChannelIsOpen: open }),
  })
)
