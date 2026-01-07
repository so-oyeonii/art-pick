# 📚 ARt-Pick 개발 가이드

> QR 기반 Web AR MVP 개발을 위한 단계별 가이드

## 🎯 MVP 목표

**소노벨 비발디파크 컨벤션센터**에서 QR 코드를 스캔하여 SwiftXR AR 작품을 감상하고 수집하는 앱

## 📋 개발 로드맵 (4단계)

### Phase 1: 프로젝트 초기화 (Day 1)

#### 목표
- Next.js 14 프로젝트 셋업
- 기본 레이아웃 구성
- 환경 변수 설정

#### Copilot 프롬프트

```
ARt-Pick 프로젝트를 Next.js 14 App Router로 초기화해줘.
- TypeScript 사용
- Tailwind CSS 설정
- src/app 폴더 구조
- 모바일 우선 반응형

기본 레이아웃:
- Header: 로고, 메뉴 버튼
- Main: 페이지 콘텐츠
- BottomNav: 홈, 지도, 스캔, 컬렉션 탭
```

#### 작업 체크리스트
- [ ] `npx create-next-app@latest art-pick --typescript --tailwind --app`
- [ ] 폴더 구조 생성 (components, hooks, lib, store)
- [ ] 기본 레이아웃 컴포넌트 작성
- [ ] BottomNavigation 컴포넌트 작성
- [ ] 환경 변수 파일 설정

#### 폴더 구조
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── map/page.tsx
│   ├── scan/page.tsx
│   └── collection/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   └── ui/
│       └── Button.tsx
├── hooks/
├── lib/
│   └── firebase.ts
└── store/
    └── useStore.ts
```

---

### Phase 2: Firebase & 인증 (Day 2)

#### 목표
- Firebase 프로젝트 연동
- 간단한 익명 인증
- Firestore 데이터 모델 구현

#### Copilot 프롬프트

```
Firebase 설정을 해줘:

1. lib/firebase.ts - Firebase 초기화 (환경변수 사용)
2. hooks/useAuth.ts - 익명 인증 훅
   - 앱 시작 시 자동 익명 로그인
   - 로딩 상태 관리
3. Firestore 컬렉션:
   - users/{uid}: 사용자 정보
   - users/{uid}/collection: 수집한 작품
```

#### Firestore 스키마

```typescript
// users/{uid}
{
  createdAt: Timestamp,
  lastVisit: Timestamp
}

// users/{uid}/collection/{artworkId}
{
  artworkId: string,
  collectedAt: Timestamp,
  spotId: string,
  location: {
    latitude: number,
    longitude: number
  }
}
```

#### 작업 체크리스트
- [ ] Firebase 프로젝트 생성
- [ ] 환경 변수에 Firebase config 추가
- [ ] lib/firebase.ts 작성
- [ ] hooks/useAuth.ts 작성
- [ ] Firestore 보안 규칙 설정

---

### Phase 3: 지도 & 위치 서비스 (Day 3-4)

#### 목표
- Mapbox 지도 표시
- 사용자 위치 추적
- 아트스팟 마커 표시
- 근접 감지 (100m 이내)

#### Copilot 프롬프트

```
위치 기반 기능을 구현해줘:

1. hooks/useGeolocation.ts
   - GPS 위치 추적 (watchPosition)
   - 에러 처리 (권한 거부, GPS 불가)
   - 위치 정확도 필터링

2. lib/distance.ts
   - Haversine 공식으로 두 좌표 간 거리 계산
   - 미터 단위 반환

3. components/map/MapView.tsx
   - Mapbox GL JS 지도
   - 사용자 위치 마커 (파란 점)
   - 아트스팟 마커 (아이콘)
   - 마커 클릭 시 정보 팝업

4. hooks/useProximity.ts
   - 아트스팟과의 거리 계산
   - 100m 이내 진입 감지
   - 상태: 'far' | 'near' | 'arrived'
```

#### 아트스팟 데이터
```typescript
const ARTSPOT = {
  id: 'vivaldi-convention',
  name: '소노벨 비발디파크 컨벤션센터',
  latitude: 37.6524,
  longitude: 127.6874,
  radius: 100, // meters
  artworkId: 'swiftxr-001'
};
```

#### 작업 체크리스트
- [ ] Mapbox 계정 생성 & 토큰 발급
- [ ] hooks/useGeolocation.ts 작성
- [ ] lib/distance.ts 작성
- [ ] components/map/MapView.tsx 작성
- [ ] hooks/useProximity.ts 작성
- [ ] map/page.tsx 완성

---

### Phase 4: QR 스캔 & 수집 (Day 5-6)

#### 목표
- QR 코드 스캐너 구현
- SwiftXR 연동
- 작품 수집 로직
- 수집 완료 UI

#### Copilot 프롬프트

```
QR 스캔 기능을 구현해줘:

