// 구글 이미지 검색을 통해 미션 패치 이미지 찾기
// 각 미션에 대해 "SpaceX [미션명] patch" 또는 "SpaceX [미션명] mission patch"로 검색

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// 구글 Custom Search API를 사용하여 이미지 검색
// Search Engine ID가 없으면 직접 이미지 검색 API 사용 시도
async function searchGoogleImages(query, apiKey = null, searchEngineId = null) {
  if (!apiKey) {
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    return {
      searchUrl: searchUrl,
      images: []
    };
  }

  // Search Engine ID가 있으면 Custom Search API 사용
  if (searchEngineId) {
    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: apiKey,
          cx: searchEngineId,
          q: query,
          searchType: 'image',
          num: 10,
          imgSize: 'large',
          imgType: 'photo',
          safe: 'active'
        }
      });

      const images = response.data.items?.map(item => ({
        url: item.link,
        thumbnail: item.image?.thumbnailLink,
        width: item.image?.width,
        height: item.image?.height,
        size: item.image?.width * item.image?.height
      })).sort((a, b) => (b.size || 0) - (a.size || 0)) || [];

      return {
        searchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
        images: images
      };
    } catch (error) {
      console.error(`  ❌ Custom Search API 오류: ${error.response?.data?.error?.message || error.message}`);
      const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
      return {
        searchUrl: searchUrl,
        images: []
      };
    }
  }

  // Search Engine ID가 없으면 구글 이미지 검색 직접 시도 (웹 스크래핑)
  // 하지만 구글은 봇을 차단하므로, 대신 검색 URL만 반환
  console.warn(`  ⚠️  Search Engine ID가 없습니다. Custom Search API를 사용하려면 Search Engine ID가 필요합니다.`);
  console.warn(`  💡 Search Engine ID 생성: https://programmablesearchengine.google.com/`);
  const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  return {
    searchUrl: searchUrl,
    images: []
  };
}

async function fetchMissionPatches(launches) {
  const results = [];
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  console.log(`총 ${launches.length}개 미션 처리 중...\n`);
  
  for (let i = 0; i < launches.length; i++) {
    const launch = launches[i];
    const cleanName = cleanMissionName(launch.name);
    const searchQuery = generateSearchQuery(launch.name);
    
    console.log(`[${i + 1}/${launches.length}] ${cleanName}`);
    
    const searchResult = await searchGoogleImages(searchQuery, apiKey, searchEngineId);
    
    // 가장 고해상도 이미지 선택
    const bestImage = searchResult.images.length > 0 
      ? searchResult.images[0] 
      : null;
    
    results.push({
      missionName: launch.name,
      cleanName: cleanName,
      searchQuery: searchQuery,
      searchUrl: searchResult.searchUrl,
      imageUrl: bestImage?.url || null,
      imageWidth: bestImage?.width || null,
      imageHeight: bestImage?.height || null,
      imageSize: bestImage?.size || null,
      allImages: searchResult.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        size: img.size
      }))
    });
    
    // API 호출 제한을 피하기 위해 딜레이
    if (apiKey && i < launches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    }
  }
  
  return results;
}

// 메인 실행
async function main() {
  try {
    console.log('SpaceX 미션 데이터 가져오는 중...\n');
    
    // SpaceX API에서 미션 목록 가져오기
    const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/previous/', {
      params: {
        limit: 50,
        lsp__name: 'SpaceX',
        ordering: '-net'
      }
    });
    
    const launches = response.data.results.map(launch => {
      // App.jsx와 동일한 로직으로 패치 확인
      const apiPatch = launch.image || launch.mission_patches?.[0]?.image_url;
      // API 패치가 로켓 이미지가 아닌 실제 패치인지 확인
      const isValidPatch = apiPatch && (
        apiPatch.toLowerCase().includes('patch') || 
        apiPatch.toLowerCase().includes('mission_patch') ||
        apiPatch.toLowerCase().includes('mission-patch')
      ) && !apiPatch.includes('falcon') && !apiPatch.includes('rocket') && !apiPatch.includes('slc_image');
      
      return {
        id: launch.id,
        name: launch.name,
        apiPatch: apiPatch,
        isValidPatch: !!isValidPatch
      };
    });
    
    // 패치가 없거나 유효하지 않은 미션 필터링
    const missionsWithoutPatch = launches.filter(launch => !launch.isValidPatch);
    
    console.log(`총 ${launches.length}개 미션 중 ${missionsWithoutPatch.length}개 미션이 패치가 없습니다.\n`);
    
    if (missionsWithoutPatch.length === 0) {
      console.log('패치가 없는 미션이 없습니다.');
      return;
    }
    
    // 각 미션에 대해 검색 수행
    const searchResults = await fetchMissionPatches(missionsWithoutPatch);
    
    // 결과를 JSON 파일로 저장
    const outputPath = path.join(__dirname, '../googleImageSearchResults.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchResults, null, 2));
    
    console.log(`\n검색 결과가 ${outputPath}에 저장되었습니다.`);
    
    // 요약 출력
    const withImages = searchResults.filter(r => r.imageUrl).length;
    console.log(`\n요약:`);
    console.log(`- 총 ${searchResults.length}개 미션 검색 완료`);
    console.log(`- ${withImages}개 미션에 이미지 URL 발견`);
    console.log(`- ${searchResults.length - withImages}개 미션은 수동 검색 필요`);
    
    // 이미지가 있는 미션 목록
    if (withImages > 0) {
      console.log(`\n이미지가 발견된 미션:`);
      searchResults
        .filter(r => r.imageUrl)
        .forEach((result, index) => {
          console.log(`${index + 1}. ${result.cleanName}`);
          console.log(`   URL: ${result.imageUrl}`);
          console.log(`   크기: ${result.imageWidth}x${result.imageHeight} (${result.imageSize?.toLocaleString()} pixels)`);
        });
    }
    
    // 이미지가 없는 미션 목록
    if (withImages < searchResults.length) {
      console.log(`\n수동 검색이 필요한 미션:`);
      searchResults
        .filter(r => !r.imageUrl)
        .forEach((result, index) => {
          console.log(`${index + 1}. ${result.cleanName}`);
          console.log(`   검색 URL: ${result.searchUrl}`);
        });
    }
    
  } catch (error) {
    console.error('오류 발생:', error.message);
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
    }
  }
}

main();

