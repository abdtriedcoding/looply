import { z } from "zod"

import { Id } from "../../../../convex/_generated/dataModel"

// --- Atomic field schemas ---
export const workspaceNameSchema = z.string().min(2).max(50)
export const workspaceImageUrlSchema = z.string().optional()
export const workspaceIdSchema = z.custom<Id<"workspace">>()

// --- Frontend form schemas ---
export const createWorkspaceFormSchema = z.object({
  name: workspaceNameSchema,
})

export const editWorkspaceFormSchema = z.object({
  name: workspaceNameSchema,
  imageUrl: workspaceImageUrlSchema,
})

// --- Backend args schemas (for API/mutations) ---
export const createWorkspaceArgsSchema = createWorkspaceFormSchema

export const updateWorkspaceArgsSchema = editWorkspaceFormSchema.extend({
  workspaceId: workspaceIdSchema,
})

export const deleteWorkspaceArgsSchema = z.object({
  workspaceId: workspaceIdSchema,
})

// --- Types for type safety ---
export type CreateWorkspaceForm = z.infer<typeof createWorkspaceFormSchema>
export type EditWorkspaceForm = z.infer<typeof editWorkspaceFormSchema>
export type CreateWorkspaceArgs = z.infer<typeof createWorkspaceArgsSchema>
export type UpdateWorkspaceArgs = z.infer<typeof updateWorkspaceArgsSchema>
export type DeleteWorkspaceArgs = z.infer<typeof deleteWorkspaceArgsSchema>
