"use client"

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs"

import { ConvexReactClient } from "convex/react"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
if (!convexUrl) {
  console.warn(
    "[ConvexClientProvider] NEXT_PUBLIC_CONVEX_URL is not set. Convex client will not connect."
  )
}
const convex = new ConvexReactClient(convexUrl!)

interface ConvexClientProviderProps {
  children: React.ReactNode
}

/**
 * Provides Convex Auth and React client context to the app.
 *
 * NOTE: This provider should only be used once at the root of the app.
 * The exported `convex` client is a singleton for use in other modules.
 */
export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  )
}

/**
 * Singleton Convex client for use in hooks and other modules.
 */
export { convex }
