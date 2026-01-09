# 🚀 ARt-Pick MVP - 최종 개발 가이드 (GPS + 실제 QR 연동)

> 비발디파크 1개는 **진짜 GPS + QR**, 나머지는 **가상 체험**

---

## 🎯 핵심 개념

### 베타 버전 전략
- ✅ **비발디파크 "피에타"**: 실제 GPS 필요 + 실제 QR 스캔
- 🎮 **나머지 스팟들**: 위치 무관 + 시뮬레이션 스캔 ("Coming Soon" 배지)
- 🔮 **향후 확장**: `isActive: true`만 바꾸면 실제 스팟으로 전환

---

## 📦 Step 0: 프로젝트 초기화 (10분)

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest art-pick-mvp --typescript --tailwind --app --no-git
cd art-pick-mvp

# 필수 의존성 설치
npm install lucide-react html5-qrcode

# 개발 서버 실행
npm run dev
```

### 폴더 구조 생성

```bash
mkdir lib
mkdir public/icons
```

---

## 🧩 Step 1: 타입 정의 (10분)

### 파일: `lib/types.ts`

### Copilot 프롬프트

```
lib/types.ts 파일을 생성해주세요.

다음 타입들을 정의:

1. ArtItem - 작품 정보
   - id: string
   - title: string (영문)
   - korTitle: string (한글)
   - artist: string
   - description: string
   - arUrl: string (SwiftXR URL)
   - icon: string (이모지)
   - color: string (Tailwind bg 클래스)
   - accent: string (Tailwind text 클래스)
   - collectedAt?: string (ISO 날짜, 선택)

2. ArtSpot - ArtItem을 확장하여 추가:
   - lat: number (위도)
   - lng: number (경도)
   - distance: string (거리 표시용)
   - isActive: boolean (실제 QR 있는지)
   - requiresGPS: boolean (GPS 필요한지)

3. ViewType - 유니온 타입
   'home' | 'map' | 'qr_scan' | 'collection' | 'myroom'

4. ToastNotification
   - title: string
   - msg: string
```

### 예상 결과

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
  isActive: boolean      // ⭐ 실제 QR 있음
  requiresGPS: boolean   // ⭐ GPS 필요
}

export type ViewType = 'home' | 'map' | 'qr_scan' | 'collection' | 'myroom'

export interface ToastNotification {
  title: string
  msg: string
}
```

---

## 💾 Step 2: localStorage 헬퍼 (10분)

### 파일: `lib/storage.ts`

### Copilot 프롬프트

```
lib/storage.ts 파일을 생성해주세요.

다음 3개 함수 구현:

1. saveCollection(items: ArtItem[]): void
   - localStorage에 'art-collection' 키로 저장
   - JSON.stringify 사용
   - try-catch로 에러 처리

2. loadCollection(): ArtItem[] | null
   - localStorage에서 'art-collection' 읽기
   - JSON.parse 사용
   - 없으면 null 반환

3. clearCollection(): void
   - localStorage 초기화 (디버깅용)

타입은 './types'에서 import
```

---

## 🗺 Step 3: 아트스팟 데이터 (15분)

### 파일: `lib/data.ts`

### Copilot 프롬프트 ⭐ 중요!

```
lib/data.ts 파일을 생성해주세요.

export const ART_SPOTS: ArtSpot[] 배열을 만들고
다음 3개 스팟을 추가:

1. 비발디파크 피에타 (실제 체험 가능) ✅
   - id: 'vivaldi-pieta'
   - title: 'Pietà'
   - korTitle: '피에타'
   - artist: 'Michelangelo'
   - lat: 37.6524
   - lng: 127.6874
   - distance: '' (GPS로 실시간 계산)
   - isActive: true          ← 실제 QR 있음
   - requiresGPS: true       ← GPS 필요
   - arUrl: 'https://seoyoung.swiftxr.site/seo-001'
   - icon: '✝️'
   - color: 'bg-stone-100'
   - accent: 'text-stone-600'
   - description: '비발디파크 컨벤션센터에서 바티칸의 보물을 만나보세요.'

2. 서울 다비드 (가상 체험) 🎮
   - id: 'seoul-david'
   - title: 'David'
   - korTitle: '다비드'
   - artist: 'Michelangelo'
   - lat: 37.5665
   - lng: 126.9780
   - distance: '820m'
   - isActive: false         ← Coming Soon
   - requiresGPS: false      ← 시뮬레이션만
   - arUrl: '#'
   - icon: '🗿'
   - color: 'bg-orange-50'
   - accent: 'text-orange-600'
   - description: '서울 시청 광장 근처 (준비중 - 체험판으로 미리보기)'

3. 홍대 비너스 (가상 체험) 🎮
   - id: 'hongdae-venus'
   - title: 'Venus de Milo'
   - korTitle: '밀로의 비너스'
   - artist: 'Unknown'
   - lat: 37.5563
   - lng: 126.9227
   - distance: '1.2km'
   - isActive: false
   - requiresGPS: false
   - arUrl: '#'
   - icon: '🏛️'
   - color: 'bg-blue-50'
   - accent: 'text-blue-600'
   - description: '홍대입구역 근처 (준비중 - 체험판으로 미리보기)'

타입은 './types'에서 import
```

