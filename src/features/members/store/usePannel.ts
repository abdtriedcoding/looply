// store/usePannelStore.ts
import { create } from "zustand"

import { Id } from "../../../../convex/_generated/dataModel"

type PannelStore = {
  memberProfileId: Id<"workspaceMember"> | null
  openProfile: (id: Id<"workspaceMember">) => void
  closeProfile: () => void
}

export const usePannelStore = create<PannelStore>((set) => ({
  memberProfileId: null,
  openProfile: (id) => set({ memberProfileId: id }),
  closeProfile: () => set({ memberProfileId: null }),
}))
