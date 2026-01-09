# 🎯 ARt-Pick 빠른 참조 치트시트

> **5분 안에 시작하기**

---

## 🚀 초간단 시작

```bash
# 1. 프로젝트 생성 (1분)
npx create-next-app@latest art-pick-mvp --typescript --tailwind --app
cd art-pick-mvp

# 2. 패키지 설치 (1분)
npm install lucide-react html5-qrcode

# 3. 개발 서버 (즉시)
npm run dev
```

---

## 📁 만들어야 할 파일 (8개)

```
✅ lib/types.ts          - 타입 정의
✅ lib/storage.ts        - localStorage
✅ lib/geo.ts            - GPS 거리 계산
✅ lib/data.ts           - 9개 작품 데이터
✅ app/globals.css       - 애니메이션
✅ app/page.tsx          - 메인 앱 (가장 중요!)
✅ public/manifest.json  - PWA
✅ app/layout.tsx        - 메타데이터
```

---

## 🎨 9개 작품 목록

| 작품 | 이모지 | 위치 | 타입 |
|------|--------|------|------|
| 앨리스 토끼 | 🐰 | 비발디파크 | ✅ 실제 |
| 체셔 고양이 | 😸 | 홍대입구 | 🎮 가상 |
| 하트 여왕 | ♥️ | 명동 | 🎮 가상 |
| 매드 해터 | 🎩 | 강남 | 🎮 가상 |
| 백토끼 | ⏰ | 이태원 | 🎮 가상 |
| 트럼프 병사 | ♠️ | 여의도 | 🎮 가상 |
| 애벌레 | 🐛 | 압구정 | 🎮 가상 |
| 도도새 | 🦤 | 건대입구 | 🎮 가상 |
| 모의 거북 | 🐢 | 합정 | 🎮 가상 |

---

## 🧪 로컬 테스트 3가지 방법

### 방법 1: 노트북만 (가장 쉬움)

```bash
npm run dev
# → localhost:3000 열기
# → F12 → Sensors → Location (37.6524, 127.6874)
# → QR 이미지를 다른 창에 띄우고
# → 노트북 웹캠으로 스캔
```

### 방법 2: 스마트폰 + ngrok (가장 현실적)

```bash
# 터미널 1
npm run dev

# 터미널 2
ngrok http 3000
# → https://abc123.ngrok.io

# 스마트폰에서 ngrok URL 접속
# 컴퓨터 화면의 QR을 스마트폰으로 스캔
```

### 방법 3: 현장 테스트

```bash
# 비발디파크 실제 방문
# 프린트된 QR 코드 준비
# 앱 배포 후 GPS + QR 실전 테스트
```

---

## 💻 자주 쓰는 Copilot 프롬프트

### 타입 정의
```
lib/types.ts를 만들어주세요.
ArtItem, ArtSpot (isActive, requiresGPS 포함), ViewType, ToastNotification
```

### 거리 계산
```
lib/geo.ts를 만들어주세요.
Haversine 공식으로 calculateDistance 함수
formatDistance 함수 (85m, 1.2km 형식)
```

### 아트스팟 데이터
```
lib/data.ts를 만들어주세요.
9개 작품 데이터 (앨리스 토끼 1개 isActive:true, 나머지 8개 false)
판타지 동화 테마
```

### GPS 추적
```
app/page.tsx에 GPS 추적 useEffect 추가
watchPosition으로 실시간 추적
거리 계산 useEffect
100m 이내 알림
```

### QR 스캔
```
QRScannerView 컴포넌트 생성
useRealCamera 분기
html5-qrcode로 실제 카메라
SwiftXR URL 검증
```

---

## 🎯 핵심 State (app/page.tsx)

```typescript
const [currentView, setCurrentView] = useState<ViewType>('home')
const [inventory, setInventory] = useState<ArtItem[]>([])
const [targetSpot, setTargetSpot] = useState<ArtSpot | null>(null)
const [isNearTarget, setIsNearTarget] = useState(false)
const [notification, setNotification] = useState<ToastNotification | null>(null)
const [userLocation, setUserLocation] = useState<{lat, lng} | null>(null)  // GPS
const [distanceToTarget, setDistanceToTarget] = useState<number | null>(null)
```

