// CSV 파일을 분석하여 trajectoryImageSearchResults.json 생성

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
    
    if (values.length >= headers.length) {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index] || '';
      });
      data.push(obj);
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
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const missions = parseCSV(csvContent);
    
    console.log(`총 ${missions.length}개 미션 데이터를 파싱했습니다.\n`);
    
    // trajectoryImageSearchResults.json 형식으로 변환
    const results = missions.map((mission, index) => {
      const missionName = mission['미션명'] || mission['미션명'];
      const trajectoryImageUrl = mission['로켓 이동경로 이미지'] || mission['로켓 이동경로 이미지'] || '';
      const cleanName = cleanMissionName(missionName);
      
      return {
        missionName: missionName,
        cleanName: cleanName,
        searchQuery: `SpaceX ${cleanName} trajectory`,
        searchUrl: `https://www.google.com/search?tbm=isch&q=SpaceX%20${encodeURIComponent(cleanName)}%20trajectory`,
        imageUrl: trajectoryImageUrl || null,
        isSpaceXCDN: trajectoryImageUrl.includes('sxcontent9668.azureedge.us')
      };
    });
    
    // JSON 파일로 저장
    const outputPath = path.join(__dirname, '../trajectoryImageSearchResults.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`trajectoryImageSearchResults.json 파일이 생성되었습니다.`);
    
    // 요약 출력
    const withImages = results.filter(r => r.imageUrl).length;
    const spacexCDNImages = results.filter(r => r.isSpaceXCDN).length;
    
    console.log(`\n요약:`);
    console.log(`- 총 ${results.length}개 미션 처리 완료`);
    console.log(`- ${withImages}개 미션에 이미지 URL 발견`);
    console.log(`- ${spacexCDNImages}개 미션이 SpaceX CDN 이미지 사용`);
    
    // 이미지가 있는 미션 목록
    if (withImages > 0) {
      console.log(`\n이미지가 있는 미션 (처음 10개):`);
      results
        .filter(r => r.imageUrl)
        .slice(0, 10)
        .forEach((result, index) => {
          console.log(`${index + 1}. ${result.cleanName}`);
          console.log(`   URL: ${result.imageUrl}`);
        });
    }
    
  } catch (error) {
    console.error('오류 발생:', error.message);
    console.error(error.stack);
  }
}

main();

