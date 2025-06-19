import { getAuthUserId } from "@convex-dev/auth/server"

import { query } from "./_generated/server"

export const getWorkspaces = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return []
    }

    const workspaces = await ctx.db
      .query("workspace")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect()
    return workspaces
  },
})
