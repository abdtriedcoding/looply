"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

/**
 * Provides theme context (light/dark/system) to the app using next-themes.
 * Should be used at the root of the app.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
