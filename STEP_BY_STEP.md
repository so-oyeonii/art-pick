# 🚀 ARt-Pick MVP - 단계별 개발 가이드

> Copilot과 함께 4시간 만에 완성하는 Web AR 플랫폼

---

## 🎯 시작 전 체크리스트

- [ ] GitHub Codespaces 또는 VS Code 준비
- [ ] Copilot 활성화 확인
- [ ] Node.js 18+ 설치 확인
- [ ] `PROJECT_PLAN.md`, `FILE_STRUCTURE.md` 읽기

---

## 📦 Step 0: 프로젝트 초기화 (10분)

### 터미널 명령어

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest art-pick-mvp --typescript --tailwind --app --no-git

# 프로젝트 폴더로 이동
cd art-pick-mvp

# lucide-react 아이콘 설치
npm install lucide-react

# 개발 서버 실행 (별도 터미널)
npm run dev
```

### Copilot 프롬프트

```
# Copilot Chat에 붙여넣기:

Next.js 14 프로젝트가 생성되었습니다.
이제 다음 폴더와 파일을 생성해주세요:

1. lib/ 폴더 생성
2. lib/types.ts - TypeScript 타입 정의
3. lib/storage.ts - localStorage 헬퍼 함수
4. lib/data.ts - 아트스팟 데이터

파일 내용은 FILE_STRUCTURE.md를 참고해서 작성해주세요.
```

### 수동 작업

```bash
# 폴더 생성
mkdir lib
mkdir public/icons

# Git 초기화 (선택사항)
git init
git add .
git commit -m "Initial commit"
```

---

## 🧩 Step 1: 타입 정의 (10분)

### 파일: `lib/types.ts`

### Copilot 프롬프트

```
다음 타입을 정의한 lib/types.ts 파일을 생성해주세요:

1. ArtItem - 작품 정보
   - id, title, korTitle, artist, description
   - arUrl (SwiftXR URL)
   - icon (이모지), color (Tailwind 클래스)
   - collectedAt (선택사항, ISO 날짜)

2. ArtSpot - 아트스팟 정보
   - ArtItem의 모든 필드 포함
   - lat, lng (좌표)
   - distance (거리 문자열)

3. ViewType - 'home' | 'map' | 'qr_scan' | 'collection' | 'myroom'

4. ToastNotification - { title: string, msg: string }
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

다음 3개 함수를 구현:
1. saveCollection(items: ArtItem[]): void
   - localStorage에 'art-collection' 키로 저장
   - JSON.stringify 사용
   - try-catch로 에러 처리

2. loadCollection(): ArtItem[] | null
   - localStorage에서 'art-collection' 읽기
   - JSON.parse 사용
   - 없으면 null 반환

3. clearCollection(): void
   - localStorage에서 'art-collection' 제거

타입은 './types'에서 import
```

### 테스트 (브라우저 콘솔)

```javascript
// 개발 서버 실행 후 브라우저 콘솔에서
localStorage.setItem('art-collection', JSON.stringify([
  { id: 'test', title: 'Test', korTitle: '테스트', artist: 'Me' }
]))

localStorage.getItem('art-collection')
// → 저장된 데이터 확인
```

---

## 🗺 Step 3: 아트스팟 데이터 (10분)

### 파일: `lib/data.ts`

### Copilot 프롬프트

```
lib/data.ts 파일을 생성해주세요.

export const ART_SPOTS: ArtSpot[] 배열을 만들고
다음 2개 스팟 데이터를 추가:

1. Pietà (피에타)
   - id: 'pieta'
   - artist: 'Michelangelo'
   - lat: 37.6524, lng: 127.6874
   - distance: '350m'
   - arUrl: 'https://seoyoung.swiftxr.site/seo-001'
   - icon: '✝️'
   - color: 'bg-stone-100'
   - accent: 'text-stone-600'
   - description: '바티칸의 보물을 비발디파크에서 발견하세요.'

2. David (다비드)
   - id: 'david'
   - artist: 'Michelangelo'
   - lat: 37.5660, lng: 126.9784
   - distance: '820m'
   - arUrl: 'https://seoyoung.swiftxr.site/seo-002'
   - icon: '🗿'
   - color: 'bg-orange-50'
   - accent: 'text-orange-600'
   - description: '시청 광장 근처에서 거인을 만나보세요.'

타입은 './types'에서 import
```

---

## 🎨 Step 4: 커스텀 CSS (10분)

### 파일: `app/globals.css`

### Copilot 프롬프트

```
app/globals.css 파일을 수정해주세요.

@tailwind base/components/utilities는 유지하고
다음을 추가:

