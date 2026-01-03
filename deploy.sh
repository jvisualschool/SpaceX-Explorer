#!/bin/bash

# SCP 배포 스크립트
# 사용법: ./deploy.sh [서버주소] [사용자명] [원격경로]

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 서버 정보 설정
SERVER="${1:-your-server.com}"
USER="${2:-your-username}"
REMOTE_PATH="${3:-/path/to/your/app}"

echo -e "${YELLOW}=== SpaceX 추적기 SCP 배포 ===${NC}"
echo -e "서버: ${GREEN}${USER}@${SERVER}${NC}"
echo -e "원격 경로: ${GREEN}${REMOTE_PATH}${NC}"
echo ""

# 수정된 파일 목록
FILES=(
  "src/App.jsx"
  "src/utils/missionPatches.js"
)

# 배포할 파일 확인
echo -e "${YELLOW}배포할 파일:${NC}"
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${RED}✗${NC} $file (파일을 찾을 수 없습니다)"
    exit 1
  fi
done
echo ""

# 배포 실행
echo -e "${YELLOW}배포 중...${NC}"
for file in "${FILES[@]}"; do
  echo -e "업로드 중: ${GREEN}$file${NC}"
  scp "$file" "${USER}@${SERVER}:${REMOTE_PATH}/${file}"
  if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} 성공"
  else
    echo -e "  ${RED}✗${NC} 실패"
    exit 1
  fi
done

echo ""
echo -e "${GREEN}=== 배포 완료 ===${NC}"

