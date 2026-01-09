# 📁 ARt-Pick MVP - 파일 구조 가이드

> 각 파일의 역할과 내용 설명

## 🌳 전체 구조

```
art-pick-mvp/
├── 📁 app/
│   ├── layout.tsx           # 루트 레이아웃 (헤더, 메타데이터)
│   ├── page.tsx             # 메인 앱 (전체 UI)
│   └── globals.css          # 글로벌 스타일
│
├── 📁 lib/
│   ├── storage.ts           # localStorage 헬퍼
│   ├── types.ts             # TypeScript 타입
│   └── data.ts              # 아트스팟 데이터
│
├── 📁 public/
│   ├── manifest.json        # PWA manifest
│   └── 📁 icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── package.json             # 의존성
├── next.config.js           # Next.js 설정
├── tailwind.config.js       # Tailwind 설정
├── tsconfig.json            # TypeScript 설정
└── README.md                # 프로젝트 설명
```

---

## 📄 파일별 상세

### 1. `app/layout.tsx`

**역할**: 앱 전체 레이아웃 및 메타데이터

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ARt-Pick | Walk, Collect, Curate',
  description: 'Location-based Web AR Art Platform',
  manifest: '/manifest.json',
  themeColor: '#000000',
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
```

**중요 포인트**:
- PWA를 위한 `manifest.json` 링크
- 한국어 설정 (`lang="ko"`)
- Tailwind의 `antialiased` 클래스

---

### 2. `app/page.tsx` ⭐ (가장 중요!)

**역할**: 전체 앱 로직과 UI

**구조**:
```typescript
'use client'

// === Imports ===
import { useState, useEffect } from 'react'
import { lucide-react 아이콘들 }
import { ART_SPOTS } from '@/lib/data'
import { saveCollection, loadCollection } from '@/lib/storage'

// === Types ===
interface ArtItem { ... }

// === Main App Component ===
export default function App() {
  // State Management
  const [currentView, setCurrentView] = useState('home')
  const [inventory, setInventory] = useState<ArtItem[]>([])
  const [targetSpot, setTargetSpot] = useState(null)
  
  // localStorage 동기화
  useEffect(() => {
    const saved = loadCollection()
    if (saved) setInventory(saved)
  }, [])
  
  useEffect(() => {
    saveCollection(inventory)
  }, [inventory])
  
  // Handlers
  const handleStartNavigation = (spot) => { ... }
  const handleScanSuccess = (art) => { ... }
  
  // Render
  return (
    <div className="app-container">
      {/* Header */}
      {/* Main Content (뷰별 분기) */}
      {/* Toast Notification */}
    </div>
  )
}

// === Sub Components ===
function HomeView({ onStart }) { ... }
function MapView({ ... }) { ... }
function QRScannerView({ ... }) { ... }
function CollectionView({ ... }) { ... }
function MyRoomView({ ... }) { ... }
```

**중요 포인트**:
- `'use client'` 필수 (클라이언트 컴포넌트)
- 모든 뷰를 하나의 파일에 (Single Page App)
- useState로 뷰 전환 (라우팅 없음)

---

### 3. `lib/storage.ts`

**역할**: localStorage CRUD 함수

```typescript
// 타입 import
import type { ArtItem } from './types'

const STORAGE_KEY = 'art-collection'

// 저장
export function saveCollection(items: ArtItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('저장 실패:', error)
  }
}

// 불러오기
export function loadCollection(): ArtItem[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('불러오기 실패:', error)
    return null
  }
}

// 초기화 (디버깅용)
export function clearCollection(): void {
  localStorage.removeItem(STORAGE_KEY)
}
```

**중요 포인트**:
- try-catch로 에러 처리
- TypeScript 타입 명시
- 3개 함수만 export

---

### 4. `lib/types.ts`

**역할**: TypeScript 타입 정의

```typescript
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
}

// 뷰 타입
export type ViewType = 'home' | 'map' | 'qr_scan' | 'collection' | 'myroom'

// 토스트 알림
export interface ToastNotification {
  title: string
  msg: string
}
```

---

### 5. `lib/data.ts`

**역할**: 아트스팟 데이터 (하드코딩)

```typescript
import type { ArtSpot } from './types'

export const ART_SPOTS: ArtSpot[] = [
  {
    id: 'pieta',
    title: 'Pietà',
    korTitle: '피에타',
    artist: 'Michelangelo',
    lat: 37.6524,
    lng: 127.6874,
    distance: '350m',
    description: '바티칸의 보물을 비발디파크에서 발견하세요.',
    arUrl: 'https://seoyoung.swiftxr.site/seo-001',
    icon: '✝️',
    color: 'bg-stone-100',
    accent: 'text-stone-600'
  },
  // 향후 추가 스팟들...
]
```

**중요 포인트**:
- 실제 좌표 (비발디파크)
- SwiftXR URL 연결
- 확장 가능한 배열 구조

---

### 6. `app/globals.css`

**역할**: Tailwind + 커스텀 CSS

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans;
  }
  
  h1, h2, h3 {
    @apply font-serif;
  }
}

@layer utilities {
  /* 커스텀 애니메이션 */
  .animate-pulse-slow {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .animate-scan-down {
    animation: scanDown 2s linear infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }
}

@keyframes scanDown {
  0%, 100% { top: 0; }
  50% { top: 100%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* QR 스캐너 3D 효과 */
.transform-style-3d {
  transform-style: preserve-3d;
}

.rotate-y-12 {
  transform: rotateY(12deg);
}

.rotate-x-6 {
  transform: rotateX(6deg);
}
```

---

### 7. `public/manifest.json`

**역할**: PWA 설정

```json
{
  "name": "ARt-Pick",
  "short_name": "ARt-Pick",
  "description": "Walk, Collect, and Curate Art",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### 8. `package.json`

**역할**: 의존성 및 스크립트

```json
{
  "name": "art-pick-mvp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

**중요 포인트**:
- `lucide-react`만 추가 설치 필요
- Firebase, Mapbox 없음!

---

### 9. `next.config.js`

**역할**: Next.js 설정

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA를 위한 정적 export (선택사항)
  // output: 'export',
  
  // 이미지 최적화 비활성화 (static export 시)
  // images: {
  //   unoptimized: true,
  // },
}

module.exports = nextConfig
```

---

### 10. `tailwind.config.js`

**역할**: Tailwind CSS 커스터마이징

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
```

---

## 🔄 파일 간 의존성

```
page.tsx (메인)
  ↓
  ├─ lib/storage.ts (데이터 저장/로드)
  ├─ lib/types.ts (타입 정의)
  └─ lib/data.ts (아트스팟 데이터)

layout.tsx
  ↓
  └─ globals.css (스타일)

manifest.json
  ↓
  └─ icons/ (PWA 아이콘)
```

---

## ✅ 파일 생성 체크리스트

- [ ] `app/layout.tsx`
- [ ] `app/page.tsx`
- [ ] `app/globals.css`
- [ ] `lib/storage.ts`
- [ ] `lib/types.ts`
- [ ] `lib/data.ts`
- [ ] `public/manifest.json`
- [ ] `package.json` (자동 생성)
- [ ] `next.config.js`
- [ ] `tailwind.config.js`

**다음 단계**: `STEP_BY_STEP.md`에서 Copilot과 함께 실제 코드 작성!
