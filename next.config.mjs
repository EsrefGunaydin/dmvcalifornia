/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.dmvcalifornia.us'], // Add your WordPress domain for image optimization
  },
  // Ensure trailing slashes match WordPress URLs if needed
  trailingSlash: false,
};

export default nextConfig;
