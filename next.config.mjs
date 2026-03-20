/** @type {import("next").NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  output: 'standalone',
experimental: {
  turbopack: {
    root: '.',
  },
},
  transpilePackages: ['react-day-picker','swagger-ui-react', 'swagger-client', 'spec-api'],
  
  // បើនៅតែមិនបាត់ អាចថែមការកំណត់ខាងក្រោមនេះ (Optional)
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8082',
        pathname: '/**', 
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8082',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'asset.aditi.com.kh',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kemenpar.go.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui.idata.fit',
        pathname: '/**',
      },
    ]
  },
};

export default nextConfig;
