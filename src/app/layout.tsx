import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ARt-Pick | Walk, Collect, Curate',
  description: 'Location-based Web AR Art Platform',
  manifest: '/manifest.json',
}

export function generateViewport() {
  return {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
