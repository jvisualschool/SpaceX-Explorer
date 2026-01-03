// googleImageSearchResults.json의 결과를 missionPatches.js에 추가하는 스크립트

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// googleImageSearchResults.json 읽기
const resultsPath = path.join(__dirname, '../googleImageSearchResults.json');
const missionPatchesPath = path.join(__dirname, '../src/utils/missionPatches.js');

if (!fs.existsSync(resultsPath)) {
  console.error('googleImageSearchResults.json 파일을 찾을 수 없습니다.');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
const missionPatchesContent = fs.readFileSync(missionPatchesPath, 'utf-8');

// 이미지 URL이 있는 결과만 필터링
const resultsWithImages = results.filter(r => r.imageUrl);

if (resultsWithImages.length === 0) {
  console.log('이미지 URL이 있는 결과가 없습니다.');
  console.log('구글 Custom Search API 키를 설정하거나, 수동으로 googleImageSearchResults.json에 이미지 URL을 추가하세요.');
  process.exit(0);
}

console.log(`${resultsWithImages.length}개 미션에 이미지 URL이 있습니다.`);

// missionPatches.js에 추가할 매핑 생성
const newMappings = [];

resultsWithImages.forEach(result => {
  const cleanName = result.cleanName;
  // PATCH_MAPPING에 추가할 형식
  newMappings.push({
    key: cleanName,
    url: result.imageUrl,
    width: result.imageWidth,
    height: result.imageHeight
  });
});

// missionPatches.js 파일에 GOOGLE_IMAGE_MAPPING 추가
const googleImageMapping = `\n// 구글 이미지 검색으로 찾은 패치 이미지\nconst GOOGLE_IMAGE_MAPPING = {\n${newMappings.map(m => `  '${m.key}': '${m.url}', // ${m.width}x${m.height}`).join('\n')}\n};\n`;

// getMissionPatchUrl 함수 수정하여 GOOGLE_IMAGE_MAPPING도 확인하도록
const updatedContent = missionPatchesContent.replace(
  /return { url: null, isStarlink: false, colors: null };/,
  `  // 구글 이미지 검색 결과 확인\n  if (GOOGLE_IMAGE_MAPPING[cleanName]) {\n    return {\n      url: GOOGLE_IMAGE_MAPPING[cleanName],\n      isStarlink: false,\n      colors: null\n    };\n  }\n\n  return { url: null, isStarlink: false, colors: null };`
);

// GOOGLE_IMAGE_MAPPING 추가
const finalContent = updatedContent.replace(
  /const BASE_URL = 'https:\/\/www\.elonx\.net\/wp-content\/uploads';/,
  `const BASE_URL = 'https://www.elonx.net/wp-content/uploads';${googleImageMapping}`
);

fs.writeFileSync(missionPatchesPath, finalContent);

console.log(`\nmissionPatches.js 파일이 업데이트되었습니다.`);
console.log(`${newMappings.length}개 미션의 이미지 URL이 추가되었습니다.`);

