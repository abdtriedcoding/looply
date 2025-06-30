import { z } from "zod"

import { Id } from "../../../../convex/_generated/dataModel"

// --- Atomic field schemas ---
export const channelNameSchema = z.string().min(2).max(50)
export const channelDescriptionSchema = z.string().optional()
export const workspaceIdSchema = z.custom<Id<"workspace">>()
export const channelIdSchema = z.custom<Id<"channel">>()

// --- Frontend form schemas ---
export const createChannelFormSchema = z.object({
  name: channelNameSchema,
  description: channelDescriptionSchema,
})

export const editChannelFormSchema = z.object({
  name: channelNameSchema,
  description: channelDescriptionSchema,
})

// --- Backend args schemas (for API/mutations) ---
export const createChannelArgsSchema = createChannelFormSchema.extend({
  workspaceId: workspaceIdSchema,
})

export const updateChannelArgsSchema = editChannelFormSchema.extend({
  workspaceId: workspaceIdSchema,
  channelId: channelIdSchema,
})

export const deleteChannelArgsSchema = z.object({
  workspaceId: workspaceIdSchema,
  channelId: channelIdSchema,
})

// --- Types for type safety ---
export type CreateChannelForm = z.infer<typeof createChannelFormSchema>
export type EditChannelForm = z.infer<typeof editChannelFormSchema>
export type CreateChannelArgs = z.infer<typeof createChannelArgsSchema>
export type UpdateChannelArgs = z.infer<typeof updateChannelArgsSchema>
export type DeleteChannelArgs = z.infer<typeof deleteChannelArgsSchema>
