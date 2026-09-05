# Git / GitHub 관리 매뉴얼

개인 프로젝트(블로그 스킨, 앱 등)에 적용하는 최소 버전 Git Flow 규칙입니다.
새 프로젝트를 시작하거나, 규칙을 잘 지키고 있는지 확인할 때 이 문서를 기준으로 삼습니다.

---

## 1. 브랜치 구조

### 고정 브랜치 (항상 존재, 삭제 금지)

| 브랜치 | 역할 | 직접 작업 여부 |
|---|---|---|
| `main` | 실제 배포/공개된 안정 버전 | ❌ 직접 커밋 금지, merge로만 반영 |
| `develop` | 다음 버전을 준비하는 통합 작업 공간 | ⚠️ 가능하면 여기도 브랜치 파서 merge |

### 임시 브랜치 (필요할 때 생성 → 다 쓰면 삭제)

| 브랜치 | 어디서 분기 | 어디로 merge | 용도 |
|---|---|---|---|
| `feature/설명` | `develop` | `develop` | 새 기능, 개선 |
| `fix/설명` 또는 `fix/이슈번호-설명` | `develop` | `develop` | 일반 버그 수정 |
| `hotfix/설명` | `main` | `main` **그리고** `develop` 양쪽 | 배포 중인 버전의 긴급 버그 |

> 규칙: 새 이름의 브랜치를 만들 때는 항상 "왜 만드는지"가 이름에 드러나야 함.
> 예: `feature/dark-mode`, `fix/mobile-header-broken`, `hotfix/login-crash`

---

## 2. 작업 흐름

### 2-1. 평소 기능 개발 / 일반 버그 수정

```bash
git checkout develop
git pull

git checkout -b feature/dark-mode
# 작업...
git add .
git commit -m "feat: 다크모드 토글 추가"

git checkout develop
git merge feature/dark-mode
git branch -d feature/dark-mode
git push
```

### 2-2. 배포 (develop → main)

`develop`이 충분히 안정됐다고 판단되면 `main`으로 승격시킵니다.

```bash
git checkout main
git pull
git merge develop
git tag v1.2.0 -m "다크모드 추가"
git push origin main --tags
```

### 2-3. 긴급 버그 수정 (hotfix)

배포된 `main`에서 바로 심각한 문제가 발견됐을 때만 사용합니다.

```bash
git checkout main
git checkout -b hotfix/login-crash
# 수정...
git commit -m "fix: 로그인 크래시 수정"

git checkout main
git merge hotfix/login-crash
git tag v1.2.1

git checkout develop
git merge hotfix/login-crash   # ⚠️ 반드시 develop에도 반영

git branch -d hotfix/login-crash
git push origin main develop --tags
```

**체크포인트: hotfix는 반드시 `main`과 `develop` 양쪽에 merge한다.** (누락 시 다음 배포 때 버그 재발)

---

## 3. 커밋 메시지 컨벤션

```
feat:     새로운 기능
fix:      버그 수정
docs:     문서 수정
style:    코드 포맷/스타일 (기능 변화 없음)
refactor: 리팩토링 (기능 변화 없음)
test:     테스트 코드
chore:    빌드/설정/기타 변경
```

예시:
```
feat: 카테고리 페이지 추가
fix: 모바일 헤더 깨짐 수정 (Closes #3)
```

이슈를 닫으려면 커밋 메시지나 PR 설명에 `Closes #번호`, `Fixes #번호`를 포함합니다. main에 merge되면 해당 이슈가 자동으로 닫힙니다.

---

## 4. 이슈(Issue) 관리

- 버그, 할 일, 아이디어 모두 코드 수정 전에 **이슈로 먼저 등록**
- 라벨 최소 구성: `bug`, `enhancement`, `idea`
- 이슈 제목은 한 줄 요약, 본문에 재현 방법/상세 내용 기록
- 커밋에 `Closes #이슈번호` 붙여서 자동으로 닫히게 습관화

---

## 5. 버전 태깅

`main`에 merge해서 배포할 때마다 태그를 답니다. [시맨틱 버저닝](https://semver.org/lang/ko/) 기준:

```
v주.부.수   예: v1.2.3

주(Major): 기존과 호환 안 되는 큰 변경
부(Minor): 기능 추가 (호환 유지)
수(Patch): 버그 수정
```

```bash
git tag v1.2.0 -m "설명"
git push origin --tags
```

---

## 6. 셀프 체크리스트 (수시로 / AI 검토 요청 시 확인)

아래 항목을 기준으로 저장소 상태나 최근 작업 내역을 점검합니다. AI에게 검토를 요청할 때도 이 리스트를 그대로 기준으로 사용합니다.

- [ ] `main`, `develop` 외에 상시 유지되는 브랜치가 늘어나 있지 않은가?
- [ ] 남아있는 `feature/*`, `fix/*`, `hotfix/*` 브랜치 중 이미 merge된 건 삭제했는가?
- [ ] `main`에 직접 커밋한 흔적이 있는가? (merge 커밋이 아닌 일반 커밋)
- [ ] 최근 hotfix가 `main`에만 merge되고 `develop`에는 빠진 게 없는가?
- [ ] 커밋 메시지가 `feat:`, `fix:` 등 컨벤션을 따르고 있는가?
- [ ] 해결된 버그/기능에 대응하는 이슈가 `Closes #`로 잘 닫혔는가?
- [ ] 배포(main merge) 시점마다 태그(`vX.Y.Z`)를 남겼는가?
- [ ] 열려 있는 이슈 중 방치된 게 없는가?

---

## 7. 하지 않아도 되는 것 (개인 프로젝트 기준)

아래는 팀 규모가 커지거나 자동 배포가 필요해지기 전까지는 굳이 도입하지 않습니다.

- `release/*` 브랜치 (완전한 Git Flow)
- CI/CD (GitHub Actions 등)
- semantic-release 등 버전 자동화 도구
- GitHub Projects 칸반보드
- PR/이슈 템플릿 파일

필요성이 생기면 그때 하나씩 추가합니다.