---

## 🔧 주요 함수

```typescript
// 거리 계산 (lib/geo.ts)
calculateDistance(lat1, lon1, lat2, lon2) → meters

// localStorage (lib/storage.ts)
saveCollection(items)
loadCollection() → items | null

// 핸들러 (app/page.tsx)
handleStartNavigation(spot)
handleScanSuccess(art)
showToast(title, msg)
```

---

## 📱 DevTools 설정

### GPS 시뮬레이션
```
F12 → 더보기 (⋮) → Sensors → Location
Custom location:
- Latitude: 37.6524
- Longitude: 127.6874
```

### localStorage 확인
```
F12 → Application → Local Storage → http://localhost:3000
Key: art-collection
```

### 카메라 권한
```
주소창 자물쇠 아이콘 → 권한 → 카메라: 허용
```

---

## 🐛 에러 해결 1줄 정리

| 문제 | 해결 |
|------|------|
| GPS 안 잡힘 | DevTools Sensors 재설정 + F5 |
| 카메라 안 열림 | HTTPS 확인 + 권한 허용 |
| QR 못 읽음 | 화면 밝게 + QR 확대 |
| localStorage 초기화 | 시크릿 모드 끄기 |
| ngrok 안됨 | 같은 Wi-Fi 확인 |

---

## ✅ 완성 체크리스트

### 파일 생성
- [ ] lib/types.ts
- [ ] lib/storage.ts
- [ ] lib/geo.ts
- [ ] lib/data.ts (9개 작품)
- [ ] app/page.tsx (GPS + QR)
- [ ] app/globals.css
- [ ] public/manifest.json
- [ ] public/alice-rabbit-qr.png

### 기능 테스트
- [ ] Home → Map 전환
- [ ] GPS 거리 실시간 표시
- [ ] 100m 이내 알림
- [ ] QR 스캔 (노트북 웹캠)
- [ ] 가상 스팟 즉시 수집
- [ ] localStorage 데이터 유지
- [ ] My Room 2가지 모드

### 모바일 테스트
- [ ] ngrok URL 접속
- [ ] GPS 권한
- [ ] 카메라 권한
- [ ] QR 스캔 성공
- [ ] AR 링크 열림

---

## 🚀 배포 명령어

```bash
# Vercel
vercel
vercel --prod

# 환경 변수 없음 (localStorage만 사용)
```

---

## 📊 개발 시간 예상

| 단계 | 시간 |
|------|------|
| 프로젝트 셋업 | 30분 |
| 기본 UI (Home, Map) | 1시간 |
| GPS + 거리 계산 | 30분 |
| QR 스캔 연동 | 1시간 |
| Collection + My Room | 1시간 |
| 테스트 + 버그 수정 | 30분 |
| **총합** | **4.5시간** |

---

## 🎨 테마 색상

```css
앨리스 토끼:    bg-blue-50      text-blue-600
체셔 고양이:    bg-purple-50    text-purple-600
하트 여왕:      bg-red-50       text-red-600
매드 해터:      bg-amber-50     text-amber-600
백토끼:         bg-slate-50     text-slate-600
트럼프 병사:    bg-gray-50      text-gray-600
애벌레:         bg-green-50     text-green-600
도도새:         bg-orange-50    text-orange-600
모의 거북:      bg-teal-50      text-teal-600
```

---

## 📞 긴급 상황 대응

### "아무것도 안 돼요!"
```bash
# 1. 전부 삭제하고 재시작
rm -rf node_modules package-lock.json
npm install
npm run dev

# 2. 브라우저 캐시 삭제
Cmd+Shift+Delete (Mac)
Ctrl+Shift+Delete (Windows)
```

### "배포했는데 안 열려요!"
```bash
# Vercel 로그 확인
vercel logs

# 다시 배포
vercel --prod --force
```

---

**이 치트시트를 옆에 두고 개발하세요!** 📌