---

## 📍 Step 4: GPS 거리 계산 함수 (15분)

### 파일: `lib/geo.ts` (새 파일!)

### Copilot 프롬프트

```
lib/geo.ts 파일을 새로 생성해주세요.

Haversine 공식을 사용한 거리 계산 함수:

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number

- 지구 반지름 R = 6371e3 (미터)
- φ1, φ2를 라디안으로 변환
- Δφ, Δλ 계산
- Haversine 공식 적용
- 반환값: 미터 단위 거리

추가로 formatDistance 함수도 만들어주세요:
- 100m 미만: "85m"
- 1km 미만: "650m"
- 1km 이상: "1.2km"
```

### 예상 결과

```typescript
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3
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

export function formatDistance(meters: number): string {
  if (meters < 100) return `${Math.round(meters)}m`
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}
```

---

## 🎨 Step 5: 커스텀 CSS (10분)

### 파일: `app/globals.css`

### Copilot 프롬프트

```
app/globals.css 파일을 수정해주세요.

@tailwind 지시문은 유지하고 다음 추가:

1. @layer utilities에 커스텀 애니메이션:
   - animate-pulse-slow
   - animate-scan-down
   - animate-float
   - animate-fade-in-up

2. @keyframes 정의:
   - scanDown
   - float
   - fadeInUp

3. 3D 변환 클래스:
   - transform-style-3d
   - rotate-y-12
   - rotate-x-6

4. QR 스캐너용 추가 스타일:
   - #qr-reader 스타일링
```

---

## 📱 Step 6: 메인 App 구조 (30분)

### 파일: `app/page.tsx`

### Copilot 프롬프트 (1/3) - 기본 구조

```
app/page.tsx를 'use client' 컴포넌트로 만들어주세요.

필수 import:
- React: useState, useEffect
- lucide-react: MapPin, QrCode, Box, Home, Check, X, Navigation, Scan, Smartphone, ArrowRight, Grid, Map as MapIcon
- @/lib/data: ART_SPOTS
- @/lib/storage: saveCollection, loadCollection
- @/lib/geo: calculateDistance, formatDistance
- @/lib/types: ArtItem, ArtSpot, ViewType, ToastNotification

State 관리:
1. currentView: ViewType = 'home'
2. inventory: ArtItem[] = []
3. targetSpot: ArtSpot | null = null
4. isNearTarget: boolean = false
5. notification: ToastNotification | null = null
6. userLocation: {lat: number, lng: number} | null = null  ← ⭐ GPS
7. distanceToTarget: number | null = null  ← ⭐ 실시간 거리

기본 레이아웃:
- Header: 로고 + 네비게이션
- Main: 뷰별 컴포넌트
- Toast: 알림
```

### Copilot 프롬프트 (2/3) - GPS 추적 ⭐

```
같은 파일에 GPS 추적 useEffect를 추가해주세요:

useEffect(() => {
  // Geolocation API 사용 가능 확인
  if (!('geolocation' in navigator)) {
    showToast('GPS 오류', '위치 서비스를 사용할 수 없습니다.')
    return
  }

  // watchPosition으로 실시간 추적
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    },
    (error) => {
      console.error('GPS 에러:', error)
      if (error.code === error.PERMISSION_DENIED) {
        showToast('권한 필요', '위치 권한을 허용해주세요.')
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )

  // 클린업
  return () => navigator.geolocation.clearWatch(watchId)
}, [])

그리고 거리 계산 useEffect도 추가:

useEffect(() => {
  if (userLocation && targetSpot && targetSpot.requiresGPS) {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      targetSpot.lat,
      targetSpot.lng
    )
    setDistanceToTarget(distance)

    // 100m 이내 도착
    if (distance < 100 && !isNearTarget) {
      setIsNearTarget(true)
      showToast('목적지 도착!', '주변에서 QR 코드를 찾아보세요!')
    }
  }
}, [userLocation, targetSpot, isNearTarget])
```

