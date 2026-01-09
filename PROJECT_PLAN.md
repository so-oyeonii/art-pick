# 🎨 ARt-Pick MVP - 프로젝트 계획서

> **QR 기반 Web AR 도슨트 플랫폼** - 백엔드 없이 localStorage로 동작하는 심플한 MVP

## 📋 프로젝트 개요

### 핵심 컨셉
- 지도 UI를 통해 아트스팟 위치 확인
- 실제 위치로 이동 (시뮬레이션)
- QR 코드 스캔하여 SwiftXR AR 체험
- 수집한 작품을 나만의 갤러리/AR 룸에 배치

### 주요 차별점
✨ **백엔드 없음** - localStorage만으로 완전 동작  
✨ **외부 AR 연동** - SwiftXR로 AR 렌더링 위임  
✨ **PWA 지원** - 모바일 앱처럼 설치 가능  

---

## 🛠 기술 스택

```
Frontend:  Next.js 14 (App Router) + TypeScript + Tailwind CSS
Storage:   localStorage (브라우저 로컬)
AR:        SwiftXR (외부 링크)
Icons:     lucide-react
Deployment: Vercel / GitHub Pages
```

**필요 없는 것들:**
- ❌ Firebase
- ❌ Mapbox API
- ❌ 백엔드 서버
- ❌ 데이터베이스

---

## 📱 핵심 기능

### 1. Home (시작 화면)
- 앱 소개
- "탐험 시작하기" 버튼

### 2. Map (지도 뷰)
- 아트스팟 위치 마커 표시
- 사용자 위치 마커 (파란 점)
- 목적지 선택 시 이동 시뮬레이션
- 도착하면 "QR 스캔" 버튼 활성화

### 3. QR Scanner
- 카메라 시뮬레이션 UI
- QR 코드 인식 애니메이션
- SwiftXR URL 감지 → 새 탭으로 열기
- 앱으로 복귀 시 자동 수집 완료

### 4. Collection (내 컬렉션)
- 수집한 작품 목록 (카드 UI)
- 각 작품 클릭 시 AR 다시 보기 가능
- localStorage에 영구 저장

### 5. My Room (갤러리/AR 룸)
- **가상 갤러리 모드**: 수집한 작품을 3D 공간에 배치
- **실제 방 AR 모드**: 카메라 피드 위에 작품 배치 시뮬레이션
- 작품 배치/삭제 인터랙션

---

## 📁 프로젝트 구조

