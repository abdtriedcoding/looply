import { create } from "zustand"

import { Id } from "../../../../convex/_generated/dataModel"

type ThreadStore = {
  messageId: Id<"message"> | null
  openThread: (id: Id<"message">) => void
  closeThread: () => void
}

export const useThreadStore = create<ThreadStore>((set) => ({
  messageId: null,
  openThread: (id) => set({ messageId: id }),
  closeThread: () => set({ messageId: null }),
}))
