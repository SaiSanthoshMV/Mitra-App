
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase storage and other hosts you use for images
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' } // add any others you use
    ],
  },
  // Optional: extra security headers via vercel.json as well
};

module.exports = nextConfig;