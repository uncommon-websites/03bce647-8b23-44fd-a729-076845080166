/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/zoom',
        destination: 'https://us05web.zoom.us/j/6192499270?pwd=aUtNb0hGZmt5eUUwS3BPdmNjOVhtZz09',
        permanent: true, // This is a 301 redirect
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