### Copilot 프롬프트 (3/3) - 핸들러 함수들

```
다음 핸들러 함수들을 추가해주세요:

1. showToast(title: string, msg: string): void
   - setNotification({ title, msg })
   - setTimeout 3초 후 setNotification(null)

2. handleStartNavigation(spot: ArtSpot): void
   - setTargetSpot(spot)
   - setIsNearTarget(false)
   - setCurrentView('map')
   - requiresGPS가 false면 즉시 setIsNearTarget(true)
   - requiresGPS가 true면 GPS 대기

3. handleScanSuccess(art: ArtItem): void
   - inventory에 이미 있는지 확인
   - 없으면 추가 + showToast("수집 완료", ...)
   - 있으면 showToast("알림", "이미 수집한 작품입니다")
   - 1.5초 후 setCurrentView('collection')

4. localStorage 동기화:
   - useEffect: 앱 시작 시 loadCollection()
   - useEffect: inventory 변경 시 saveCollection()
```

---

## 🏠 Step 7: Home 화면 (20분)

### Copilot 프롬프트

```
app/page.tsx 하단에 HomeView 컴포넌트를 추가해주세요.

Props:
- onStart: () => void

UI:
- 전체 화면 중앙 정렬
- 배경: 그라디언트 블러 (indigo-100, rose-100) + animate-pulse-slow
- 타이틀: "Walk, Collect, Curate" (font-serif, text-5xl)
  - "Curate"는 그라디언트 텍스트 (indigo-500 → purple-600)
- 부제: "지도를 따라 숨겨진 예술 작품을 찾고..."
- 버튼: "탐험 시작하기" (bg-neutral-900, rounded-full)
  - ArrowRight 아이콘 + hover:translate-x-1 효과

animate-fade-in-up 애니메이션 적용
```

---

## 🗺 Step 8: Map 화면 (40분)

### Copilot 프롬프트 (1/2)

```
MapView 컴포넌트를 추가해주세요.

Props:
- spots: ArtSpot[]
- targetSpot: ArtSpot | null
- isNearTarget: boolean
- userLocation: {lat, lng} | null
- distanceToTarget: number | null
- onSelectSpot: (spot: ArtSpot) => void
- onScanClick: () => void

레이아웃:
1. 전체 배경: bg-slate-100 + 그리드 패턴
2. SVG 도로
3. 사용자 위치 마커 (파란 점 + animate-ping)
4. 아트스팟 마커들:
   - isActive: false면 opacity-50 + "Soon" 배지
   - 각 spot의 icon, color 사용
   - 마커 클릭 시 onSelectSpot(spot)
5. 하단 시트:
   - targetSpot 없으면: 안내 메시지
   - 있으면: 스팟 정보 + 거리 + 상태별 버튼
```

### Copilot 프롬프트 (2/2) - 하단 시트 로직 ⭐

```
MapView의 하단 시트 로직을 다음과 같이 구현해주세요:

조건 분기:
1. targetSpot이 없으면:
   "어디로 떠나볼까요? 지도 위의 핀을 눌러주세요"

2. targetSpot.requiresGPS === true (비발디파크):
   - GPS 대기 중: "이동 중... 현재 거리: {distanceToTarget}m"
   - 100m 이내 도착: 
     - 초록 배지 "목적지 부근 도착!"
     - "주변 QR 스캔하기" 버튼 활성화

3. targetSpot.requiresGPS === false (가상 체험):
   - 노란 배지 "🎮 체험판 - 실제 위치 방문 없이 수집 가능"
   - "체험판으로 미리보기" 버튼 즉시 활성화

버튼 클릭 시 onScanClick() 호출
```

---

## 📷 Step 9: QR Scanner 화면 (50분) ⭐⭐⭐

### Copilot 프롬프트 (1/3) - 기본 구조

