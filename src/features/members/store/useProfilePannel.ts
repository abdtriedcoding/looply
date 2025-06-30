import { create } from "zustand"

import { Id } from "../../../../convex/_generated/dataModel"

type ProfilePannelStore = {
  memberProfileId: Id<"workspaceMember"> | null
  openMemberProfile: (id: Id<"workspaceMember">) => void
  closeMemberProfile: () => void
}

export const useProfilePannelStore = create<ProfilePannelStore>((set) => ({
  memberProfileId: null,
  openMemberProfile: (id) => set({ memberProfileId: id }),
  closeMemberProfile: () => set({ memberProfileId: null }),
}))
