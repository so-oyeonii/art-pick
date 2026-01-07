import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ARt-Pick - 일상의 틈을 예술로 채우다',
  description: 'QR 기반 Web AR 도슨트 플랫폼. 특별한 장소에서 숨겨진 예술 작품을 발견하고 AR로 감상하세요.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ARt-Pick',
  },
};

export function generateViewport() {
  return {
    themeColor: '#6366F1',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="w-full min-h-screen bg-black">
          {children}
        </div>
      </body>
    </html>
  );
}
