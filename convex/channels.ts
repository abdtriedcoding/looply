import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError, v } from "convex/values"

import {
  createChannelArgsSchema,
  deleteChannelArgsSchema,
  updateChannelArgsSchema,
} from "@/features/channels/validation/channelSchemas"

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

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) {
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
    const result = createChannelArgsSchema.safeParse(args)
    if (!result.success) throw new ConvexError("Invalid arguments")

    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) throw new ConvexError("Unauthorized")

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) throw new ConvexError("Workspace not found")

    const channel = await ctx.db.insert("channel", {
      workspaceId: args.workspaceId,
      name: args.name,
      description: args.description,
    })
    return channel
  },
})

export const getChannelById = query({
  args: {
    workspaceId: v.id("workspace"),
    channelId: v.id("channel"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) {
      return null
    }

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) return null

    const channel = await ctx.db.get(args.channelId)
    return channel
  },
})

export const updateChannel = mutation({
  args: {
    workspaceId: v.id("workspace"),
    channelId: v.id("channel"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = updateChannelArgsSchema.safeParse(args)
    if (!result.success) throw new ConvexError("Invalid arguments")

    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) throw new ConvexError("Unauthorized")

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) throw new ConvexError("Workspace not found")

    const channel = await ctx.db.get(args.channelId)
    if (!channel) throw new ConvexError("Channel not found")

    await ctx.db.patch(args.channelId, {
      name: args.name,
      description: args.description,
    })
    return args.channelId
  },
})

export const deleteChannel = mutation({
  args: {
    workspaceId: v.id("workspace"),
    channelId: v.id("channel"),
  },
  handler: async (ctx, args) => {
    const result = deleteChannelArgsSchema.safeParse(args)
    if (!result.success) throw new ConvexError("Invalid arguments")

    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError("Not authenticated")

    const member = await ctx.db
      .query("workspaceMember")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique()
    if (!member) throw new ConvexError("Unauthorized")

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) throw new ConvexError("Workspace not found")

    const channel = await ctx.db.get(args.channelId)
    if (!channel) throw new ConvexError("Channel not found")

    await ctx.db.delete(args.channelId)
    return args.channelId
  },
})
