# 🎨 ARt-Pick

> **일상의 틈을 예술로 채우는 LBS 기반 Web AR 도슨트 플랫폼**

Walk, Collect, and Art — 특별한 장소에서 숨겨진 예술 작품을 발견하고, QR 코드를 스캔하여 AR로 감상하세요!

## 📱 MVP 버전 (v1.0)

현재 버전은 **소노벨 비발디파크 컨벤션센터**에서 단일 작품을 수집할 수 있는 MVP입니다.

### 핵심 플로우

```
앱 실행 → 지도에서 아트스팟 확인 → 컨벤션센터 도착 (100m 이내)
→ "QR 스캔" 버튼 활성화 → QR 스캔 → SwiftXR AR 체험 
→ 앱으로 돌아오면 수집 완료! 🎉
```

## 🛠 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **Backend** | Firebase (Auth, Firestore, Hosting) |
| **Maps** | Mapbox GL JS |
| **QR Scanner** | html5-qrcode |
| **AR** | SwiftXR (외부 호스팅) |
| **PWA** | next-pwa |

## 📁 프로젝트 구조

```
art-pick/
├── README.md
├── docs/
│   ├── DEVELOPMENT.md      # 개발 로드맵 & Copilot 프롬프트
│   └── ARCHITECTURE.md     # 시스템 아키텍처
├── types/
│   ├── artwork.ts          # 작품 타입
│   ├── artspot.ts          # 아트스팟 타입
│   ├── user.ts             # 사용자 타입
│   └── index.ts            # 통합 export
├── data/
│   ├── artwork.json        # 작품 데이터 (1개)
│   └── artspot.json        # 아트스팟 데이터 (1개)
├── public/
│   └── qr-code.png         # QR 코드 이미지
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── .env.example
└── .gitignore
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 Firebase, Mapbox 키를 입력하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. HTTPS로 테스트 (QR 스캔, GPS 필요)

```bash
# ngrok 사용
ngrok http 3000

# 또는 mkcert로 로컬 HTTPS 설정
```

## 🎯 MVP 기능

- [x] 위치 기반 아트스팟 표시 (Mapbox)
- [x] GPS 기반 근접 감지 (100m 이내)
- [x] QR 코드 스캐너
- [x] SwiftXR AR 연동 (외부 링크)
- [x] 작품 수집 기록 (Firebase)
- [x] PWA 지원

## 🗺 아트스팟 정보

| 위치 | 좌표 | 작품 |
|------|------|------|
| 소노벨 비발디파크 컨벤션센터 | 37.6524, 127.6874 | SwiftXR 3D 작품 |

## 📖 개발 가이드

자세한 개발 방법은 다음 문서를 참고하세요:

- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - 단계별 개발 가이드 & Copilot 프롬프트
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - 시스템 아키텍처 & 데이터 흐름

## 🔗 관련 링크

- **SwiftXR AR 체험**: https://seoyoung.swiftxr.site/seo-001
- **Firebase Console**: https://console.firebase.google.com
- **Mapbox Studio**: https://studio.mapbox.com

## 📄 라이센스

MIT License
