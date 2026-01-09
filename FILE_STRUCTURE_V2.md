# 📁 ARt-Pick MVP - 파일 구조 가이드 (GPS 연동 포함)

> 실제 GPS 추적 + QR 스캔이 가능한 최종 버전

---

## 🌳 전체 구조

```
art-pick-mvp/
├── 📁 app/
│   ├── layout.tsx           # 루트 레이아웃 + PWA 메타데이터
│   ├── page.tsx             # 메인 앱 (GPS + QR 통합)
│   └── globals.css          # Tailwind + 커스텀 애니메이션
│
├── 📁 lib/
│   ├── types.ts             # TypeScript 타입 (isActive 추가)
│   ├── storage.ts           # localStorage 헬퍼
│   ├── data.ts              # 아트스팟 데이터 (3개)
│   └── geo.ts               # ⭐ Haversine 거리 계산
│
├── 📁 public/
│   ├── manifest.json        # PWA manifest
│   └── 📁 icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── package.json             # html5-qrcode 포함
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 📄 각 파일 상세

### 1. `lib/types.ts` ⭐ 업데이트됨

```typescript
export interface ArtItem {
  id: string
  title: string
  korTitle: string
  artist: string
  description: string
  arUrl: string
  icon: string
  color: string
  accent: string
  collectedAt?: string
}

export interface ArtSpot extends ArtItem {
  lat: number
  lng: number
  distance: string
  isActive: boolean      // ⭐ 실제 QR 있는지
  requiresGPS: boolean   // ⭐ GPS 필요한지
}

export type ViewType = 'home' | 'map' | 'qr_scan' | 'collection' | 'myroom'

export interface ToastNotification {
  title: string
  msg: string
}
```

**핵심 변경점**:
- `ArtSpot`에 `isActive`, `requiresGPS` 추가
- 이 플래그로 실제/가상 스팟 구분

---

### 2. `lib/geo.ts` ⭐ 새 파일!

**역할**: GPS 좌표 간 거리 계산

```typescript
/**
 * Haversine 공식으로 두 좌표 간 거리 계산
 * @returns 미터 단위 거리
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * 거리를 사람이 읽기 쉬운 형식으로 변환
 * @example 85 → "85m", 1234 → "1.2km"
 */
export function formatDistance(meters: number): string {
  if (meters < 100) return `${Math.round(meters)}m`
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}
```

---

### 3. `lib/data.ts` ⭐ 업데이트됨

**역할**: 3개 아트스팟 정의 (1개 실제 + 2개 가상)

```typescript
import type { ArtSpot } from './types'

export const ART_SPOTS: ArtSpot[] = [
  // ✅ 실제 체험 가능
  {
    id: 'vivaldi-pieta',
    title: 'Pietà',
    korTitle: '피에타',
    artist: 'Michelangelo',
    lat: 37.6524,
    lng: 127.6874,
    distance: '', // GPS로 실시간 계산
    isActive: true,        // 실제 QR 있음
    requiresGPS: true,     // GPS 100m 이내 필요
    arUrl: 'https://seoyoung.swiftxr.site/seo-001',
    icon: '✝️',
    color: 'bg-stone-100',
    accent: 'text-stone-600',
    description: '비발디파크 컨벤션센터에서 바티칸의 보물을 만나보세요.'
  },
  
  // 🎮 가상 체험 (Coming Soon)
  {
    id: 'seoul-david',
    title: 'David',
    korTitle: '다비드',
    artist: 'Michelangelo',
    lat: 37.5665,
    lng: 126.9780,
    distance: '820m',
    isActive: false,       // Coming Soon
    requiresGPS: false,    // 시뮬레이션만
    arUrl: '#',
    icon: '🗿',
    color: 'bg-orange-50',
    accent: 'text-orange-600',
    description: '서울 시청 광장 근처 (준비중 - 체험판으로 미리보기)'
  },
  
  {
    id: 'hongdae-venus',
    title: 'Venus de Milo',
    korTitle: '밀로의 비너스',
    artist: 'Unknown',
    lat: 37.5563,
    lng: 126.9227,
    distance: '1.2km',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '🏛️',
    color: 'bg-blue-50',
    accent: 'text-blue-600',
    description: '홍대입구역 근처 (준비중 - 체험판으로 미리보기)'
  }
]
```

**확장 방법**:
1. 새 스팟 추가
2. `isActive: false`로 시작
3. 현장에 QR 설치 후 `isActive: true`로 변경
4. 배포!

---

### 4. `app/page.tsx` ⭐ 대폭 업데이트

**역할**: 메인 앱 로직 + GPS 추적 + QR 스캔

#### 주요 State

```typescript
const [currentView, setCurrentView] = useState<ViewType>('home')
const [inventory, setInventory] = useState<ArtItem[]>([])
const [targetSpot, setTargetSpot] = useState<ArtSpot | null>(null)
const [isNearTarget, setIsNearTarget] = useState(false)
const [notification, setNotification] = useState<ToastNotification | null>(null)

