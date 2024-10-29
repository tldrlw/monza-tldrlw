/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "monza-tldrlw-images.s3.amazonaws.com",
        pathname: "/insights/**",
      },
      {
        protocol: "https",
        hostname: "monza-tldrlw-images.s3.amazonaws.com",
        pathname: "/logos/**",
      },
    ],
  },
  logging: {
    fetches: {
      hmrRefreshes: true,
      fullUrl: true,
    },
  },
};

export default nextConfig;
