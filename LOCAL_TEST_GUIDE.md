# 🐰 ARt-Pick MVP - 로컬 테스트 가이드

> **앨리스 토끼를 중심으로 한 판타지 아트 컬렉션**

---

## 🎯 프로젝트 컨셉 변경

### 실제 작품 (1개)
- **앨리스 토끼** 🐰
- 위치: 소노벨 비발디파크 컨벤션센터
- 실제 GPS + 실제 QR 스캔 필요

### 가상 작품 (8개) - 판타지 동화 테마
1. **체셔 고양이** 😸 - 홍대입구역
2. **하트 여왕** ♥️ - 명동
3. **매드 해터** 🎩 - 강남역
4. **백토끼** ⏰ - 이태원
5. **트럼프 병사** ♠️ - 여의도
6. **애벌레** 🐛 - 압구정
7. **도도새** 🦤 - 건대입구
8. **모의 거북** 🐢 - 합정

---

## 💻 로컬 테스트 방법 (노트북)

### 방법 1: DevTools + 화면에 QR 띄우기 ⭐ 추천!

```bash
# 1. 개발 서버 실행
npm run dev

# 2. 브라우저 2개 창 열기
# 창 1: http://localhost:3000 (앱)
# 창 2: QR 코드 이미지 열기

# 3. DevTools (F12) → Sensors
# Location → Custom location
# Latitude: 37.6524
# Longitude: 127.6874

# 4. 앱에서 "앨리스 토끼" 선택 → QR 스캔
# 5. 노트북 웹캠으로 창 2의 QR 코드 스캔!
```

### 방법 2: 모바일 에뮬레이터

```bash
# Chrome DevTools (F12)
# 좌상단 모바일 아이콘 클릭
# iPhone 14 Pro 선택

# Sensors → Location 설정 (비발디파크)
# 웹캠 권한 허용
# QR 스캔 모드에서 화면에 띄운 QR 코드 스캔
```

### 방법 3: 스마트폰 + ngrok (가장 현실적)

```bash
# 터미널 1: 개발 서버
npm run dev

# 터미널 2: ngrok으로 HTTPS 터널
ngrok http 3000
# → https://abc123.ngrok.io 같은 URL 받음

# 스마트폰:
# 1. ngrok URL 접속
# 2. GPS 권한 허용 (위치는 실제 위치 사용)
# 3. QR 코드 이미지를 컴퓨터에 띄워놓고
# 4. 스마트폰 카메라로 스캔!
```

---

## 🧪 단계별 테스트 시나리오

### Test 1: GPS 시뮬레이션 (5분)

```javascript
// DevTools Console에서 수동 테스트
navigator.geolocation.getCurrentPosition(
  pos => console.log('현재 위치:', pos.coords),
  err => console.error('GPS 에러:', err)
)

// Sensors 탭에서 위치 변경
// 37.6524, 127.6874 → 거리 0m 확인
// 37.5665, 126.9780 → 거리 계산 확인
```

### Test 2: QR 코드 URL 확인 (3분)

```bash
# 온라인 QR 디코더 사용
# https://zxing.org/w/decode

# 업로드된 QR 이미지를 디코드해서
# URL이 'swiftxr.site'를 포함하는지 확인
```

### Test 3: 카메라 권한 (2분)

```bash
# 브라우저 주소창 왼쪽 자물쇠 아이콘 클릭
# 권한 → 카메라 "허용"으로 변경
# F5 새로고침

# 또는 브라우저 설정:
# chrome://settings/content/camera
```

### Test 4: localStorage 확인 (2분)

```javascript
// DevTools Console
localStorage.setItem('test', 'hello')
localStorage.getItem('test')
// → "hello" 출력되면 정상

// 실제 앱 데이터 확인
localStorage.getItem('art-collection')
```

---

## 📝 업데이트된 데이터 파일

### `lib/data.ts` - 9개 작품 정의

