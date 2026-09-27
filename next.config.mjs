/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow <Image> to load photos from your Supabase Storage project.
    // Replace with your actual project ref once you have it.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
