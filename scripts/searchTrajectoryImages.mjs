// 각 미션에 대해 웹 검색을 통해 로켓 이동 경로 이미지 찾기
// SpaceX CDN 이미지 (sxcontent9668.azureedge.us) 우선 검색

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

// SpaceX CDN 이미지 URL 패턴 시도
// 예: https://sxcontent9668.azureedge.us/cms-assets/assets/F9_AUTONOMOUS_DRONESHIP_DESKTOP_8c25a9a0ca.webp
function generateSpaceXCDNUrl(cleanName) {
  // 미션 이름을 파일명 형식으로 변환
  const fileName = cleanName
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .toUpperCase();
  
  // 일반적인 패턴 시도
  const patterns = [
    `F9_${fileName}_DESKTOP`,
    `F9_${fileName}_TRAJECTORY`,
    `F9_${fileName}`,
    `${fileName}_DESKTOP`,
    `${fileName}_TRAJECTORY`
  ];
  
  return patterns.map(pattern => 
    `https://sxcontent9668.azureedge.us/cms-assets/assets/${pattern}.webp`
  );
}

// 이미지 URL이 유효한지 확인
async function validateImageUrl(url) {
  try {
    const response = await axios.head(url, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
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
    
    const results = [];
    
    for (let i = 0; i < launches.length; i++) {
      const launch = launches[i];
      const cleanName = cleanMissionName(launch.name);
      
      console.log(`[${i + 1}/${launches.length}] ${cleanName}`);
      
      // SpaceX CDN URL 패턴 시도
      const cdnUrls = generateSpaceXCDNUrl(cleanName);
      let foundUrl = null;
      
      for (const url of cdnUrls) {
        const isValid = await validateImageUrl(url);
        if (isValid) {
          foundUrl = url;
          console.log(`  ✓ 이미지 발견: ${url}`);
          break;
        }
      }
      
      if (!foundUrl) {
        console.log(`  ⚠️  이미지를 찾지 못했습니다. 수동 검색 필요.`);
      }
      
      results.push({
        missionName: launch.name,
        cleanName: cleanName,
        searchQuery: `SpaceX ${cleanName} trajectory`,
        searchUrl: `https://www.google.com/search?tbm=isch&q=SpaceX%20${encodeURIComponent(cleanName)}%20trajectory`,
        imageUrl: foundUrl,
        isSpaceXCDN: !!foundUrl
      });
      
      // 요청 제한을 피하기 위해 딜레이
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 결과를 JSON 파일로 저장
    const outputPath = path.join(__dirname, '../trajectoryImageSearchResults.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`\n검색 결과가 ${outputPath}에 저장되었습니다.`);
    
    // 요약 출력
    const withImages = results.filter(r => r.imageUrl).length;
    console.log(`\n요약:`);
    console.log(`- 총 ${results.length}개 미션 처리 완료`);
    console.log(`- ${withImages}개 미션에 이미지 URL 발견`);
    console.log(`- ${results.length - withImages}개 미션은 수동 검색 필요`);
    
  } catch (error) {
    console.error('오류 발생:', error.message);
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
    }
  }
}

main();

