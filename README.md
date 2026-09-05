# Just-Start 블로그 스킨 리뉴얼

https://jsjin.tistory.com/ 블로그용 **커스텀 Tistory 스킨** 리뉴얼 프로젝트.

심플 + 모던 + 테크니컬한 반응형 블로그 스킨을 목표로 합니다.
(풀스크린 히어로, 터미널 컨셉 스크롤 전환, 사이드바 토글, 다크 모드)

## 저장소 구성

| 경로 | 내용 |
|---|---|
| `plan.md` | 원본 기획 (사용자 작성) |
| `requirements.md` | 요구사항 정의서 |
| `design-direction.md` | 디자인 방향 + 목업 명세 |
| `roadmap.md` | 작업 계획 / 체크리스트 |
| `tistory-skin-guide.md` | 티스토리 스킨 가이드 요약 (치환자 치트시트) |
| `mockup.html` | 디자인 피드백용 목업 (브라우저에서 바로 확인) |
| `src/` | **배포용 스킨 소스** (index.xml / skin.html / style.css / images/) |
| `GIT_WORKFLOW.md` | 이 저장소의 Git/GitHub 운영 규칙 |

## 스킨 적용 방법 (Tistory)

1. `src/` 폴더를 압축(zip)한다.
2. 티스토리 관리자 → 꾸미기 → 스킨 변경 → 직접 올리기에서 업로드.
3. ⚠️ 스킨을 새로 적용하면 **설정이 초기화**되므로 기존 스킨을 먼저 백업한다.

## 개발 흐름

브랜치 / 커밋 규칙은 `GIT_WORKFLOW.md`를 따른다.

- `develop` → `feature/*` → `develop` merge (기능 개발)
- `develop` → `main` merge + `vX.Y.Z` 태그 (배포)