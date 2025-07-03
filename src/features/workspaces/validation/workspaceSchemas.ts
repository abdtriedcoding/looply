import { z } from "zod"

import { Id } from "../../../../convex/_generated/dataModel"

const nameSchema = z.string().min(2).max(50)
const imageUrlSchema = z.string().optional()

// --- Frontend form schemas ---
export const createWorkspaceFormSchema = z.object({ name: nameSchema })

export const editWorkspaceFormSchema = z.object({
  name: nameSchema,
  imageUrl: imageUrlSchema,
})

// --- Backend args schemas ---
export const createWorkspaceArgsSchema = createWorkspaceFormSchema

export const updateWorkspaceArgsSchema = z.object({
  id: z.custom<Id<"workspace">>(),
  name: nameSchema,
  imageUrl: imageUrlSchema,
})

export const deleteWorkspaceArgsSchema = z.object({
  id: z.custom<Id<"workspace">>(),
})
