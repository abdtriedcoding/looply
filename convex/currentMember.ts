import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { query } from "./_generated/server"

export const currentMember = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) {
      return null
    }

    return member
  },
})
