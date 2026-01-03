# 🚀 SpaceX Explorer (SpaceX 발사 추적기)

고해상도 인터랙티브 지구본을 통해 최근 SpaceX 미션을 실시간 3D로 시각화한 프로젝트입니다. SpaceX API에서 실시간 데이터를 가져와 발사 궤적, 로켓 이동, 그리고 상세 미션 정보를 영화 같은 경험으로 제공합니다.

**배포된 사이트:** [https://jvibeschool.org/SPACEX/](https://jvibeschool.org/SPACEX/)

![Project Preview](https://via.placeholder.com/800x450?text=SpaceX+Explorer+Preview)

## ✨ 주요 기능

### 핵심 기능
*   **실시간 데이터 연동**: [SpaceX API v4](https://github.com/r-spacex/SpaceX-API)를 통해 최근 50개의 발사 정보를 실시간으로 가져옵니다.
*   **3D 지구본 시각화**: 
    *   NASA Blue Marble 텍스처와 Night Sky 배경을 적용한 고품질 렌더링.
    *   대기(Atmosphere) 글로우 효과 및 조명 효과 적용.
*   **동적 궤적 생성**:
    *   **D3.js** 지리 공간 보간(geo-interpolation)을 사용하여 발사장부터 궤도/착륙지점까지의 경로를 계산합니다.
    *   베지어 곡선(Arc)을 활용하여 부드러운 비행 궤적을 시각화했습니다.
*   **커스텀 3D 로켓 모델**:
    *   **Three.js** 기본 도형(Primitives)을 조합하여 Falcon 9 스타일의 로켓을 절차적으로 생성했습니다.
    *   로켓이 곡선 경로를 따라 이동할 때 진행 방향에 맞춰 실시간으로 회전합니다.

### 인터랙티브 UI 기능
*   **속도 조절**: 0.1배속(슬로우 모션)부터 5.0배속까지 시뮬레이션 속도 조절 가능.
*   **미션 필터링**: 개별 발사 궤적을 켜거나 끌 수 있는 선택 기능 제공.
*   **상세 미션 모달**: 
    *   미션 패치 이미지 (API 또는 커스텀 매핑)
    *   로켓 제원 및 발사 정보
    *   탑재체(Payload) 정보
    *   공식 영상 (YouTube 임베드)
    *   공식 웹사이트 링크
    *   외부 검색 링크 (Google, Images, YouTube)
    *   Glassmorphism 스타일의 모던한 디자인
*   **미션 목록 표시**:
    *   패치가 있는 미션은 별(⭐) 아이콘으로 표시
    *   날짜별 정렬 (최신순)
    *   미션별 선택 및 상세 정보 보기
*   **스플래시 모달**:
    *   앱 정보 및 기술 스택 소개
    *   개발자 정보 및 프로젝트 상세
    *   상단 좌측 로켓 아이콘 클릭으로 열기
*   **다국어 지원**: 한국어/영어 전환 기능

## 🛠 기술 스택 (Tech Stack)

### 프레임워크 및 빌드
*   **React 19**: UI 컴포넌트 아키텍처.
*   **Vite**: 초고속 빌드 및 개발 환경을 위한 차세대 프론트엔드 툴.

### 3D 및 시각화
*   **Three.js**: 커스텀 로켓 메쉬 생성 및 씬(Scene) 관리를 위한 로우 레벨 3D 라이브러리.
*   **react-globe.gl**: Three.js 기반으로 지구본 렌더링, 좌표 변환, 레이어(Arc, Points, Rings) 관리를 담당하는 React 컴포넌트.
*   **D3.js**: 비행 경로상의 좌표 보간 및 부드러운 애니메이션 계산을 위한 수학/지리 라이브러리 (`d3-geo`).

### 데이터 및 유틸리티
*   **Axios**: SpaceX API 비동기 통신 처리.
*   **lucide-react**: 아이콘 라이브러리 (Rocket, Info, Star, ExternalLink 등).
*   **CSS3**: 외부 UI 라이브러리 없이 Native CSS 변수와 Glassmorphism 스타일링 구현.

## 📁 프로젝트 구조

```
spacex-viz/
├── src/
│   ├── api/
│   │   └── spacex.js          # SpaceX API 통신 모듈
│   ├── components/
│   │   └── GlobeViz.jsx       # 3D 지구본 시각화 컴포넌트
│   ├── utils/
│   │   ├── missionPatches.js  # 미션 패치 URL 매핑
│   │   └── missionData.js     # 미션별 데이터 (영상, 궤적 이미지, 공식 웹사이트)
│   ├── App.jsx                # 메인 애플리케이션 컴포넌트
│   ├── App.css                # 애플리케이션 스타일
│   ├── index.css              # 글로벌 스타일
│   └── main.jsx               # 애플리케이션 진입점
├── public/
│   ├── splash.jpg             # 스플래시 모달 이미지
│   ├── patches.jpg            # 패치 이미지
│   └── rocket-icon.svg        # 로켓 아이콘
├── scripts/                   # 유틸리티 스크립트
├── dist/                      # 빌드 출력 디렉토리
├── package.json
├── vite.config.js             # Vite 설정 (base: '/SPACEX/')
└── README.md
```

## 🧩 구현 상세 (Implementation Details)

### 1. 데이터 페칭 (Data Fetching)
SpaceX API의 `/launches/query` 엔드포인트를 MongoDB 스타일의 쿼리로 호출하여, 발사 정보(Launch) 내에 로켓(Rocket)과 발사장(Launchpad) 정보가 포함된 중첩 데이터를 한 번에 가져옵니다.

**주요 데이터:**
- 최근 50개 미션 정보
- 로켓 타입 및 제원
- 발사장 위치 및 좌표
- 탑재체(Payload) 정보
- 미션 패치 이미지 URL
- 발사 결과 (성공/실패)

### 2. 궤적 계산 (Trajectory Calculation)
모든 비행의 실시간 텔레메트리 데이터가 공개되지 않으므로 시각화를 위해 다음과 같이 구현했습니다:
*   **발사장 좌표**를 시작점으로 설정합니다.
*   미션 프로필에 기반하거나 난수 시드(Seed)를 사용하여 **착륙/궤도 진입 지점**을 시뮬레이션합니다.
*   `d3.geoInterpolate`함수를 사용해 두 지점 사이의 구면(Sphere) 경로를 계산하여 자연스러운 곡선을 만듭니다.

### 3. 애니메이션 루프 (The Animation Loop)
단순 CSS 애니메이션 대신 `requestAnimationFrame`을 사용한 커스텀 루프를 돌립니다:
*   **시간 제어**: `speed` 상태값을 통해 시간의 흐름(delta time)을 가속하거나 감속합니다.
*   **위치 계산**: 매 프레임마다 로켓의 진행률 `t` (0~1)를 계산하고, 해당 위치의 좌표를 갱신합니다.
*   **방향 동기화**: 현재 위치보다 `t + 0.01`만큼 앞선 지점을 미리 계산하여 바라보게 함으로써(`lookAt`), 로켓의 헤드가 항상 진행 방향을 향하도록 구현했습니다.

### 4. 미션 패치 표시 (Mission Patches)
*   **우선순위**: API에서 제공하는 `patch.small` 이미지를 우선적으로 사용합니다.
*   **검증 로직**: API 패치가 실제 미션 패치인지 확인 (로켓 이미지가 아닌 실제 패치인지 필터링).
*   **동적 배지**: Starlink 미션의 경우 동적으로 배지 생성.
*   **별 표시**: 미션 목록에서 패치가 있는 미션은 별(⭐) 아이콘으로 표시.

### 5. 미션 데이터 관리
`src/utils/missionData.js`에서 미션별 추가 데이터를 관리합니다:
*   **공식 영상**: YouTube 비디오 ID 매핑
*   **궤적 이미지**: 로켓 이동 경로 이미지 URL
*   **공식 웹사이트**: SpaceX 공식 미션 페이지 링크
*   **미션 이름 매칭**: 다양한 미션 이름 형식 지원 (Starlink Group X-Y, NROL-X, CRS-X 등)

## 📦 시작하기 (Getting Started)

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

1.  **저장소 클론**
    ```bash
    git clone https://github.com/your-username/spacex-viz.git
    cd spacex-viz
    ```

2.  **패키지 설치**
    ```bash
    npm install
    ```

3.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

4.  브라우저에서 `http://localhost:5173` 접속.

### 빌드

프로덕션 빌드를 생성하려면:
```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

로컬에서 빌드 결과를 미리 확인하려면:
```bash
npm run preview
```

## 🚀 배포 방법 (Deployment)

### 프로덕션 빌드

1. **빌드 실행**
   ```bash
   npm run build
   ```
   이 명령어는 `dist/` 폴더에 최적화된 프로덕션 빌드를 생성합니다.

2. **로컬 프리뷰 (선택사항)**
   ```bash
   npm run preview
   ```
   빌드된 파일을 로컬에서 미리 확인할 수 있습니다.

### 서버 배포

프로젝트는 서브디렉토리(`/SPACEX/`)에서 동작하도록 설정되어 있습니다 (`vite.config.js`의 `base: '/SPACEX/'`).

#### 전체 빌드 배포

**배포 단계:**

1. `npm run build` 실행하여 `dist/` 폴더 생성
2. 서버의 `/SPACEX/` 디렉토리에 `dist/` 폴더의 내용 업로드
3. 웹 서버가 `index.html`을 제공하도록 설정

**배포된 사이트:** [https://jvibeschool.org/SPACEX/](https://jvibeschool.org/SPACEX/)

**전체 배포 명령어 (예시):**
```bash
# 빌드
npm run build

# SCP로 배포 (예시)
# 환경 변수나 설정 파일에서 서버 정보를 가져오는 것을 권장합니다
scp -i ~/.ssh/your-key.pem -r dist/* user@your-server.com:/path/to/SPACEX/
```

#### 수정된 파일만 SCP로 배포

개발 중 수정된 소스 파일만 서버에 배포하는 방법:

**방법 1: 배포 스크립트 사용**
```bash
./deploy.sh [서버주소] [사용자명] [원격경로]
```

예시:
```bash
./deploy.sh your-server.com username /var/www/html/SPACEX
```

**방법 2: 직접 SCP 명령어 사용**
```bash
# 수정된 파일만 업로드
scp src/App.jsx src/utils/missionPatches.js username@your-server.com:/path/to/SPACEX/src/

# 또는 전체 src 디렉토리 구조 유지하며 업로드
scp -r src/App.jsx src/utils/missionPatches.js username@your-server.com:/path/to/SPACEX/
```

**주의사항:**
- 소스 파일만 배포하는 경우, 서버에서 `npm run build`를 다시 실행해야 합니다
- 또는 서버에 개발 환경이 설정되어 있어야 합니다
- 프로덕션 환경에서는 빌드된 `dist/` 폴더를 배포하는 것이 권장됩니다

### 배포 서버 설정

**⚠️ 보안 주의사항:**
- 서버 정보는 환경 변수나 별도의 설정 파일로 관리하는 것을 권장합니다
- SSH 키나 비밀번호는 절대 Git 저장소에 커밋하지 마세요
- `.env` 파일을 사용하여 민감한 정보를 관리하세요

**예시 설정 파일 구조:**
```bash
# .env.local (Git에 커밋하지 않음)
DEPLOY_SERVER=your-server.com
DEPLOY_USER=username
DEPLOY_PATH=/path/to/SPACEX
SSH_KEY_PATH=~/.ssh/your-key.pem
```

### 주의사항

- 서버의 URL 구조가 `/SPACEX/`와 일치해야 합니다
- 모든 정적 파일(JS, CSS, 이미지 등)이 올바른 경로로 로드되도록 확인하세요
- SPA(Single Page Application)이므로 서버에서 모든 경로를 `index.html`로 리다이렉트하도록 설정해야 할 수 있습니다
- `splash.jpg` 및 기타 정적 파일은 `public/` 폴더에 위치해야 하며, 빌드 시 `dist/` 폴더로 복사됩니다

## 🎨 주요 UI 컴포넌트

### 미션 모달
- **좌측 컬럼**: 미션 패치, 로켓 정보, 탑재체, 공식 웹사이트 링크, 외부 검색 링크
- **우측 컬럼**: 공식 영상, LOCATION 정보
- **스타일**: Glassmorphism 디자인, 반투명 배경, 블러 효과

### 스플래시 모달
- **이미지**: SpaceX 미션 컨트롤 이미지
- **앱 정보**: 프로젝트 이름, 설명
- **기술 스택**: 각 기술에 대한 링크 포함
- **개발자 정보**: 프로젝트 상세, 버전, 데이터 소스, 개발자 연락처

### 미션 목록
- **별 표시**: 패치가 있는 미션에 별(⭐) 아이콘 표시
- **인터랙션**: 
  - 로켓 아이콘: 미션 선택/해제
  - 정보 아이콘: 상세 모달 열기

## 🔧 개발 팁

### 로컬 개발
- 개발 서버는 `http://localhost:5173`에서 실행됩니다
- Vite의 HMR(Hot Module Replacement)을 통해 코드 변경 시 자동으로 반영됩니다

### 디버깅
- 브라우저 콘솔에서 SpaceX API 응답 확인 가능
- 미션 데이터 매칭 로직은 `src/utils/missionData.js`에서 확인 가능

### 성능 최적화
- 대용량 번들 경고가 발생할 수 있으나, 프로덕션 빌드에서는 최적화됩니다
- 필요시 코드 스플리팅을 고려할 수 있습니다

## 📝 라이선스

MIT License

## 👨‍💻 개발자

**Jinho Jung**
- Email: [jvisualschool@gmail.com](mailto:jvisualschool@gmail.com)

---

*Built with ❤️ for Space Exploration*
