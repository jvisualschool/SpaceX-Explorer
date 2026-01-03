// 구글 이미지 검색을 통해 미션 패치 이미지 찾기
// 각 미션에 대해 "SpaceX [미션명] patch" 또는 "SpaceX [미션명] mission patch"로 검색

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 구글 Custom Search API를 사용하거나, 간단한 웹 스크래핑
// 실제로는 구글 이미지 검색 API가 제한적이므로, 대안 방법 사용

// 방법 1: 구글 Custom Search API (API 키 필요)
// 방법 2: 웹 스크래핑 (구글은 봇 차단)
// 방법 3: 수동 검색 결과를 JSON으로 저장

// 임시로 수동 검색 결과를 저장할 구조
const GOOGLE_IMAGE_SEARCH_BASE = 'https://www.google.com/search?tbm=isch&q=';

// 미션 이름을 정리하는 함수
function cleanMissionName(missionName) {
  // "Falcon 9 Block 5 | Starlink Group 10-17" -> "Starlink Group 10-17"
  return missionName
    .replace(/Falcon 9 Block 5 \| /gi, '')
    .replace(/Falcon 9 \| /gi, '')
    .replace(/Falcon Heavy \| /gi, '')
    .replace(/Starship \| /gi, '')
    .trim();
}

// 구글 이미지 검색 쿼리 생성
function generateSearchQuery(missionName) {
  const cleanName = cleanMissionName(missionName);
  // "SpaceX Starlink Group 10-17 mission patch"
  return `SpaceX ${cleanName} mission patch`;
}

// 실제로는 구글 이미지 검색 API를 사용하거나, 
// 웹 스크래핑을 해야 하지만, 구글은 봇을 차단합니다.
// 대신 수동으로 검색한 결과를 저장하는 방식으로 진행

async function fetchMissionPatches(launches) {
  const results = [];
  
  for (const launch of launches) {
    const cleanName = cleanMissionName(launch.name);
    const searchQuery = generateSearchQuery(launch.name);
    const searchUrl = `${GOOGLE_IMAGE_SEARCH_BASE}${encodeURIComponent(searchQuery)}`;
    
    results.push({
      missionName: launch.name,
      cleanName: cleanName,
      searchQuery: searchQuery,
      searchUrl: searchUrl,
      // 실제 이미지 URL은 수동으로 추가하거나, 다른 방법으로 가져와야 함
      imageUrl: null
    });
  }
  
  return results;
}

// 메인 실행
async function main() {
  try {
    // SpaceX API에서 미션 목록 가져오기
    const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/previous/', {
      params: {
        limit: 50,
        lsp__name: 'SpaceX',
        ordering: '-net'
      }
    });
    
    const launches = response.data.results.map(launch => ({
      id: launch.id,
      name: launch.name,
      hasPatch: !!launch.image || !!launch.mission_patches?.[0]?.image_url
    }));
    
    // 패치가 없는 미션만 필터링
    const missionsWithoutPatch = launches.filter(launch => !launch.hasPatch);
    
    console.log(`총 ${launches.length}개 미션 중 ${missionsWithoutPatch.length}개 미션이 패치가 없습니다.`);
    
    // 각 미션에 대해 검색 쿼리 생성
    const searchResults = await fetchMissionPatches(missionsWithoutPatch);
    
    // 결과를 JSON 파일로 저장
    const outputPath = path.join(__dirname, '../googleImageSearchResults.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchResults, null, 2));
    
    console.log(`검색 결과가 ${outputPath}에 저장되었습니다.`);
    console.log('\n각 미션의 검색 URL:');
    searchResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.cleanName}`);
      console.log(`   검색: ${result.searchUrl}`);
    });
    
  } catch (error) {
    console.error('오류 발생:', error.message);
  }
}

main();

