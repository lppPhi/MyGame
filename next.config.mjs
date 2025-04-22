/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true, // nếu bạn dùng <Image />
  },
  distDir: 'out', // thư mục build ra HTML tĩnh
  basePath: '/MyGame', // TÊN repo GitHub của bạn
  assetPrefix: '/MyGame/', // giúp load đúng asset tĩnh
};

export default nextConfig;
