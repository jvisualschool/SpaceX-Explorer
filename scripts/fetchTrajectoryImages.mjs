// SpaceX 미션의 로켓 이동 경로 이미지 찾기
// 예시: https://sxcontent9668.azureedge.us/cms-assets/assets/F9_AUTONOMOUS_DRONESHIP_DESKTOP_8c25a9a0ca.webp

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 미션 이름을 정리하는 함수
function cleanMissionName(missionName) {
  return missionName
    .replace(/Falcon 9 Block 5 \| /gi, '')
    .replace(/Falcon 9 \| /gi, '')
    .replace(/Falcon Heavy \| /gi, '')
    .replace(/Starship \| /gi, '')
    .trim();
}

// 구글 이미지 검색 쿼리 생성 (로켓 이동 경로 이미지)
function generateTrajectorySearchQuery(missionName) {
  const cleanName = cleanMissionName(missionName);
  // "SpaceX [미션명] trajectory" 또는 "SpaceX [미션명] flight path"
  return `SpaceX ${cleanName} trajectory flight path`;
}

// 구글 Custom Search API를 사용하여 이미지 검색
async function searchTrajectoryImages(query, apiKey = null, searchEngineId = null) {
  if (!apiKey) {
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    return {
      searchUrl: searchUrl,
      images: []
    };
  }

  if (!searchEngineId) {
    console.warn(`  ⚠️  Search Engine ID가 없습니다.`);
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    return {
      searchUrl: searchUrl,
      images: []
    };
  }

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
      size: item.image?.width * item.image?.height,
      // sxcontent9668.azureedge.us 도메인 우선
      isSpaceXCDN: item.link.includes('sxcontent') || item.link.includes('spacex.com')
    })).sort((a, b) => {
      // SpaceX CDN 이미지 우선, 그 다음 크기순
      if (a.isSpaceXCDN && !b.isSpaceXCDN) return -1;
      if (!a.isSpaceXCDN && b.isSpaceXCDN) return 1;
      return (b.size || 0) - (a.size || 0);
    }) || [];

    return {
      searchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
      images: images
    };
  } catch (error) {
    console.error(`  ❌ 검색 오류: ${error.response?.data?.error?.message || error.message}`);
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    return {
      searchUrl: searchUrl,
      images: []
    };
  }
}

async function fetchTrajectoryImages(launches) {
  const results = [];
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  console.log(`총 ${launches.length}개 미션 처리 중...\n`);
  
  for (let i = 0; i < launches.length; i++) {
    const launch = launches[i];
    const cleanName = cleanMissionName(launch.name);
    const searchQuery = generateTrajectorySearchQuery(launch.name);
    
    console.log(`[${i + 1}/${launches.length}] ${cleanName}`);
    
    const searchResult = await searchTrajectoryImages(searchQuery, apiKey, searchEngineId);
    
    // 가장 적합한 이미지 선택 (SpaceX CDN 우선, 고해상도)
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
      isSpaceXCDN: bestImage?.isSpaceXCDN || false,
      allImages: searchResult.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        size: img.size,
        isSpaceXCDN: img.isSpaceXCDN
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
    
    const launches = response.data.results.map(launch => ({
      id: launch.id,
      name: launch.name
    }));
    
    console.log(`총 ${launches.length}개 미션을 처리합니다.\n`);
    
    // 각 미션에 대해 검색 수행
    const searchResults = await fetchTrajectoryImages(launches);
    
    // 결과를 JSON 파일로 저장
    const outputPath = path.join(__dirname, '../trajectoryImageSearchResults.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchResults, null, 2));
    
    console.log(`\n검색 결과가 ${outputPath}에 저장되었습니다.`);
    
    // 요약 출력
    const withImages = searchResults.filter(r => r.imageUrl).length;
    const spacexCDNImages = searchResults.filter(r => r.isSpaceXCDN).length;
    console.log(`\n요약:`);
    console.log(`- 총 ${searchResults.length}개 미션 검색 완료`);
    console.log(`- ${withImages}개 미션에 이미지 URL 발견`);
    console.log(`- ${spacexCDNImages}개 미션이 SpaceX CDN 이미지 사용`);
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
          console.log(`   SpaceX CDN: ${result.isSpaceXCDN ? '예' : '아니오'}`);
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

