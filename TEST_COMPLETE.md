# GPS + QR 통합 완료 테스트 가이드 ✅

## 🎉 구현 완료 사항

### Phase 1-6 완료 ✓
- ✅ 데이터 구조 업데이트 (isActive, requiresGPS 필드)
- ✅ GPS 거리 계산 함수 (Haversine)
- ✅ 실시간 GPS 추적 Hook
- ✅ html5-qrcode 통합
- ✅ 9개 Alice in Wonderland 작품 데이터
- ✅ 지도 뷰 GPS 연동
- ✅ QR 스캐너 실제 카메라 지원
- ✅ 빌드 테스트 통과

## 📍 테스트 방법

### 1. Chrome DevTools GPS 시뮬레이션

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3001 접속
```

**GPS 설정:**
1. F12 → Console 옆 `⋮` 메뉴 → More tools → Sensors
2. Location → Custom location 선택
3. **비발디파크 Convention Center 좌표 입력:**
   - Latitude: `37.6524`
   - Longitude: `127.6874`

### 2. 실제 QR 스캔 테스트

**Alice Rabbit (실제 작품) 테스트:**
1. GPS를 비발디파크 좌표로 설정
2. 지도에서 Alice Rabbit 🐰 선택
3. "QR 스캔하기" 버튼 활성화 확인 (GPS 100m 내)
4. QR 이미지 `3Dobj_qrcode__2_.png` 화면에 표시
5. 웹캠으로 QR 스캔
6. SwiftXR AR 링크 성공 확인

**가상 작품 테스트 (Coming Soon):**
1. Cheshire Cat 😸 등 가상 작품 선택
2. "가상 체험하기" 버튼 클릭 (GPS 불필요)
3. 3.5초 시뮬레이션 진행
4. 컬렉션 자동 추가 확인

### 3. 거리 계산 확인

**GPS 좌표 변경 테스트:**
```javascript
// DevTools Sensors에서 좌표 변경
37.6534, 127.6864  // ~100m 떨어진 위치
37.6544, 127.6854  // ~200m 떨어진 위치
```

각 작품까지의 거리가 실시간으로 업데이트되는지 확인

## 🗺️ 작품 위치 데이터

| 작품 | 좌표 | 타입 | 설명 |
|------|------|------|------|
| Alice Rabbit 🐰 | 37.6524, 127.6874 | 실제 QR | 컨벤션센터 |
| Cheshire Cat 😸 | 37.6534, 127.6864 | 가상 | 스키장 입구 |
| Queen of Hearts ♥️ | 37.6514, 127.6884 | 가상 | 오션월드 |
| Mad Hatter 🎩 | 37.6520, 127.6890 | 가상 | 중앙 광장 |
| White Rabbit ⏰ | 37.6530, 127.6880 | 가상 | 골프 클럽하우스 |
| Card Soldier ♠️ | 37.6518, 127.6868 | 가상 | 온천 스파 |
| Caterpillar 🐛 | 37.6528, 127.6870 | 가상 | 산책로 전망대 |
| Dodo Bird 🦤 | 37.6522, 127.6878 | 가상 | 레스토랑 거리 |
| Mock Turtle 🐢 | 37.6526, 127.6882 | 가상 | 호텔 로비 |

## 🔍 확인 사항

### GPS 기능
- [ ] Header에 "✓ GPS 활성화" 표시
- [ ] 지도 중앙에 파란 점 (사용자 위치)
- [ ] 각 작품까지의 거리 실시간 업데이트
- [ ] 100m 이내 시 "QR 스캔하기" 버튼 활성화
- [ ] 범위 밖 시 "100m 이내로 이동" 메시지

### QR 스캔
- [ ] 실제 작품: 카메라 실행 및 QR 인식
- [ ] 가상 작품: 3.5초 시뮬레이션 애니메이션
- [ ] SwiftXR URL 패턴 검증
- [ ] 스캔 성공 후 컬렉션 추가
- [ ] 중복 수집 방지 메시지

### UI/UX
- [ ] "Coming Soon" 배지 (가상 작품)
- [ ] 실제 vs 가상 작품 구분 (버튼 색상)
- [ ] 거리 표시 (예: 150m, 2.3km)
- [ ] Toast 알림 (수집 성공)
- [ ] GPS 오류 시 사용자 안내

## 📱 모바일 테스트 (ngrok)

```bash
# ngrok으로 외부 URL 생성
npx ngrok http 3001

# 생성된 https URL로 모바일 접속
# 실제 GPS 및 카메라 사용 가능
```

## 🐛 알려진 이슈

1. **GPS 권한:** 브라우저 설정에서 위치 권한 허용 필요
2. **HTTPS 필수:** 실제 모바일에서는 ngrok 또는 배포 필요
3. **카메라 권한:** QR 스캔 시 카메라 접근 허용 필요

## 🚀 다음 단계 (Phase 7)

- [ ] PWA manifest 아이콘 추가
- [ ] 에러 핸들링 개선
- [ ] Loading state UI
- [ ] README 업데이트
- [ ] 배포 준비

## 📝 코드 구조

```
src/
├── lib/
│   ├── types.ts          # isActive, requiresGPS 추가
│   ├── storage.ts        # localStorage 관리
│   ├── data.ts           # 9개 Alice 작품 데이터
│   └── geo.ts            # ✨ NEW: Haversine 거리 계산
├── hooks/
│   └── useGeolocation.ts # ✨ NEW: 실시간 GPS 추적
└── app/
    ├── page.tsx          # ✨ 업데이트: GPS 통합
    └── components/
        └── views/
            ├── MapView.tsx        # ✨ 업데이트: GPS 표시
            └── QRScannerView.tsx  # ✨ 업데이트: html5-qrcode
```

---

**테스트 시작:** http://localhost:3001

**SwiftXR AR 링크:** https://seoyoung.swiftxr.site/seo-001
