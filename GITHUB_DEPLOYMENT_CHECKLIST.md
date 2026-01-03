# 🚀 GitHub 배포 체크리스트

GitHub에 배포하기 전에 다음 항목을 확인하세요.

## ✅ 보안 체크

### 1. 민감한 정보 제거
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] SSH 키 파일(`*.pem`, `*.key`)이 `.gitignore`에 포함되어 있는가?
- [ ] README.md에 실제 서버 IP나 경로가 노출되지 않았는가?
- [ ] 코드에 하드코딩된 API 키나 비밀번호가 없는가?
- [ ] `deploy.sh`나 다른 스크립트에 실제 서버 정보가 없는가?

### 2. 파일 검증
```bash
# 하드코딩된 API 키 검색
grep -r "AIzaSy\|api[_-]?key\|secret\|password\|token" --include="*.js" --include="*.jsx" src/ scripts/

# .env 파일이 Git에 포함되지 않았는지 확인
git ls-files | grep -E "\.env|\.pem|\.key"

# 커밋 전 변경사항 확인
git diff --cached
```

## 📁 필수 파일 확인

### 1. .gitignore
다음 항목이 포함되어 있는지 확인:
- `node_modules/`
- `dist/`
- `.env*`
- `*.pem`, `*.key`
- `deploy.zip`
- `.DS_Store`

### 2. README.md
- [ ] 프로젝트 설명이 명확한가?
- [ ] 설치 및 실행 방법이 포함되어 있는가?
- [ ] 기술 스택이 명시되어 있는가?
- [ ] 민감한 정보가 제거되었는가?

### 3. package.json
- [ ] `name`, `version`이 적절한가?
- [ ] `private: true`가 설정되어 있는가? (필요시)
- [ ] 모든 의존성이 올바르게 명시되어 있는가?

## 🔧 프로젝트 설정

### 1. Git 초기화 (아직 안 했다면)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. GitHub 저장소 생성
1. GitHub에서 새 저장소 생성
2. 저장소 URL 확인

### 3. 원격 저장소 연결
```bash
git remote add origin https://github.com/your-username/spacex-explorer.git
git branch -M main
git push -u origin main
```

## 📝 커밋 전 확인사항

### 1. 변경사항 확인
```bash
git status
git diff
```

### 2. 커밋 메시지 작성
명확하고 의미 있는 커밋 메시지를 작성하세요:
```bash
git commit -m "feat: Add splash modal with tech stack info"
git commit -m "fix: Remove sensitive server information from README"
git commit -m "docs: Update README with deployment instructions"
```

### 3. 커밋 전 최종 체크
- [ ] 모든 테스트가 통과하는가?
- [ ] 빌드가 성공하는가? (`npm run build`)
- [ ] 린터 오류가 없는가? (`npm run lint`)

## 🚀 배포 단계

### 1. 로컬 테스트
```bash
npm install
npm run build
npm run preview
```

### 2. Git 커밋 및 푸시
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### 3. GitHub Actions 설정 (선택사항)
`.github/workflows/deploy.yml` 파일을 생성하여 자동 배포를 설정할 수 있습니다.

## ⚠️ 주의사항

1. **공개 저장소**: 공개 저장소에 푸시할 때는 특히 주의하세요
   - 개인 이메일 주소
   - 내부 서버 정보
   - API 키나 토큰

2. **이미 커밋된 민감한 정보**: 
   - 즉시 키/비밀번호 변경
   - Git 히스토리 정리 (`git filter-branch` 또는 `git filter-repo`)
   - GitHub 지원팀에 문의

3. **라이선스**: 
   - `LICENSE` 파일 추가 고려
   - `package.json`에 `license` 필드 추가

## 📚 추가 리소스

- [GitHub 보안 모범 사례](https://docs.github.com/en/code-security)
- [Git 보안 가이드](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
- [Node.js 보안 체크리스트](https://nodejs.org/en/docs/guides/security/)

---

**마지막 업데이트**: 2026-01-01

