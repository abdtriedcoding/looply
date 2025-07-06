import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/login",
  "/magic-code",
  "/password",
  "/reset-password",
  "/sign-up",
])

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    if (!isPublicRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/login")
    }
    if (isPublicRoute(request) && (await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/")
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } } // 30 days
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
