"use client"

import { ConvexQueryClient } from "@convex-dev/react-query"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { convex } from "./convex-client-provider"

// Create singletons at the module level
const convexQueryClient = new ConvexQueryClient(convex)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
})
convexQueryClient.connect(queryClient)

interface TanstackProviderProps {
  children: React.ReactNode
}

/**
 * Provides TanStack Query and Convex Query context to the app.
 *
 * NOTE: This provider should only be used once at the root of the app to avoid multiple client instances.
 */
export default function TanstackProvider({ children }: TanstackProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
