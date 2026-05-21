import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /coaching used to be the main marketing page; emails and external links
      // still point here, so 308-redirect to the new root.
      {
        source: "/coaching",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