```
QRScannerView 컴포넌트를 추가해주세요.

Props:
- targetSpot: ArtSpot
- onSuccess: (art: ArtItem) => void
- onBack: () => void

State:
- scanning: boolean = true
- useRealCamera: boolean = targetSpot.isActive

레이아웃:
- 전체 화면 bg-black
- 좌상단: X 버튼 (onBack)
- 중앙: 카메라 또는 시뮬레이션
- 하단: 스캔 상태 메시지
```

### Copilot 프롬프트 (2/3) - 실제 카메라 QR 스캔 ⭐

```
QRScannerView에 실제 QR 스캔 기능을 추가해주세요.

useEffect에서:
1. useRealCamera === true일 때:
   - html5-qrcode 동적 import
   - Html5QrcodeScanner 인스턴스 생성
   - qr-reader div에 마운트
   - 스캔 성공 콜백:
     - decodedText에 'swiftxr.site' 포함 확인
     - 맞으면 scanner.clear() 후 onSuccess(targetSpot)
     - 틀리면 showToast("잘못된 QR", "올바른 QR 코드를 스캔해주세요")
   - cleanup: scanner.clear()

2. useRealCamera === false일 때:
   - 시뮬레이션 UI (기존 코드)
   - 3.5초 후 자동 onSuccess(targetSpot)

UI:
- useRealCamera ? <div id="qr-reader" /> : <시뮬레이션 UI>
```

### Copilot 프롬프트 (3/3) - 시뮬레이션 UI

```
useRealCamera === false일 때의 시뮬레이션 UI:

- 배경: 노이즈 패턴
- 중앙: 가짜 QR 코드 (16개 격자)
- QR 주변: 초록 모서리 4개
- 스캔 레이저 라인 (animate-scan-down)
- 하단 메시지:
  - scanning ? "QR 코드 인식 중..." : "인식 성공! 링크 연결 중..."

useEffect로 progress 0→100 애니메이션
```

---

## 📦 Step 10: Collection 화면 (30분)

### Copilot 프롬프트

```
CollectionView 컴포넌트를 추가해주세요.

Props:
- inventory: ArtItem[]

UI:
1. 상단: "My Collection" 제목 + 수집 개수
2. inventory 비어있으면:
   - MapIcon + "아직 수집된 작품이 없습니다"
   - "지도에서 스팟을 찾아보세요"
3. 있으면: 세로 그리드
   - 각 카드:
     - 아이콘 박스 (color)
     - 제목 (korTitle)
     - 작가 (artist)
     - 설명 (description)
     - 우상단 "LBS GET" 또는 "DEMO" 배지
     - collectedAt 날짜 표시
     - hover:shadow-md 효과

카드 클릭 시:
- item.arUrl이 '#'이 아니면 window.open(arUrl, '_blank')
- '#'이면 showToast("준비중", "실제 AR은 준비 중입니다")
```

---

## 🏛 Step 11: My Room 화면 (60분)

### Copilot 프롬프트 (1/2) - 기본 구조

```
MyRoomView 컴포넌트를 추가해주세요.

Props:
- inventory: ArtItem[]

State:
- activeTab: 'virtual' | 'ar'
- placedItems: (ArtItem & {uid, x, y})[]
- arPlaneDetected: boolean (AR 모드 전용)

UI:
1. 상단 중앙: 탭 전환 버튼
   - "가상 갤러리" (Box 아이콘)
   - "실제 방 (AR)" (Smartphone 아이콘)

2. 중앙: 캔버스 (탭별로 다름)

3. 하단: 인벤토리 드로어 (수평 스크롤)
   - inventory.map() → 클릭 가능 아이콘들
   - 클릭 시 handlePlace(item)
```

### Copilot 프롬프트 (2/2) - 가상 갤러리 & AR

```
MyRoomView에 2가지 모드 구현:

1. activeTab === 'virtual':
   - bg-white, perspective: 1000px
   - 가상 방 벽 그라디언트 배경
   - placedItems를 absolute 배치
   - 각 아이템: 흰 프레임 + 그림자
   - 클릭 시 handleRemove(uid)

2. activeTab === 'ar':
   - bg-black (카메라 시뮬레이션)
   - arPlaneDetected === false:
     - "바닥을 인식 중..." 메시지
     - Scan 아이콘 + animate-pulse
   - arPlaneDetected === true:
     - 그리드 패턴 (바닥 감지)
     - placedItems 더 크게 표시
     - animate-float 효과

useEffect:
- activeTab 변경 시 arPlaneDetected = false
- 2초 후 arPlaneDetected = true

handlePlace:
- placedItems.push({ ...item, uid: Date.now(), x: 랜덤, y: 랜덤 })

handleRemove:
- placedItems.filter(i => i.uid !== uid)
```

