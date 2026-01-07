# Art Pick 설치 및 실행 가이드

## 빠른 시작 (Quick Start)

### 1. 의존성 설치

```bash
# 백엔드 의존성 설치
npm install

# 프론트엔드 의존성 설치
cd client
npm install
cd ..
```

### 2. 환경 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 내용 (필요시 수정):
# PORT=5000
# UPLOAD_DIR=./uploads
# MAX_FILE_SIZE=10485760
```

### 3. 실행

#### 개발 모드 (2개의 터미널 필요)

**터미널 1 - 백엔드:**
```bash
npm run server
# 또는
node server/index.js
```

**터미널 2 - 프론트엔드:**
```bash
npm run client
# 또는
cd client && npm start
```

#### 프로덕션 모드

```bash
# 1. 프론트엔드 빌드
npm run build

# 2. 빌드된 파일 제공 (추가 설정 필요)
# Express에서 정적 파일로 제공하거나
# nginx 등으로 제공
```

### 4. 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:5000

## 주요 기능

### 파일 업로드
1. 브라우저에서 http://localhost:3000 접속
2. 파일 선택 버튼 클릭 또는 드래그 앤 드롭
3. 업로드 버튼 클릭

### 지원 파일 형식
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### 파일 크기 제한
- 최대 10MB (환경 변수로 변경 가능)

### API 엔드포인트

#### 파일 업로드 (단일)
```bash
curl -X POST -F "file=@이미지.png" http://localhost:5000/api/upload
```

#### 파일 업로드 (다중)
```bash
curl -X POST -F "files=@이미지1.png" -F "files=@이미지2.png" http://localhost:5000/api/upload-multiple
```

#### 파일 목록 조회
```bash
curl http://localhost:5000/api/files
```

#### 파일 삭제
```bash
curl -X DELETE http://localhost:5000/api/files/파일명.png
```

## 보안 기능

✅ 파일 형식 검증 (이미지만 허용)  
✅ 파일 크기 제한  
✅ 경로 탐색 공격 방지  
✅ Rate Limiting (속도 제한)  
  - 업로드: IP당 15분에 100회  
  - 삭제: IP당 15분에 50회  
  - 조회: IP당 15분에 200회  
✅ 취약점 없는 최신 의존성

## 문제 해결

### 포트가 이미 사용 중인 경우
.env 파일에서 PORT를 변경하세요.

### 업로드 디렉토리 권한 오류
```bash
mkdir uploads
chmod 755 uploads
```

### 의존성 설치 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 기술 스택

- **Backend**: Node.js, Express, Multer, express-rate-limit
- **Frontend**: React 18, Axios
- **보안**: CORS, 파일 검증, Rate Limiting

## 라이선스

ISC
