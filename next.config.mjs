/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // 启用实验性功能以支持 standalone 输出
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  // 增加静态页面生成超时时间
  staticPageGenerationTimeout: 120,
  // 禁用一些静态页面生成
  generateStaticParams: () => {
    return []
  },
  env: {
    USE_LOCAL_REDIS: process.env.USE_LOCAL_REDIS,
    LOCAL_REDIS_URL: process.env.LOCAL_REDIS_URL || 'redis://redis:6379'
  }
};

export default nextConfig;
