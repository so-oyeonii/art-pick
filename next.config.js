/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  
  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'seoyoung.swiftxr.site',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 환경 변수
  env: {
    NEXT_PUBLIC_APP_NAME: 'ARt-Pick',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Webpack 설정 (Mapbox GL JS 지원)
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = withPWA(nextConfig);
