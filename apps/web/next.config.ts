import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  allowedDevOrigins: ["news.morgans.cc.cd"],
};

export default nextConfig;