1. @layer utilities 안에 커스텀 애니메이션:
   - animate-pulse-slow (4초 pulse)
   - animate-scan-down (QR 스캐너)
   - animate-float (부유 효과)
   - animate-fade-in-up (페이드인)

2. @keyframes 정의:
   - scanDown: top 0% → 100% → 0% (2초)
   - float: translateY 0 → -10px → 0 (3초)
   - fadeInUp: opacity 0→1, translateY 20px→0

3. 3D 변환 유틸리티:
   - transform-style-3d
   - rotate-y-12, rotate-x-6
```

### 수동 확인

```bash
# Tailwind 설정 확인
cat tailwind.config.ts

# content에 app/**/*.{tsx,ts} 포함되어 있는지 확인
```

---

## 🏠 Step 5: Home 화면 (30분)

### 파일: `app/page.tsx`

### Copilot 프롬프트 (1/3)

```
app/page.tsx를 'use client' 컴포넌트로 만들어주세요.

기본 구조:
- React useState로 currentView 관리 (초기값: 'home')
- inventory 상태 (ArtItem[])
- notification 상태 (ToastNotification | null)

HomeView 컴포넌트를 만들어주세요:
- 중앙 정렬 레이아웃
- 배경에 그라디언트 블러 효과 (indigo-100, rose-100)
- 타이틀: "Walk, Collect, Curate" (font-serif, 5xl)
- 부제: "지도를 따라 숨겨진 예술 작품을 찾고..."
- "탐험 시작하기" 버튼 (bg-neutral-900, rounded-full)
- 버튼 클릭 시 onStart() 콜백

lucide-react에서 ArrowRight 아이콘 import
```

### Copilot 프롬프트 (2/3)

```
같은 파일에 메인 App 컴포넌트를 수정해주세요.

구조:
<div className="w-full h-screen bg-neutral-50 flex flex-col">
  {/* Header */}
  <div className="px-5 py-4 bg-white/80 backdrop-blur-md">
    <div>ARt-Pick 로고</div>
    <div>네비게이션 아이콘들 (MapPin, Box, Home)</div>
  </div>
  
  {/* Main Content */}
  <div className="flex-1">
    {currentView === 'home' && <HomeView onStart={() => setCurrentView('map')} />}
  </div>
  
  {/* Toast */}
  {notification && <div className="토스트 UI">...</div>}
</div>

lucide-react에서 MapPin, Box, Home, Check 아이콘 import
```

### 테스트

```bash
# 브라우저에서 localhost:3000 열기
# Home 화면 렌더링 확인
# "탐험 시작하기" 버튼 클릭 → (아직 Map 뷰 없음)
```

---

## 🗺 Step 6: Map 화면 (40분)

### Copilot 프롬프트 (1/2)

```
MapView 컴포넌트를 만들어주세요.

Props:
- spots: ArtSpot[]
- targetSpot: ArtSpot | null
- isNearTarget: boolean
- onSelectSpot: (spot) => void
- onScanClick: () => void

레이아웃:
- 전체 화면 bg-slate-100
- 배경에 그리드 패턴
- SVG로 가짜 도로 그리기
- 사용자 위치 마커 (파란 점, animate-ping)
- 아트스팟 마커들 (각 spot의 icon, color 사용)
- 하단 시트: 선택된 spot 정보 또는 안내 메시지

로직:
- targetSpot이 있고 isNearTarget이면 "QR 스캔" 버튼 표시
- 없으면 "지도 위의 핀을 눌러주세요" 메시지
```

### Copilot 프롬프트 (2/2)

```
App 컴포넌트에 상태와 핸들러를 추가해주세요:

1. 상태:
   - targetSpot (ArtSpot | null)
   - isNearTarget (boolean)

2. handleStartNavigation 함수:
   - setTargetSpot(spot)
   - setIsNearTarget(false)
   - setCurrentView('map')
   - setTimeout 4초 후 setIsNearTarget(true)
   - showToast("목적지 도착", "...")

3. showToast 함수:
   - setNotification({ title, msg })
   - setTimeout 3초 후 setNotification(null)

4. Main Content에 MapView 추가:
   {currentView === 'map' && <MapView ... />}
```

### 테스트

```bash
# Home → "탐험 시작" → Map 뷰 전환
# 아트스팟 마커 클릭
# 4초 후 토스트 알림
# "QR 스캔" 버튼 활성화 확인
```

---

## 📷 Step 7: QR Scanner 화면 (40분)

### Copilot 프롬프트

```
QRScannerView 컴포넌트를 만들어주세요.

Props:
- targetSpot: ArtSpot
- onSuccess: (art: ArtItem) => void
- onBack: () => void