---

## 🌐 Step 12: PWA 설정 (20분)

### 파일: `public/manifest.json`

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
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### layout.tsx 업데이트

```typescript
export const metadata: Metadata = {
  title: 'ARt-Pick | Walk, Collect, Curate',
  description: 'Location-based Web AR Art Platform',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}
```

---

## 🧪 Step 13: 테스트 시나리오

### 1. GPS 테스트 (중요!)

```bash
# 브라우저 DevTools 열기 (F12)
# Console → Sensors (더보기 메뉴)
# Location → Custom location
# Latitude: 37.6524, Longitude: 127.6874 (비발디파크)

# 앱에서:
# 1. "피에타" 선택
# 2. 거리가 0m로 표시되는지 확인
# 3. "주변 QR 스캔하기" 버튼 활성화 확인
```

### 2. 실제 QR 스캔 테스트

```bash
# HTTPS 환경 필요! (localhost는 안됨)
# ngrok 사용:
ngrok http 3000

# 모바일에서 ngrok URL 접속
# 카메라 권한 허용
# 실제 QR 코드 준비 (내용: https://seoyoung.swiftxr.site/seo-001)
# 스캔 → AR 링크 열림 확인
```

### 3. 가상 체험 테스트

```bash
# "다비드" 또는 "비너스" 선택
# "체험판으로 미리보기" 버튼 즉시 활성화
# 시뮬레이션 스캔 → 3.5초 후 수집
# Collection에 "DEMO" 배지 확인
```

### 4. localStorage 테스트

```bash
# F12 → Application → Local Storage
# 'art-collection' 키 확인
# F5 새로고침 → 데이터 유지 확인
```

---

## 🚀 Step 14: 배포

### Vercel 배포 (추천)

```bash
# 1. GitHub에 푸시
git init
git add .
git commit -m "feat: GPS + QR integrated MVP"
git remote add origin <your-repo-url>
git push -u origin main

# 2. Vercel 연동
# https://vercel.com 접속
# New Project → GitHub 레포 선택
# 자동 배포 완료!
```

### HTTPS 테스트

```bash
# 배포 후 모바일에서 접속
# GPS 권한 요청 → 허용
# 카메라 권한 요청 → 허용
# 실제 QR 코드 스캔 테스트
```

---

## ✅ 최종 체크리스트

### 기능 테스트

- [ ] GPS 권한 요청 및 추적
- [ ] 비발디파크 선택 → 실시간 거리 표시
- [ ] 100m 이내 도착 → 알림
- [ ] 실제 카메라로 QR 스캔 (HTTPS 환경)
- [ ] 가상 스팟 즉시 체험 (GPS 불필요)
- [ ] localStorage 데이터 유지
- [ ] My Room 2가지 모드 동작
- [ ] PWA 홈 화면 추가 가능

### 디자인 체크

- [ ] 모바일 (375px) 최적화
- [ ] GPS 거리 실시간 업데이트
- [ ] "Soon" 배지 표시 (가상 스팟)
- [ ] 애니메이션 부드러움

### 코드 품질

- [ ] TypeScript 에러 없음
- [ ] GPS 에러 처리 (권한 거부 등)
- [ ] QR 스캔 에러 처리
- [ ] console.log 제거

---

## 🐛 문제 해결

### GPS가 작동 안 함

```typescript
// DevTools Console에서 수동 테스트:
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords),
  err => console.error(err)
)
```

### 카메라가 안 열림

- HTTPS 환경인지 확인 (localhost 제외)
- 브라우저 권한 설정 확인
- 모바일: 설정 → 앱 → Chrome → 권한

### QR 스캔이 안됨

- QR 코드에 정확히 'swiftxr.site' 포함되어 있는지
- 조명 밝게, 카메라 거리 10-30cm

---

## 🎉 완성!

이제 다음 단계로:

1. **실제 QR 코드 제작** - 프린트해서 비발디파크에 설치
2. **현장 테스트** - 실제로 가서 GPS + QR 스캔 테스트
3. **피드백 수집** - 베타 테스터 모집
4. **스팟 확장** - isActive: true로 하나씩 추가

베타 버전 완성을 축하합니다! 🎨✨
