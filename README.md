# 🎨 Art Pick

아트 파일 업로드 및 관리 시스템

## 📋 개요

Art Pick은 이미지 파일을 쉽게 업로드하고 관리할 수 있는 웹 애플리케이션입니다. 드래그 앤 드롭 인터페이스를 통해 직관적으로 파일을 업로드하고, 갤러리 형식으로 파일을 확인할 수 있습니다.

## ✨ 주요 기능

- 📤 **파일 업로드**: 단일 또는 다중 파일 업로드 지원
- 🖱️ **드래그 앤 드롭**: 직관적인 드래그 앤 드롭 인터페이스
- 🖼️ **갤러리 뷰**: 업로드된 이미지를 갤러리 형식으로 표시
- 🗑️ **파일 삭제**: 업로드된 파일 삭제 기능
- 📊 **업로드 진행률**: 실시간 업로드 진행률 표시
- 🔒 **파일 검증**: 이미지 파일 형식 및 크기 검증

## 🛠️ 기술 스택

### Backend
- Node.js
- Express.js
- Multer (파일 업로드)
- CORS

### Frontend
- React 18
- Axios
- CSS3

## 📦 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/so-oyeonii/art-pick.git
cd art-pick
```

### 2. 백엔드 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 설정을 변경하세요
```

### 3. 프론트엔드 설정

```bash
cd client
npm install
```

## 🚀 실행 방법

### 개발 모드

터미널 1 - 백엔드 서버:
```bash
npm run server
```

터미널 2 - 프론트엔드 개발 서버:
```bash
npm run client
```

또는 각각 별도로:

```bash
# 백엔드만 실행
npm start

# 프론트엔드만 실행 (client 디렉토리에서)
cd client && npm start
```

### 프로덕션 빌드

```bash
# 프론트엔드 빌드
npm run build

# 빌드된 파일로 서버 실행
npm start
```

## 🌐 접속

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000

## 📁 프로젝트 구조

```
art-pick/
├── server/
│   └── index.js          # Express 서버 및 API
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── FileUpload.js      # 파일 업로드 컴포넌트
│       │   ├── FileUpload.css
│       │   ├── FileGallery.js     # 파일 갤러리 컴포넌트
│       │   └── FileGallery.css
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
├── uploads/              # 업로드된 파일 저장 디렉토리
├── package.json
├── .env.example
└── README.md
```

## 🔧 환경 변수

`.env` 파일에서 다음 환경 변수를 설정할 수 있습니다:

```env
PORT=5000                    # 서버 포트
UPLOAD_DIR=./uploads         # 파일 저장 디렉토리
MAX_FILE_SIZE=10485760      # 최대 파일 크기 (바이트, 기본값: 10MB)
```

## 📝 API 엔드포인트

### GET /
- 서버 상태 확인

### POST /api/upload
- 단일 파일 업로드
- Body: FormData (key: `file`)

### POST /api/upload-multiple
- 다중 파일 업로드 (최대 10개)
- Body: FormData (key: `files`)

### GET /api/files
- 업로드된 파일 목록 조회

### DELETE /api/files/:filename
- 특정 파일 삭제

## 🎨 사용 방법

1. **파일 선택**: "파일 선택" 버튼을 클릭하거나 드래그 앤 드롭 영역에 파일을 드롭합니다
2. **업로드**: 선택한 파일을 확인하고 "업로드" 버튼을 클릭합니다
3. **확인**: 업로드된 파일이 갤러리에 표시됩니다
4. **삭제**: 각 파일의 삭제 버튼을 클릭하여 파일을 삭제할 수 있습니다

## 🔒 보안 고려사항

- 이미지 파일만 업로드 가능 (JPEG, PNG, GIF, WebP)
- 파일 크기 제한 (기본값: 10MB)
- 파일명 중복 방지 (타임스탬프 기반 고유 파일명 생성)

## 🤝 기여

Pull Request는 언제나 환영합니다!

## 📄 라이선스

ISC

## 👤 작성자

so-oyeonii