1. components/scanner/QRScanner.tsx
   - html5-qrcode 라이브러리 사용
   - 카메라 권한 요청
   - QR 인식 시 URL 추출
   - SwiftXR URL 검증 (seoyoung.swiftxr.site)

2. app/scan/page.tsx
   - 위치 확인 (100m 이내여야 스캔 가능)
   - 멀면: 거리 표시 + "더 가까이 이동하세요"
   - 가까우면: QR 스캐너 활성화

3. hooks/useCollection.ts
   - 작품 수집 함수 (Firestore 저장)
   - 이미 수집했는지 확인
   - 수집 목록 조회

4. components/ui/CollectSuccess.tsx
   - 수집 완료 모달
   - 작품 이미지 & 정보
   - "AR로 보기" 버튼
   - 공유 버튼
```

#### QR → AR 플로우
```
1. QR 스캔
2. URL 파싱: https://seoyoung.swiftxr.site/seo-001
3. SwiftXR 사이트로 이동 (새 탭)
4. AR 체험
5. 앱으로 돌아오면 수집 완료 처리
```

#### 작업 체크리스트
- [ ] html5-qrcode 설치
- [ ] components/scanner/QRScanner.tsx 작성
- [ ] app/scan/page.tsx 완성
- [ ] hooks/useCollection.ts 작성
- [ ] components/ui/CollectSuccess.tsx 작성
- [ ] Firestore에 수집 기록 저장

---

## 🔧 추가 작업

### PWA 설정

```
next-pwa 설정해줘:
- manifest.json 생성
- 서비스 워커 설정
- 아이콘 (192x192, 512x512)
- 오프라인 페이지
```

### 컬렉션 페이지

```
collection/page.tsx를 만들어줘:
- 수집한 작품 그리드 표시
- 작품 클릭 시 상세 정보
- "AR로 다시 보기" 버튼
- 수집 날짜 & 위치 표시
```

---

## 💡 Copilot 사용 팁

### 컨텍스트 제공하기
```
ARt-Pick 프로젝트에서 [파일명]을 참고해서 
[컴포넌트/훅/함수]를 만들어줘.

요구사항:
- [상세 요구사항 1]
- [상세 요구사항 2]

사용 기술: Next.js 14 App Router, TypeScript, Tailwind CSS
```

### 단계별 요청하기
```
1단계: 타입 정의만 먼저 작성해줘
2단계: 기본 구조 작성해줘
3단계: 로직 구현해줘
4단계: 에러 처리 추가해줘
```

### 예시 코드 요청하기
```
useGeolocation 훅의 사용 예시를 보여줘:
- 컴포넌트에서 어떻게 import하고
- 어떻게 사용하는지
- 에러 처리는 어떻게 하는지
```

---

## 🧪 테스트 체크리스트

### 위치 서비스
- [ ] 위치 권한 요청 정상 동작
- [ ] GPS 추적 정상 동작
- [ ] 권한 거부 시 에러 메시지
- [ ] 아트스팟 근접 감지 (100m)

### QR 스캐너
- [ ] 카메라 권한 요청
- [ ] QR 인식 정상 동작
- [ ] SwiftXR URL 검증
- [ ] 잘못된 QR 처리

### 수집 기능
- [ ] Firestore에 기록 저장
- [ ] 중복 수집 방지
- [ ] 수집 완료 UI 표시
- [ ] 컬렉션 페이지에 표시

### PWA
- [ ] 홈 화면 추가 가능
- [ ] 오프라인 기본 페이지
- [ ] 아이콘 표시

---

## 🚀 배포

### Firebase Hosting

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 초기화
firebase init hosting

# 빌드
npm run build

# 배포
firebase deploy --only hosting
```

### 환경 변수 (Vercel/Firebase)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## 📝 향후 확장

MVP 이후 추가할 기능:
1. **다중 아트스팟** - 여러 위치에서 다양한 작품 수집
2. **뱃지 시스템** - 수집 달성 보상
3. **소셜 기능** - 친구와 컬렉션 공유
4. **개인 갤러리** - AR로 작품 배치
5. **가이드 투어** - 추천 경로 안내
