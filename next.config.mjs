/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.dmvcalifornia.us'], // Add your WordPress domain for image optimization
  },
  // Ensure trailing slashes match WordPress URLs if needed
  trailingSlash: false,
  // Increase page data size limit for large quiz JSON files
  experimental: {
    largePageDataBytes: 512 * 1000, // 512KB limit (default is 128KB)
  },
};

export default nextConfig;
