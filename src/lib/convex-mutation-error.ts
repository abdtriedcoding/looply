import { ConvexError } from "convex/values";

export function handleConvexMutationError(err: unknown, fallback = "Something went wrong") {
    if (err instanceof ConvexError) {
        return typeof err.data === "string" ? err.data : fallback;
    }
    return fallback;
}