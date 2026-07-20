import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthings.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "sundomain",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
















// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images:{
//     domains:[
//       'uploadthings.com',
//       'utfs.io',
//       'img.clerk.com',
//       'sundomain',
//       'files.stripe.com'
//     ],
//   },
//   reactStrictMode : false,
// };

// export default nextConfig;
