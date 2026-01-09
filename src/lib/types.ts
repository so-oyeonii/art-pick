// 작품 아이템
export interface ArtItem {
  id: string
  title: string
  korTitle: string
  artist: string
  description: string
  arUrl: string       // SwiftXR URL
  icon: string        // 이모지
  color: string       // Tailwind 클래스 (예: 'bg-stone-100')
  accent: string      // Tailwind 텍스트 클래스 (예: 'text-stone-600')
  collectedAt?: string  // ISO 날짜 (수집 시 추가)
}

// 아트스팟
export interface ArtSpot {
  id: string
  title: string
  korTitle: string
  artist: string
  lat: number
  lng: number
  distance: string    // 예: '350m'
  description: string
  arUrl: string
  icon: string
  color: string
  accent: string
  isActive: boolean      // 실제 QR 코드 있음 (GPS 필수)
  requiresGPS: boolean   // GPS 위치 체크 필요
}

// 뷰 타입
export type ViewType = 'home' | 'map' | 'qr_scan' | 'collection' | 'myroom'

// 토스트 알림
export interface ToastNotification {
  title: string
  msg: string
}
