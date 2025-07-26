import { create } from "zustand"

import { Id } from "../../../../convex/_generated/dataModel"

type ProfilePannelStore = {
  memberProfileId: Id<"workspaceMember"> | null
  openProfile: (id: Id<"workspaceMember">) => void
  closeProfile: () => void
}

export const useProfilePannelStore = create<ProfilePannelStore>((set) => ({
  memberProfileId: null,
  openProfile: (id) => set({ memberProfileId: id }),
  closeProfile: () => set({ memberProfileId: null }),
}))
