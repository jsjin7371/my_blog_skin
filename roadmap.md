# 작업 계획 (Roadmap)

> 요구사항: [requirements.md](requirements.md) · 디자인: [design-direction.md](design-direction.md)
> 참조: [tistory-skin-guide.md](tistory-skin-guide.md)

## Phase 0. 준비 및 백업

- [ ] 현재 'Just-Start' 스킨 **백업 다운로드** (관리자 > 꾸미기 > 스킨 변경 > 저장)
- [ ] 광고 설정(애드센스 위치/코드) 캡처 기록
- [ ] index.xml에서 스킨명/기본 설정(contentWidth, entriesOnPage 등) 정의
- [ ] 폰트 로딩 방식 결정 (CDN vs images 폴더 내장)

## Phase 1. 설계 확정

- [x] 사이드바 방식 결정 → **토글** (데스크톱 접기/펼치기 + 모바일 드로어) (2026-09-04)
- [ ] `mockup.html` 목업 사용자 검토 → 피드백 반영 (홈/글/목록, 반응형 확인)
- [ ] 남은 미확정 사항 결정 (홈 커버, 다크모드, 포인트 컬러)
- [ ] 사이드바 위젯 최종 목록 선정
- [ ] 카테고리 재편 시나리오 정리 (적용 이후 카테고리 구조 변경 시에도 레이아웃 유지 — 치환자 기반 설계)

## Phase 2. skin.html 뼈대 ✅ (2026-09-04 1차 작성 완료 — src/skin.html)

- [x] 공통 골격: `<s_t3>`, `[##_body_id_##]`, head/body 기본 구조
- [x] 헤더(로고, `[##_blog_menu_##]`) + 푸터
- [x] 홈 히어로(풀스크린, 광고 없음) — `#tt-body-index`에서만 표시
- [x] 글 화면: `s_article_rep`(index/permalink 분기), 본문 `[##_article_rep_desc_##]`, 관련글, 이전/다음 글, 댓글 `s_rp`
- [x] 목록: `s_list`(카테고리/태그/검색/보관함) + 페이징 `s_paging`
- [x] 사이드바 위젯: 검색/카테고리/방문자수/최근 글/최근 댓글 (`s_sidebar_element`)
- [x] 방명록 `s_guest`, 태그 클라우드 `s_tag`, 공지사항 `s_notice_rep`, 보호글, 페이지, 위치로그
- [x] **광고 치환자 3종 배치 확인** (`revenue_list_upper/lower` — 홈에서는 CSS로 숨김)

## Phase 3. style.css 스타일링 ✅ (2026-09-04 1차 작성 완료 — src/style.css)

- [x] 디자인 토큰(CSS 변수): 컬러/폰트/간격
- [x] 본문 타이포그래피 (.entry: 표, 인용, 목록, 코드, 테이블)
- [x] 코드 블록 스타일 (다크 테마)
- [x] 목록 카드, 헤더, 푸터, 사이드바
- [x] 댓글/방명록 폼
- [x] 다크 모드 변수 오버라이드
- [ ] 1차 적용 후 실제 데이터 기반 미세 조정 (예정)

## Phase 4. 반응형 및 인터랙션

- [ ] 브레이크포인트 대응 (360/768/1024/1280)
- [x] 사이드바 토글 JS: 데스크톱 접기/펼치기(상태 localStorage 저장·복원) + 모바일 드로어 + 오버레이 (src/images/script.js)
- [x] 다크 모드 토글 JS (localStorage 저장)
- [x] 홈 히어로/스크롤 전환 애니메이션 (anime.min.js 로컬 포함 — src/images/)
- [ ] 스크롤 헤더, 스무스 스크롤 등 소소한 인터랙션
- [ ] 홈 화면 애니메이션 정식 구현 — anime.js 히어로/카드 등장/카운트업/패럴랙스 (목업 검증 후, 스크립트는 images/ 로컬화)
- [ ] 다크 모드 토글 — 목업 구현 완료, 검수 진행 중 (헤더 토글 · CSS 변수 오버라이드 · localStorage)

## Phase 5. 테스트 및 적용

- [ ] 테스트 블로그(또는 백업 상태)에 적용 후 전 페이지 검증
  - [ ] 홈 / 글 / 카테고리 / 태그 / 검색 / 보관함 / 방명록
  - [ ] 댓글 작성·삭제 동작
- [ ] **광고 노출 확인** (본문 상/하, 목록 상/하, 사이드바)
- [ ] 모바일 실기기 확인 (iOS Safari / Android Chrome)
- [ ] 기존 글 3~5개 샘플 (코드 많은 글, 이미지 많은 글, 표 있는 글)
- [ ] Lighthouse 측정 (성능/SEO/접근성)
- [ ] 본 블로그 적용 → 스킨 설정 초기화 재설정
- [ ] preview 이미지 제작 (preview.gif, 256/560/1600)
- [ ] **카테고리 재편 적용 후 재검증** (새 카테고리에서 목록/레이아웃/메뉴 정상 노출)

## 진행 규칙

- 작업 결과물은 `src/` 폴더에서 개발 후, 배포 시 폴더명 `SKIN` 구조로 정리.
- 커밋/문서는 이 폴더에서 관리.
- 치환자 구조 변경 시 [tistory-skin-guide.md](tistory-skin-guide.md)와 원문 교차 확인.
