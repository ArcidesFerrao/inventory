import type { NextConfig } from "next";
import  withPWA  from "next-pwa";
import createNextIntlPlugin from 'next-intl/plugin'

// const withNextIntl = createNextIntlPlugin("./src/i18n.ts")
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {},
  },
};

export default withNextIntl(
  withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
})(nextConfig));

