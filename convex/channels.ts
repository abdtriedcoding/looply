import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"

import { mutation, query } from "./_generated/server"

export const getChannels = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return []
    }

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) {
      return []
    }

    const channels = await ctx.db
      .query("channel")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .order("desc")
      .collect()
    return channels
  },
})

export const createChannel = mutation({
  args: {
    workspaceId: v.id("workspace"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return { error: "Not authenticated" }

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) return { error: "Workspace not found" }

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) {
      return { error: "Unauthorized" }
    }

    const channel = await ctx.db.insert("channel", {
      workspaceId: args.workspaceId,
      name: args.name,
      description: args.description,
    })
    return channel
  },
})
