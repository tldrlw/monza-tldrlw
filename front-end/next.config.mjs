/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "monza-tldrlw-images.s3.us-east-1.amazonaws.com",
        pathname: "/insights/**",
      },
    ],
  },
};

export default nextConfig;