```
art-pick-mvp/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 메인 앱 (모든 뷰 포함)
│   └── globals.css             # Tailwind + 커스텀 CSS
├── lib/
│   ├── storage.ts              # localStorage 헬퍼 함수
│   └── types.ts                # TypeScript 타입 정의
├── public/
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # PWA 아이콘들
├── package.json
├── next.config.js              # Next.js 설정
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

**핵심 파일은 단 4개:**
1. `app/page.tsx` - 전체 앱 UI (Single Page)
2. `lib/storage.ts` - localStorage 관리
3. `lib/types.ts` - 타입 정의
4. `app/globals.css` - 스타일링

---

## 🎯 개발 우선순위

### Phase 1: 기본 구조 (30분)
- [x] Next.js 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] 기본 레이아웃 및 네비게이션

### Phase 2: 핵심 UI (1시간)
- [x] Home 화면
- [x] Map 뷰 (정적 UI)
- [x] QR Scanner 시뮬레이션
- [x] Collection 리스트

### Phase 3: 인터랙션 (1시간)
- [x] 뷰 간 전환 (useState 라우팅)
- [x] 이동 시뮬레이션 (setTimeout)
- [x] QR 스캔 → AR 링크 열기
- [x] localStorage 저장/불러오기

### Phase 4: 고급 기능 (1시간)
- [x] My Room 가상 갤러리
- [x] My Room AR 모드
- [x] 작품 배치/삭제
- [x] 토스트 알림

### Phase 5: PWA & 배포 (30분)
- [ ] PWA manifest 설정
- [ ] 모바일 최적화
- [ ] Vercel 배포

**총 예상 시간: 4시간**

---

## 💾 데이터 모델

### localStorage 구조

```typescript
// Key: 'art-collection'
{
  inventory: [
    {
      id: string,
      title: string,
      korTitle: string,
      artist: string,
      description: string,
      arUrl: string,        // SwiftXR URL
      icon: string,         // 이모지
      color: string,        // Tailwind 클래스
      collectedAt: string,  // ISO 날짜
    }
  ]
}
```

### 아트스팟 데이터 (하드코딩)

```typescript
const ART_SPOTS = [
  {
    id: 'vivaldi-pieta',
    title: 'Pietà',
    korTitle: '피에타',
    artist: 'Michelangelo',
    lat: 37.6524,
    lng: 127.6874,
    arUrl: 'https://seoyoung.swiftxr.site/seo-001',
    icon: '✝️',
    color: 'bg-stone-100'
  },
  // 추후 확장 가능
];
```

---

## 🎨 디자인 시스템

### 컬러 팔레트
```css
--primary: #000000;      /* 블랙 */
--surface: #FFFFFF;      /* 화이트 */
--accent-1: #6366F1;     /* 인디고 (Pietà) */
--accent-2: #F59E0B;     /* 앰버 (David) */
--success: #10B981;      /* 그린 (수집 완료) */
--bg: #F5F5F5;           /* 라이트 그레이 */
```

### 타이포그래피
- **헤딩**: `font-serif` (우아함)
- **본문**: `font-sans` (가독성)
- **버튼**: `font-bold`

### 애니메이션
- `animate-pulse-slow` - 배경 그라디언트
- `animate-scan-down` - QR 스캐너 레이저
- `animate-float` - AR 오브젝트 부유
- `animate-fade-in-up` - 페이지 전환

---

## 🚀 배포 전략

### Vercel (추천)
```bash
# 1회성 설정
npx vercel

# 이후 배포
git push origin main
# → 자동 배포
```

### GitHub Pages (대안)
```bash
npm run build
npm run export
# out/ 폴더를 gh-pages 브랜치에 푸시
```

---

## 🔮 향후 확장 계획

### v1.1 - 다중 아트스팟
- 서울 전역 10개 스팟 추가
- 지도 확대/축소 기능
- 거리 기반 정렬

### v1.2 - 소셜 기능
- Firebase 추가
- 친구와 컬렉션 공유
- 글로벌 리더보드

### v1.3 - 자체 AR 렌더링
- AR.js 또는 8th Wall 통합
- 커스텀 3D 모델 업로드
- 마커리스 AR

### v1.4 - 게이미피케이션
- 뱃지 시스템
- 일일 퀘스트
- 희귀 작품 랜덤 등장

---

## 📚 참고 자료

- **UI 참고**: 제공된 React 컴포넌트 코드
- **Next.js 14 문서**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **lucide-react 아이콘**: https://lucide.dev

---

## ✅ 성공 기준

- [x] 3개 뷰 전환 동작
- [x] QR 스캔 → AR 링크 열림
- [x] localStorage 영구 저장
- [x] 모바일 UI 최적화
- [x] 4시간 내 완성

---

## 🤝 협업 방법

1. **Codespaces에서 작업**
2. **Copilot 프롬프트 사용** (STEP_BY_STEP.md 참고)
3. **단계별 커밋**
   - feat: Home 화면 구현
   - feat: Map 뷰 추가
   - feat: localStorage 연동
4. **주기적 테스트**
   - `npm run dev` 후 브라우저 확인

---

**다음 파일**: `FILE_STRUCTURE.md`에서 각 파일별 상세 역할 확인  
**개발 가이드**: `STEP_BY_STEP.md`에서 Copilot 프롬프트와 함께 단계별 진행
