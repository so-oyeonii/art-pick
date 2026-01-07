# 🏗 ARt-Pick 시스템 아키텍처

> QR 기반 Web AR 플랫폼의 기술 아키텍처

## 📊 시스템 개요

```
┌─────────────────────────────────────────────────────────────┐
│                      ARt-Pick App                           │
│                    (Next.js 14 PWA)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   │
│   │  Home   │   │   Map   │   │  Scan   │   │Collection│   │
│   │  Page   │   │  Page   │   │  Page   │   │  Page   │   │
│   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   │
│        │             │             │             │         │
│   ┌────┴─────────────┴─────────────┴─────────────┴────┐   │
│   │                    Hooks Layer                     │   │
│   │  useAuth │ useGeolocation │ useProximity │ useCollection │
│   └────┬─────────────┬─────────────┬─────────────┬────┘   │
│        │             │             │             │         │
│   ┌────┴─────────────┴─────────────┴─────────────┴────┐   │
│   │                   Services Layer                   │   │
│   │     Firebase    │    Mapbox    │   QR Scanner     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │              External Services           │
        ├─────────────────────────────────────────┤
        │  Firebase     │  Mapbox   │  SwiftXR    │
        │  - Auth       │  - Maps   │  - AR View  │
        │  - Firestore  │  - Tiles  │             │
        │  - Hosting    │           │             │
        └─────────────────────────────────────────┘
```

## 🔄 핵심 플로우

### 1. 앱 시작 플로우

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  App     │───▶│  익명    │───▶│  위치    │───▶│  Ready   │
│  Launch  │    │  로그인  │    │  권한    │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

### 2. 작품 수집 플로우

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  지도    │───▶│  이동    │───▶│  근접    │───▶│  QR      │
│  확인    │    │  (도보)  │    │  감지    │    │  스캔    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                                                     ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  수집    │◀───│  앱으로  │◀───│  AR      │◀───│  SwiftXR │
│  완료!   │    │  복귀    │    │  체험    │    │  열기    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

## 📱 페이지 구조

### Home Page (`/`)
- 앱 소개
- 수집 현황 요약
- 빠른 시작 버튼

### Map Page (`/map`)
- Mapbox 전체 화면 지도
- 사용자 현재 위치 (파란 점)
- 아트스팟 마커 (노란 핀)
- 거리 정보 표시

### Scan Page (`/scan`)
- 위치 상태 표시
- QR 스캐너 (100m 이내에서만 활성화)
- SwiftXR 연동

### Collection Page (`/collection`)
- 수집한 작품 목록
- 작품 상세 정보
- AR 다시 보기 링크

## 🗄 데이터 모델

### Firestore 구조

```
firestore/
├── users/
│   └── {uid}/
│       ├── createdAt: Timestamp
│       ├── lastVisit: Timestamp
│       └── collection/
│           └── {artworkId}/
│               ├── artworkId: string
│               ├── spotId: string
│               ├── collectedAt: Timestamp
│               └── location: GeoPoint
```

### TypeScript 타입

```typescript
// 작품
interface Artwork {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  imageUrl: string;
  arUrl: string;        // SwiftXR URL
  qrCodeUrl: string;    // QR 코드 이미지
}

// 아트스팟
interface ArtSpot {
  id: string;
  name: string;
  nameKo: string;
  latitude: number;
  longitude: number;
  radius: number;       // 인식 반경 (미터)
  artworkId: string;
  address: string;
}

// 수집 기록
interface CollectionItem {
  artworkId: string;
  spotId: string;
  collectedAt: Date;
  location: {
    latitude: number;
    longitude: number;
  };
}
```

