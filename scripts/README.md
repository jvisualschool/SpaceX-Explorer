# 구글 이미지 검색 스크립트

## 개요
미션 패치가 없는 SpaceX 미션에 대해 구글 이미지 검색을 통해 고해상도 패치 이미지를 찾는 스크립트입니다.

## 사용 방법

### 1. 구글 Custom Search API 설정 (권장)

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. Custom Search API 활성화
3. API 키 생성
4. [Programmable Search Engine](https://programmablesearchengine.google.com/)에서 검색 엔진 생성
   - 검색할 사이트: 전체 웹
   - 이미지 검색 활성화

### 2. 환경 변수 설정

```bash
export GOOGLE_API_KEY="your-api-key"
export GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"
```

### 3. 스크립트 실행

```bash
node scripts/fetchGoogleImages.mjs
```

## 결과

스크립트 실행 후 `googleImageSearchResults.json` 파일이 생성됩니다.

각 미션에 대해:
- 검색 쿼리
- 검색 URL
- 발견된 이미지 URL (API 키가 있는 경우)
- 이미지 크기 정보

## 수동 검색

API 키가 없는 경우, 생성된 검색 URL을 사용하여 수동으로 이미지를 찾아 `googleImageSearchResults.json` 파일에 추가할 수 있습니다.

## 다음 단계

1. `googleImageSearchResults.json` 파일에서 이미지 URL 확인
2. `src/utils/missionPatches.js` 파일에 매핑 추가
3. 또는 자동으로 매핑을 추가하는 스크립트 실행

