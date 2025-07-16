import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "compassionate-gerbil-461.convex.cloud",
        port: "",
        pathname: "/api/storage/**",
      },
    ],
  },
}

export default nextConfig
