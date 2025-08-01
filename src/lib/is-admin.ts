import { ROLE } from "@/constants"

import { Doc } from "../../convex/_generated/dataModel"

export function isAdmin(member: Doc<"workspaceMember">) {
  return member.role === ROLE.ADMIN
}
