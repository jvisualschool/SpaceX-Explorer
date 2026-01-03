// CSV 파일에서 올바른 공식 웹페이지 URL을 추출하여 missionData.js 수정

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV 파일 읽기 및 파싱
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSV 파싱 (쉼표로 구분, 따옴표 처리)
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    // CSV 구조: 미션명, 패치URL, 이미지URL, 동영상URL, 공식웹페이지, 이동경로이미지
    if (values.length >= 6) {
      data.push({
        name: values[0],
        website: values[4] // 공식 웹페이지는 5번째 컬럼 (인덱스 4)
      });
    }
  }
  
  return data;
}

// 미션 이름 정리
function cleanMissionName(missionName) {
  return missionName
    .replace(/Falcon 9 Block 5 \| /gi, '')
    .replace(/Falcon 9 \| /gi, '')
    .replace(/Falcon Heavy \| /gi, '')
    .replace(/Starship \| /gi, '')
    .trim();
}

// 메인 실행
async function main() {
  try {
    const csvPath = path.join(__dirname, '../missions_info_final.csv');
    const missionDataPath = path.join(__dirname, '../src/utils/missionData.js');
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const missions = parseCSV(csvContent);
    
    let missionDataContent = fs.readFileSync(missionDataPath, 'utf-8');
    
    console.log(`총 ${missions.length}개 미션 데이터 처리 중...\n`);
    
    let updatedCount = 0;
    
    for (const mission of missions) {
      const cleanName = cleanMissionName(mission.name);
      const website = mission.website;
      
      // 유효한 웹사이트 URL인지 확인 (spacex.com 또는 다른 유효한 도메인)
      if (!website || 
          website === 'https://spacexpatchlist.space' || 
          website.includes('sxcontent9668.azureedge.us') ||
          website.includes('.webp')) {
        continue;
      }
      
      // missionData.js에서 해당 미션 찾기
      // officialWebsite 필드를 찾아서 교체
      const escapedName = cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // 패턴 1: officialWebsite가 이미 있는 경우 교체
      const replacePattern1 = new RegExp(
        `('${escapedName}':\\s*{[^}]*officialWebsite:\\s*')[^']*(')`,
        'g'
      );
      
      if (missionDataContent.match(replacePattern1)) {
        missionDataContent = missionDataContent.replace(
          replacePattern1,
          `$1${website}$2`
        );
        updatedCount++;
        console.log(`✓ ${cleanName}: ${website}`);
        continue;
      }
      
      // 패턴 2: officialWebsite가 없는 경우 추가
      const addPattern = new RegExp(
        `('${escapedName}':\\s*{[^}]*trajectoryImage:[^,}]+)([^}]*})`,
        'g'
      );
      
      if (missionDataContent.match(addPattern)) {
        missionDataContent = missionDataContent.replace(
          addPattern,
          `$1,\n    officialWebsite: '${website}'$2`
        );
        updatedCount++;
        console.log(`✓ ${cleanName} (추가): ${website}`);
      } else {
        // 부분 매칭 시도
        const partialPattern = new RegExp(
          `('${cleanName.split(' ')[0]}.*?':\\s*{[^}]*trajectoryImage:[^,}]+)([^}]*})`,
          'g'
        );
        if (missionDataContent.match(partialPattern)) {
          missionDataContent = missionDataContent.replace(
            partialPattern,
            `$1,\n    officialWebsite: '${website}'$2`
          );
          updatedCount++;
          console.log(`✓ ${cleanName} (부분 매칭): ${website}`);
        }
      }
    }
    
    // 중복된 officialWebsite 제거 (Flight 11 같은 경우)
    missionDataContent = missionDataContent.replace(
      /officialWebsite:\s*'[^']*',\s*officialWebsite:\s*'[^']*'/g,
      (match) => {
        const urls = match.match(/'([^']+)'/g);
        // spacex.com URL을 우선 선택
        const spacexUrl = urls.find(url => url.includes('spacex.com'));
        return spacexUrl ? `officialWebsite: ${spacexUrl}` : `officialWebsite: ${urls[0]}`;
      }
    );
    
    fs.writeFileSync(missionDataPath, missionDataContent);
    
    console.log(`\n총 ${updatedCount}개 미션의 공식 웹페이지가 수정되었습니다.`);
    
  } catch (error) {
    console.error('오류 발생:', error.message);
    console.error(error.stack);
  }
}

main();