```typescript
import type { ArtSpot } from './types'

export const ART_SPOTS: ArtSpot[] = [
  // ✅ 실제 수집 가능 (유일)
  {
    id: 'vivaldi-alice-rabbit',
    title: 'Alice Rabbit',
    korTitle: '앨리스 토끼',
    artist: 'Lewis Carroll',
    lat: 37.6524,
    lng: 127.6874,
    distance: '',
    isActive: true,
    requiresGPS: true,
    arUrl: 'https://seoyoung.swiftxr.site/seo-001', // 실제 SwiftXR URL
    icon: '🐰',
    color: 'bg-blue-50',
    accent: 'text-blue-600',
    description: '비발디파크에서 이상한 나라의 앨리스를 만나보세요.'
  },

  // 🎮 가상 체험 (8개)
  {
    id: 'hongdae-cheshire',
    title: 'Cheshire Cat',
    korTitle: '체셔 고양이',
    artist: 'Lewis Carroll',
    lat: 37.5563,
    lng: 126.9227,
    distance: '1.2km',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '😸',
    color: 'bg-purple-50',
    accent: 'text-purple-600',
    description: '홍대입구역 근처 (준비중 - 체험판으로 미리보기)'
  },

  {
    id: 'myeongdong-queen',
    title: 'Queen of Hearts',
    korTitle: '하트 여왕',
    artist: 'Lewis Carroll',
    lat: 37.5636,
    lng: 126.9838,
    distance: '950m',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '♥️',
    color: 'bg-red-50',
    accent: 'text-red-600',
    description: '명동역 근처 (준비중 - 체험판으로 미리보기)'
  },

  {
    id: 'gangnam-hatter',
    title: 'Mad Hatter',
    korTitle: '매드 해터',
    artist: 'Lewis Carroll',
    lat: 37.4979,
    lng: 127.0276,
    distance: '1.8km',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '🎩',
    color: 'bg-amber-50',
    accent: 'text-amber-600',
    description: '강남역 근처 (준비중 - 체험판으로 미리보기)'
  },

  {
    id: 'itaewon-white-rabbit',
    title: 'White Rabbit',
    korTitle: '백토끼',
    artist: 'Lewis Carroll',
    lat: 37.5345,
    lng: 126.9945,
    distance: '1.5km',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '⏰',
    color: 'bg-slate-50',
    accent: 'text-slate-600',
    description: '이태원역 근처 (준비중 - 체험판으로 미리보기)'
  },

  {
    id: 'yeouido-soldier',
    title: 'Card Soldier',
    korTitle: '트럼프 병사',
    artist: 'Lewis Carroll',
    lat: 37.5219,
    lng: 126.9245,
    distance: '2.1km',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '♠️',
    color: 'bg-gray-50',
    accent: 'text-gray-600',
    description: '여의도역 근처 (준비중 - 체험판으로 미리보기)'
  },

  {
    id: 'apgujeong-caterpillar',
    title: 'Caterpillar',
    korTitle: '애벌레',
    artist: 'Lewis Carroll',
    lat: 37.5271,
    lng: 127.0387,
    distance: '1.6km',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '🐛',
    color: 'bg-green-50',
    accent: 'text-green-600',
    description: '압구정로데오역 근처 (준비중 - 체험판으로 미리보기)'
  },

  {
    id: 'konkuk-dodo',
    title: 'Dodo Bird',
    korTitle: '도도새',
    artist: 'Lewis Carroll',
    lat: 37.5403,
    lng: 127.0695,
    distance: '1.9km',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '🦤',
    color: 'bg-orange-50',
    accent: 'text-orange-600',
    description: '건대입구역 근처 (준비중 - 체험판으로 미리보기)'
  },

  {
    id: 'hapjeong-turtle',
    title: 'Mock Turtle',
    korTitle: '모의 거북',
    artist: 'Lewis Carroll',
    lat: 37.5494,
    lng: 126.9138,
    distance: '2.3km',
    isActive: false,
    requiresGPS: false,
    arUrl: '#',
    icon: '🐢',
    color: 'bg-teal-50',
    accent: 'text-teal-600',
    description: '합정역 근처 (준비중 - 체험판으로 미리보기)'
  }
]
```

---

## 🔧 QR 스캔 검증 로직 수정

### `app/page.tsx` - QRScannerView 부분

```typescript
function QRScannerView({ targetSpot, onSuccess, onBack }) {
  // ... 기존 코드

  useEffect(() => {
    if (useRealCamera) {
      import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: 250 },
          false
        )
        
        scanner.render(
          (decodedText) => {
            console.log('QR 스캔 결과:', decodedText)
            
            // SwiftXR URL 검증 (더 유연하게)
            if (
              decodedText.includes('swiftxr.site') || 
              decodedText.includes('seoyoung.swiftxr')
            ) {
              scanner.clear()
              
              // 실제 AR 링크 열기
              window.open(decodedText, '_blank')
              
              // 수집 완료
              setTimeout(() => onSuccess(targetSpot), 1000)
            } else {
              alert('앨리스 토끼 QR 코드를 스캔해주세요!')
            }
          },
          (error) => {
            // 스캔 중 에러는 무시 (계속 시도)
          }
        )
        
        return () => {
          scanner.clear().catch(() => {})
        }
      })
    }
  }, [useRealCamera])
}
```

---

## 🎨 업데이트된 UI 텍스트

### Home 화면

```typescript
<h1 className="text-5xl font-serif">
  Follow the<br/> White Rabbit,<br/> 
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
    Collect Art.
  </span>
</h1>
<p className="text-neutral-500">
  이상한 나라의 예술 작품을 찾아<br/>
  당신만의 판타지 갤러리를 완성하세요.
</p>
```

### Collection 화면

```typescript
<h2>My Wonderland Collection</h2>
<p>앨리스의 세계에서 수집한 예술 작품들</p>
```

