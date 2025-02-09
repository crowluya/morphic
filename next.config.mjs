/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // 启用实验性功能以支持 standalone 输出
    serverActions: true,
  }
};

export default nextConfig;