UI:
- 전체 화면 bg-black
- 배경에 카메라 피드 시뮬레이션 (노이즈 패턴)
- 중앙에 흰 배경의 QR 코드 (16개 격자)
- QR 코드 주변에 초록 모서리 (border-green-400)
- 스캔 레이저 라인 (animate-scan-down)

로직:
- useState로 scanning 상태 관리
- useEffect로 progress 업데이트 (0→100)
- 3.5초 후 setScanning(false)
- onSuccess(targetSpot) 호출

lucide-react: X, Scan, Check 아이콘
```

### App에 연결

```
App 컴포넌트 Main Content에 추가:

{currentView === 'qr_scan' && (
  <QRScannerView
    targetSpot={targetSpot!}
    onSuccess={handleScanSuccess}
    onBack={() => setCurrentView('map')}
  />
)}

handleScanSuccess 함수:
- 이미 inventory에 있는지 확인
- 없으면 추가: setInventory([...inventory, art])
- showToast("수집 완료", "...")
- 1.5초 후 setCurrentView('collection')
```

### 테스트

```bash
# Map → "QR 스캔" 클릭
# 스캐너 애니메이션 확인
# 3.5초 후 자동 수집
# Collection 뷰로 이동 (아직 없음)
```

---

## 📦 Step 8: Collection 화면 (30분)

### Copilot 프롬프트

```
CollectionView 컴포넌트를 만들어주세요.

Props:
- inventory: ArtItem[]

UI:
- 상단 제목: "My Collection"
- inventory가 비어있으면: 빈 상태 UI (MapIcon, "아직 수집된 작품이 없습니다")
- 있으면: 세로 스크롤 그리드
- 각 카드: 
  - 아이콘 박스 (item.color, item.icon)
  - 제목 (item.korTitle)
  - 작가 (item.artist)
  - 설명 (item.description)
  - "LBS GET" 뱃지

lucide-react: MapIcon
```

### App에 연결

```
Main Content에 추가:

{currentView === 'collection' && (
  <CollectionView inventory={inventory} />
)}

Header의 Box 아이콘 클릭 시:
onClick={() => setCurrentView('collection')}
```

### localStorage 연동

```
App 컴포넌트에 useEffect 2개 추가:

// 1. 앱 시작 시 불러오기
useEffect(() => {
  const saved = loadCollection()
  if (saved) setInventory(saved)
}, [])

// 2. inventory 변경 시 저장
useEffect(() => {
  if (inventory.length > 0) {
    saveCollection(inventory)
  }
}, [inventory])

import { loadCollection, saveCollection } from '@/lib/storage'
```

### 테스트

```bash
# QR 스캔 후 Collection 확인
# F5 새로고침 → 데이터 유지 확인 (localStorage)
# 브라우저 콘솔: localStorage.getItem('art-collection')
```

---

## 🏛 Step 9: My Room 화면 (60분)

### Copilot 프롬프트 (1/3) - 기본 구조

```
MyRoomView 컴포넌트를 만들어주세요.

Props:
- inventory: ArtItem[]

상태:
- activeTab: 'virtual' | 'ar'
- placedItems: (ArtItem & {uid, x, y})[]

UI:
- 상단: 탭 전환 버튼 (가상 갤러리 / 실제 방 AR)
- 중앙: 캔버스 영역 (탭별로 다름)
- 하단: 인벤토리 드로어 (수평 스크롤)

lucide-react: Box, Smartphone
```

### Copilot 프롬프트 (2/3) - 가상 갤러리 모드

```
activeTab === 'virtual'일 때:

캔버스:
- bg-white, perspective: 1000px
- 배경에 가상 방 벽 그라디언트
- placedItems를 absolute로 배치
- 각 아이템: 흰 프레임 + 그림자 + 바닥 그림자

인터랙션:
- 인벤토리에서 아이템 클릭 → handlePlace(item)
- placedItems에 {uid, x: 랜덤, y: 랜덤} 추가
- 배치된 아이템 클릭 → handleRemove(uid)
```

### Copilot 프롬프트 (3/3) - AR 모드

```
activeTab === 'ar'일 때:

캔버스:
- bg-black (카메라 피드 시뮬레이션)
- 배경 노이즈 패턴
- arPlaneDetected 상태 (2초 후 true)
- 바닥 감지 전: "바닥을 인식 중..." 메시지
- 감지 후: 그리드 패턴 표시

placedItems:
- 더 크게 표시 (w-32 h-40)
- 부유 효과 (animate-float)
- 흰 테두리 + 그림자
- 하단에 작품명 라벨

인터랙션:
- 바닥 감지 전에는 배치 불가 (버튼 disabled)
```

### App에 연결

```
Main Content에 추가:

{currentView === 'myroom' && (
  <MyRoomView inventory={inventory} />
)}

Header의 Home 아이콘 클릭 시:
onClick={() => setCurrentView('myroom')}
```

### 테스트

```bash
# Collection에서 작품 수집
# My Room 탭으로 이동
# 가상 갤러리: 드로어에서 작품 클릭 → 배치
# AR 모드: 2초 대기 → 바닥 감지 → 배치
# 배치된 작품 클릭 → 삭제
```

---

## 🎨 Step 10: 최종 다듬기 (30분)

### Copilot 프롬프트

```
다음 개선사항을 적용해주세요:

1. Header 로고 클릭 시 Home으로:
   <div onClick={() => setCurrentView('home')}>ARt-Pick</div>

2. 토스트 알림 스타일 개선:
   - animate-slide-down 추가
   - 그림자 강화
   - 아이콘 배경색 변경 (초록)

3. Collection 카드에 hover 효과:
   - group, group-hover:shadow-md
   - transition-shadow

4. QR Scanner 종료 버튼 개선:
   - 좌상단 X 버튼
   - bg-black/50 backdrop-blur

5. Map 마커 hover 효과:
   - hover:scale-110
   - transition-all duration-300
```

### 반응형 체크

```css
/* globals.css에 추가 */
@media (max-width: 640px) {
  .app-container {
    font-size: 14px;
  }
}
```

### 성능 최적화

```typescript
// page.tsx 상단에 추가
'use client'

import dynamic from 'next/dynamic'

// 필요시 동적 import (현재는 단일 파일이라 불필요)
```

---

## 🌐 Step 11: PWA 설정 (20분)

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

### 아이콘 생성

```bash
# Favicon Generator 사용
# https://realfavicongenerator.net/

# 또는 간단히:
# 검은 배경에 흰 "A" 텍스트로 192x192, 512x512 PNG 생성
# public/icons/ 폴더에 저장
```

### layout.tsx 수정

```typescript
export const metadata: Metadata = {
  title: 'ARt-Pick | Walk, Collect, Curate',
  description: 'Location-based Web AR Art Platform',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}
```

---

## 🚀 Step 12: 배포 (10분)

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 또는 GitHub 연동

1. GitHub에 푸시
2. https://vercel.com 접속
3. "New Project" → 레포지토리 선택
4. 자동 배포 완료!

### 환경 변수 (필요 시)

```bash
# Vercel 대시보드에서 설정
# 현재는 환경 변수 없음 (localStorage만 사용)
```

---

## ✅ 최종 체크리스트

### 기능 테스트

- [ ] Home → Map 전환
- [ ] 아트스팟 선택 → 이동 시뮬레이션
- [ ] QR 스캔 → SwiftXR 링크 열림 (실제로는 시뮬레이션)
- [ ] 작품 수집 → Collection에 표시
- [ ] F5 새로고침 → 데이터 유지 (localStorage)
- [ ] My Room 가상 갤러리 → 작품 배치/삭제
- [ ] My Room AR 모드 → 바닥 감지 → 배치

### 디자인 체크

- [ ] 모바일 (375px) 레이아웃 확인
- [ ] 태블릿 (768px) 레이아웃 확인
- [ ] 애니메이션 부드러움
- [ ] 폰트 (serif/sans) 적용
- [ ] 색상 일관성

### 코드 품질

- [ ] TypeScript 에러 없음
- [ ] ESLint 경고 최소화
- [ ] 콘솔 에러 없음
- [ ] localStorage 에러 처리

---

## 🎉 완성!

축하합니다! ARt-Pick MVP가 완성되었습니다! 🎨

### 다음 단계

1. **실제 SwiftXR URL 연동**
   - QR 스캔 후 `window.open(targetSpot.arUrl, '_blank')`
   - 실제 AR 체험 후 앱으로 복귀

2. **추가 아트스팟**
   - `lib/data.ts`에 새 스팟 추가
   - 지도 확대/축소 기능

3. **Firebase 연동 (선택)**
   - 다중 기기 동기화
   - 친구 컬렉션 공유

4. **실제 GPS 연동**
   - Geolocation API
   - 실제 위치 기반 활성화

---

## 🐛 문제 해결

### localStorage가 작동 안 함
- HTTPS 또는 localhost에서만 동작
- 시크릿 모드에서는 제한적

### Tailwind 클래스가 적용 안 됨
- `tailwind.config.js`의 content 경로 확인
- `npm run dev` 재시작

### TypeScript 에러
- `npm run build` 실행하여 확인
- `tsconfig.json`의 strict 옵션 조정

---

**개발 완료 후 스크린샷 찍고 README.md에 추가하세요!** 📸