---

## 📱 모바일 테스트 체크리스트

### 준비물
- [ ] 스마트폰 (Android/iOS)
- [ ] 컴퓨터 (QR 코드 이미지 띄울 용도)
- [ ] ngrok 계정 (무료)

### 단계
1. [ ] 컴퓨터에서 `npm run dev` 실행
2. [ ] 다른 터미널에서 `ngrok http 3000`
3. [ ] ngrok URL을 스마트폰 브라우저에서 열기
4. [ ] GPS 권한 허용
5. [ ] 카메라 권한 허용
6. [ ] DevTools Sensors에서 비발디파크 좌표 설정
7. [ ] "앨리스 토끼" 선택
8. [ ] 거리 0m 확인
9. [ ] "주변 QR 스캔하기" 클릭
10. [ ] 컴퓨터 화면의 QR 코드를 스마트폰으로 스캔
11. [ ] SwiftXR AR 페이지 열리는지 확인
12. [ ] 앱으로 복귀 → 수집 완료 확인
13. [ ] Collection에서 "앨리스 토끼" 확인
14. [ ] F5 새로고침 → 데이터 유지 확인

---

## 🐛 자주 발생하는 문제와 해결

### 1. 노트북 웹캠이 QR을 못 읽어요

**원인**: 웹캠 해상도가 낮거나 QR 크기가 작음

**해결**:
```bash
# QR 이미지를 풀스크린으로 띄우기
# Windows: F11
# Mac: Cmd+Ctrl+F

# 또는 QR 이미지 확대 (200-300%)
```

### 2. "카메라를 찾을 수 없습니다" 에러

**원인**: HTTPS가 아니거나 권한 거부됨

**해결**:
```bash
# 1. localhost는 HTTP여도 카메라 접근 가능
# 2. 브라우저 주소창 자물쇠 → 권한 → 카메라 허용
# 3. 시크릿 모드 사용 중이면 일반 모드로
```

### 3. GPS 위치가 안 바뀌어요

**원인**: DevTools Sensors가 적용 안됨

**해결**:
```bash
# 1. F5 새로고침
# 2. DevTools 닫고 다시 열기 (F12)
# 3. Console에서 수동 확인:
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords)
)
```

### 4. QR 스캔은 되는데 "잘못된 QR" 메시지

**원인**: QR 코드 내용이 'swiftxr.site'를 포함하지 않음

**해결**:
```typescript
// 임시로 검증 우회 (테스트용)
if (decodedText) {  // 모든 QR 허용
  scanner.clear()
  onSuccess(targetSpot)
}
```

### 5. 스마트폰에서 ngrok URL이 안 열려요

**원인**: 같은 Wi-Fi에 연결 안됨 또는 방화벽

**해결**:
```bash
# 1. 스마트폰과 컴퓨터 같은 Wi-Fi 연결
# 2. ngrok 재시작
ngrok http 3000

# 3. 새 URL을 스마트폰에서 열기
```

---

## 🎯 실전 배포 전 최종 테스트

### Day 1: 로컬 테스트

```bash
# 1. 모든 뷰 전환 확인
Home → Map → QR Scan → Collection → My Room

# 2. GPS 시뮬레이션
비발디파크 좌표 → 거리 0m
서울 좌표 → 거리 계산

# 3. localStorage
수집 → F5 → 데이터 유지

# 4. 가상 스팟 8개 즉시 수집
```

### Day 2: 모바일 테스트

```bash
# 1. ngrok + 스마트폰
# 2. 실제 QR 스캔 (화면에 띄운 QR)
# 3. SwiftXR AR 열림 확인
# 4. 수집 완료 확인
```

### Day 3: 현장 테스트 (선택)

```bash
# 비발디파크 실제 방문
# 1. GPS로 거리 추적
# 2. 100m 이내 도착 확인
# 3. 프린트된 QR 스캔
# 4. AR 체험
```

---

## 🚀 빠른 시작 명령어

```bash
# 프로젝트 생성
npx create-next-app@latest art-pick-mvp --typescript --tailwind --app
cd art-pick-mvp
npm install lucide-react html5-qrcode

# QR 이미지 저장
# 업로드된 3Dobj_qrcode__2_.png를 public/ 폴더에 복사

# 개발 서버
npm run dev

# 다른 터미널: ngrok (모바일 테스트용)
ngrok http 3000
```

---

## 📸 테스트 스크린샷 찍을 위치

1. Home 화면 - "Follow the White Rabbit"
2. Map 화면 - 9개 스팟 마커
3. 비발디파크 선택 - GPS 거리 표시
4. QR 스캔 화면 - 카메라 뷰
5. 수집 완료 토스트
6. Collection - 앨리스 토끼 카드
7. My Room - 가상 갤러리
8. My Room - AR 모드

---

이제 바로 테스트 시작하세요! 🐰✨
