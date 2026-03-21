import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/homeowner/jobs", destination: "/dashboard/homeowner/jobs", permanent: false },
      { source: "/homeowner/jobs/new", destination: "/dashboard/homeowner/jobs/new", permanent: false },
      { source: "/homeowner/jobs/:id", destination: "/dashboard/homeowner/jobs/:id", permanent: false },
      { source: "/builder/leads", destination: "/dashboard/builder/jobs/feed", permanent: false },
      { source: "/builder/quotes", destination: "/dashboard/builder/quotes", permanent: false },
    ];
  },
};

export default nextConfig;
