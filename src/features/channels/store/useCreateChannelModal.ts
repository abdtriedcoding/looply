import { create } from "zustand"

interface CreateChannelModalState {
  createChannelIsOpen: boolean
  setCreateChannelIsOpen: (open: boolean) => void
}

export const useCreateChannelModalStore = create<CreateChannelModalState>()(
  (set) => ({
    createChannelIsOpen: false,
    setCreateChannelIsOpen: (open) => set({ createChannelIsOpen: open }),
  })
)