## 🔐 보안 규칙

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 본인 데이터만 접근
    match /users/{userId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
      
      match /collection/{docId} {
        allow read, write: if request.auth != null 
                           && request.auth.uid == userId;
      }
    }
  }
}
```

## 🗺 위치 서비스

### Geolocation API 사용

```typescript
// useGeolocation.ts 핵심 로직
const watchPosition = () => {
  navigator.geolocation.watchPosition(
    (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
    },
    (error) => {
      setError(error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};
```

### 거리 계산 (Haversine)

```typescript
// lib/distance.ts
function getDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // 미터 단위
}
```

### 근접 감지 상태

```typescript
type ProximityStatus = 'far' | 'near' | 'arrived';

// 100m 이내 = arrived (스캔 가능)
// 500m 이내 = near (가까워지는 중)
// 500m 초과 = far (멀리 있음)
```

## 📷 QR 스캐너

### html5-qrcode 설정

```typescript
// components/scanner/QRScanner.tsx
import { Html5QrcodeScanner } from 'html5-qrcode';

const scanner = new Html5QrcodeScanner(
  "qr-reader",
  {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0
  },
  false
);

scanner.render(onScanSuccess, onScanFailure);
```

### QR URL 검증

```typescript
function validateSwiftXRUrl(url: string): boolean {
  const pattern = /^https:\/\/seoyoung\.swiftxr\.site\/.+$/;
  return pattern.test(url);
}
```

## 🎨 UI 컴포넌트

### 컴포넌트 트리

```
Layout
├── Header
│   ├── Logo
│   └── MenuButton
├── Main (페이지별 콘텐츠)
│   ├── HomePage
│   │   ├── HeroSection
│   │   └── QuickStartButton
│   ├── MapPage
│   │   ├── MapView
│   │   ├── UserMarker
│   │   ├── SpotMarker
│   │   └── DistanceOverlay
│   ├── ScanPage
│   │   ├── ProximityStatus
│   │   ├── QRScanner
│   │   └── CollectSuccessModal
│   └── CollectionPage
│       ├── CollectionGrid
│       └── ArtworkCard
└── BottomNav
    ├── NavItem (홈)
    ├── NavItem (지도)
    ├── NavItem (스캔)
    └── NavItem (컬렉션)
```

### 디자인 토큰

```typescript
// tailwind.config.js
const colors = {
  primary: '#6366F1',    // 인디고
  secondary: '#F59E0B',  // 앰버 (아트스팟)
  success: '#10B981',    // 수집 완료
  background: '#0F172A', // 다크 배경
  surface: '#1E293B',    // 카드 배경
};
```

## 📦 의존성

### 필수 패키지

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "firebase": "^10.7.0",
    "mapbox-gl": "^3.0.0",
    "html5-qrcode": "^2.3.8",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@types/mapbox-gl": "^3.0.0"
  }
}
```

## ⚡ 성능 최적화

### 코드 스플리팅

```typescript
// 동적 import로 번들 크기 최소화
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <MapSkeleton />
});

const QRScanner = dynamic(() => import('@/components/scanner/QRScanner'), {
  ssr: false
});
```

### 캐싱 전략

```typescript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'firebasestorage.googleapis.com' }
    ]
  }
};
```

## 🚀 배포 아키텍처

```
┌─────────────────────────────────────────┐
│              User Device                │
│           (Mobile Browser)              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          Firebase Hosting               │
│       (Next.js Static Export)           │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│   Firestore   │   │   SwiftXR     │
│   (Database)  │   │   (AR Host)   │
└───────────────┘   └───────────────┘
```

## 🔮 확장 가능성

### 다중 아트스팟 지원

```typescript
// 현재: 단일 스팟
const ARTSPOT = { ... };

// 확장: 스팟 배열 + Firestore
const artspots = await getArtSpots();
const nearbySpots = artspots.filter(
  spot => getDistance(userLocation, spot) < 500
);
```

### 자체 AR 렌더링

```typescript
// 현재: SwiftXR 외부 링크
window.open(arUrl, '_blank');

// 확장: A-Frame/AR.js 내장
<a-scene embedded arjs>
  <a-marker preset="custom" url={markerUrl}>
    <a-entity gltf-model={modelUrl} />
  </a-marker>
</a-scene>
```