// ⭐ GPS 관련
const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
const [distanceToTarget, setDistanceToTarget] = useState<number | null>(null)
```

#### GPS 추적 useEffect

```typescript
useEffect(() => {
  if (!('geolocation' in navigator)) return

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    },
    (error) => {
      console.error('GPS 에러:', error)
    },
    { enableHighAccuracy: true }
  )

  return () => navigator.geolocation.clearWatch(watchId)
}, [])
```

#### 거리 계산 useEffect

```typescript
useEffect(() => {
  if (userLocation && targetSpot && targetSpot.requiresGPS) {
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      targetSpot.lat, targetSpot.lng
    )
    setDistanceToTarget(distance)

    if (distance < 100 && !isNearTarget) {
      setIsNearTarget(true)
      showToast('목적지 도착!', '주변에서 QR 코드를 찾아보세요!')
    }
  }
}, [userLocation, targetSpot])
```

#### 핸들러 함수

```typescript
const handleStartNavigation = (spot: ArtSpot) => {
  setTargetSpot(spot)
  setIsNearTarget(false)
  setCurrentView('map')
  
  // 가상 스팟이면 즉시 활성화
  if (!spot.requiresGPS) {
    setTimeout(() => setIsNearTarget(true), 500)
  }
}
```

---

### 5. QRScannerView 컴포넌트 ⭐ 핵심!

**2가지 모드 분기**:

```typescript
function QRScannerView({ targetSpot, onSuccess, onBack }) {
  const [scanning, setScanning] = useState(true)
  const [useRealCamera] = useState(targetSpot.isActive)

  useEffect(() => {
    if (useRealCamera) {
      // ✅ 실제 카메라 QR 스캔 (html5-qrcode)
      import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: 250 },
          false
        )
        
        scanner.render(
          (decodedText) => {
            if (decodedText.includes('swiftxr.site')) {
              scanner.clear()
              onSuccess(targetSpot)
            } else {
              alert('올바른 QR 코드를 스캔해주세요')
            }
          },
          (error) => console.log(error)
        )
        
        return () => scanner.clear()
      })
    } else {
      // 🎮 시뮬레이션 스캔
      setTimeout(() => {
        setScanning(false)
        onSuccess(targetSpot)
      }, 3500)
    }
  }, [useRealCamera])

  return (
    <div className="w-full h-full bg-black">
      {useRealCamera ? (
        <div id="qr-reader" className="w-full h-full" />
      ) : (
        <div className="시뮬레이션 UI">...</div>
      )}
    </div>
  )
}
```

---

### 6. MapView 컴포넌트 ⭐ 업데이트

**Props에 GPS 정보 추가**:

```typescript
interface MapViewProps {
  spots: ArtSpot[]
  targetSpot: ArtSpot | null
  isNearTarget: boolean
  userLocation: {lat: number, lng: number} | null  // ⭐
  distanceToTarget: number | null                  // ⭐
  onSelectSpot: (spot: ArtSpot) => void
  onScanClick: () => void
}
```

**하단 시트 로직**:

```typescript
{targetSpot && (
  <div className="bottom-sheet">
    {/* 스팟 정보 */}
    <h3>{targetSpot.korTitle}</h3>
    
    {/* 상태별 메시지 */}
    {targetSpot.requiresGPS ? (
      // 실제 GPS 필요
      isNearTarget ? (
        <div className="bg-green-50">
          <MapPin /> 목적지 부근 도착!
        </div>
      ) : (
        <div>
          이동 중... 현재 거리: {distanceToTarget}m
        </div>
      )
    ) : (
      // 가상 체험
      <div className="bg-yellow-50">
        🎮 체험판 - 실제 위치 방문 없이 수집 가능
      </div>
    )}
    
    {/* 버튼 */}
    {isNearTarget && (
      <button onClick={onScanClick}>
        {targetSpot.requiresGPS ? '주변 QR 스캔하기' : '체험판으로 미리보기'}
      </button>
    )}
  </div>
)}
```

---

### 7. `package.json` ⭐ 의존성 추가

```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "html5-qrcode": "^2.3.8"  // ⭐ QR 스캔용
  }
}
```

---

### 8. `app/globals.css`

**QR 리더 스타일 추가**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 기존 애니메이션들... */

/* QR 리더 스타일 */
#qr-reader {
  width: 100%;
  height: 100%;
}

#qr-reader video {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

#qr-reader__dashboard {
  display: none; /* 기본 UI 숨김 */
}
```

---

## 🔄 데이터 흐름

```
GPS 추적
   ↓
userLocation 업데이트
   ↓
calculateDistance(userLocation, targetSpot)
   ↓
distanceToTarget < 100m?
   ↓ YES
isNearTarget = true
   ↓
"QR 스캔" 버튼 활성화
   ↓
targetSpot.isActive?
   ↓ YES              ↓ NO
실제 카메라 QR      시뮬레이션
   ↓                   ↓
SwiftXR URL 검증    3.5초 딜레이
   ↓                   ↓
수집 완료! ← ← ← ← ←
```

---

## 📝 파일 생성 순서

1. `lib/types.ts` - 타입 정의
2. `lib/storage.ts` - localStorage
3. `lib/geo.ts` - 거리 계산 ⭐
4. `lib/data.ts` - 아트스팟 데이터
5. `app/globals.css` - 스타일
6. `app/page.tsx` - 메인 앱
7. `public/manifest.json` - PWA
8. `app/layout.tsx` - 레이아웃

---

## ✅ 핵심 체크포인트

### GPS 관련
- [ ] `lib/geo.ts` 생성
- [ ] `userLocation` state 추가
- [ ] `watchPosition` useEffect
- [ ] 거리 계산 useEffect
- [ ] 100m 이내 알림

### QR 스캔 관련
- [ ] `html5-qrcode` 설치
- [ ] `useRealCamera` 분기
- [ ] 실제 카메라 마운트
- [ ] SwiftXR URL 검증
- [ ] 시뮬레이션 fallback

### 데이터 구조
- [ ] `isActive` 플래그
- [ ] `requiresGPS` 플래그
- [ ] 3개 아트스팟 정의
- [ ] localStorage 동기화

---

**다음**: `COMPLETE_GUIDE.md`에서 단계별 Copilot 프롬프트로 실제 개발!
