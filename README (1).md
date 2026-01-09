# 🎨 ARt-Pick MVP - 개발 문서 패키지

> **비발디파크에서 실제 GPS + QR로 작동하는 Web AR 플랫폼**

---

## 📚 문서 구성

이 패키지는 **Copilot과 함께** ARt-Pick을 개발하기 위한 완전한 가이드입니다.

### 1️⃣ COMPLETE_GUIDE.md ⭐ **가장 중요!**
**바로 시작하세요!**

- Step 0~14까지 단계별 가이드
- 각 단계마다 **Copilot 프롬프트** 포함
- GPS 추적 + 실제 QR 스캔 완전 구현
- 테스트 시나리오 + 문제 해결

👉 **Codespaces에서 이 파일을 열고 순서대로 따라하세요!**

---

### 2️⃣ FILE_STRUCTURE_V2.md
**파일별 상세 설명**

- 전체 프로젝트 구조
- 각 파일의 역할과 예시 코드
- GPS/QR 관련 핵심 로직
- 데이터 흐름 다이어그램

👉 **개발 중 참고용 레퍼런스**

---

### 3️⃣ PROJECT_PLAN.md
**프로젝트 전체 개요**

- 기술 스택 & 기능 설명
- 디자인 시스템
- 배포 전략
- 향후 확장 계획

👉 **프로젝트 이해를 위한 큰 그림**

---

## 🚀 빠른 시작 (5분!)

### 1. 터미널 열고 명령어 실행

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest art-pick-mvp --typescript --tailwind --app --no-git

# 이동
cd art-pick-mvp

# 필수 패키지 설치
npm install lucide-react html5-qrcode

# 개발 서버 실행 (별도 터미널)
npm run dev
```

### 2. COMPLETE_GUIDE.md 열기

VS Code에서 `COMPLETE_GUIDE.md`를 열고 **Step 1부터** 시작!

### 3. Copilot과 작업

각 Step의 **Copilot 프롬프트**를 복사해서 Copilot Chat에 붙여넣으세요.

---

## 💡 핵심 개념

### 베타 버전 전략

```
비발디파크 "피에타"    →  ✅ 실제 GPS 100m + 실제 QR 스캔
서울 "다비드"           →  🎮 가상 체험 (시뮬레이션)
홍대 "밀로의 비너스"    →  🎮 가상 체험 (시뮬레이션)
```

- **1개만 진짜**: 비발디파크에 실제 QR 코드 설치
- **나머지는 데모**: 위치 무관하게 체험 가능
- **향후 확장**: `isActive: true`만 바꾸면 실제 스팟으로!

---

## 🛠 기술 스택

```
Frontend:   Next.js 14 + TypeScript + Tailwind CSS
GPS:        Geolocation API + Haversine 공식
QR Scan:    html5-qrcode
Storage:    localStorage (백엔드 없음!)
AR:         SwiftXR (외부 링크)
Deploy:     Vercel
```

---

## 📱 주요 기능

### 1. GPS 실시간 추적
- 사용자 위치 자동 추적
- 목적지까지 거리 실시간 계산
- 100m 이내 도착 시 알림

### 2. 실제 QR 스캔
- 모바일 카메라로 QR 코드 인식
- SwiftXR URL 검증
- AR 체험 → 앱 복귀 → 자동 수집

### 3. 가상 체험 모드
- GPS 없이 즉시 체험 가능
- 시뮬레이션 스캔 (3.5초)
- "Coming Soon" 배지 표시

### 4. My Room (갤러리/AR)
- 가상 3D 공간에 작품 배치
- AR 모드로 실제 방에 배치 시뮬레이션

---

## 📁 프로젝트 구조 (완성 시)

```
art-pick-mvp/
├── app/
│   ├── layout.tsx
│   ├── page.tsx          # 모든 로직 여기!
│   └── globals.css
├── lib/
│   ├── types.ts          # isActive, requiresGPS
│   ├── storage.ts        # localStorage
│   ├── data.ts           # 3개 아트스팟
│   └── geo.ts            # ⭐ Haversine 거리 계산
├── public/
│   ├── manifest.json     # PWA
│   └── icons/
└── package.json
```

---

## ✅ 개발 체크리스트

### Step 1-4: 기본 설정 (30분)
- [ ] 프로젝트 생성
- [ ] 타입 정의 (`isActive`, `requiresGPS`)
- [ ] localStorage 헬퍼
- [ ] 아트스팟 데이터 (3개)
- [ ] GPS 거리 계산 함수

### Step 5-8: 핵심 UI (1시간)
- [ ] Home 화면
- [ ] Map 화면 (GPS 거리 표시)
- [ ] QR Scanner (실제 카메라 분기)
- [ ] Collection

### Step 9-11: 고급 기능 (1시간)
- [ ] GPS 실시간 추적
- [ ] 100m 이내 감지
- [ ] 실제 QR 스캔 (html5-qrcode)
- [ ] My Room 2가지 모드

### Step 12-14: 배포 (30분)
- [ ] PWA 설정
- [ ] Vercel 배포
- [ ] 모바일 테스트 (HTTPS)

---

## 🧪 테스트 방법

### 1. GPS 시뮬레이션 (로컬)

```bash
# Chrome DevTools (F12)
# Console → 더보기 (⋮) → Sensors
# Location → Custom location
# Latitude: 37.6524, Longitude: 127.6874

