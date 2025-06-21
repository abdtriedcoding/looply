/**
 * Returns the origin of the current window.
 * @returns The origin of the current window.
 */
export const useOrigin = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  return origin
}