# 앱에서 "피에타" 선택 → 거리 0m 확인!
```

### 2. 실제 QR 스캔 (모바일)

```bash
# HTTPS 환경 필요!
# ngrok으로 터널링:
ngrok http 3000

# 모바일에서 ngrok URL 접속
# QR 코드 준비 (내용: https://seoyoung.swiftxr.site/seo-001)
# 스캔 테스트!
```

### 3. localStorage 확인

```bash
# F12 → Application → Local Storage
# 'art-collection' 키 확인
# F5 새로고침 → 데이터 유지!
```

---

## 🎯 실제 배포 시나리오

### 베타 런칭

1. **QR 코드 제작**
   - 내용: `https://seoyoung.swiftxr.site/seo-001`
   - 프린트 (방수 재질)
   - 비발디파크 컨벤션센터 설치

2. **앱 배포**
   - Vercel로 배포 (HTTPS 필수)
   - 도메인: `art-pick.vercel.app`

3. **현장 테스트**
   - 실제로 비발디파크 방문
   - GPS 100m 이내 감지 확인
   - QR 스캔 → AR 체험

4. **베타 테스터 모집**
   - 피드백 수집
   - 버그 수정
   - 다음 스팟 확장!

### 확장 로드맵

```
v1.0 (현재)  →  비발디파크 1개
v1.1         →  서울 시청 추가 (isActive: true)
v1.2         →  홍대 추가
v1.3         →  강남, 이태원, 북촌 추가 (총 6개)
v2.0         →  Firebase 연동, 친구 공유
```

---

## 🐛 자주 발생하는 문제

### GPS가 안 잡혀요
- **해결**: 브라우저 권한 설정 → 위치 "허용"
- **확인**: DevTools Sensors에서 수동 설정

### 카메라가 안 열려요
- **해결**: HTTPS 환경에서만 카메라 접근 가능
- **확인**: localhost는 OK, 배포 시 Vercel 사용

### QR 스캔이 안돼요
- **해결**: QR에 정확히 `swiftxr.site` 포함되어야 함
- **확인**: 조명 밝게, 거리 10-30cm

### localStorage가 초기화돼요
- **해결**: 시크릿 모드 사용 중인지 확인
- **확인**: 일반 모드로 전환

---

## 📞 문의 & 피드백

- **GitHub Issues**: 버그 리포트
- **Discussions**: 기능 제안
- **Twitter**: @so-oyeonii

---

## 🎉 시작하세요!

```bash
# 1. 프로젝트 생성
npx create-next-app@latest art-pick-mvp --typescript --tailwind --app

# 2. COMPLETE_GUIDE.md 열기
code COMPLETE_GUIDE.md

# 3. Copilot과 함께 개발!
# 4시간 후 완성! 🚀
```

**행운을 빕니다!** 🎨✨
