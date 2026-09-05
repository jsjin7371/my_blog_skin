# 티스토리 스킨 가이드 요약 (개발 치트시트)

> 공식 문서: https://tistory.github.io/document-tistory-skin/
> 개발 중 빠르게 찾아보기 위한 요약본입니다. 원문 우선.

## 1. 문서 목차 (원문 링크)

- 소개: `/` · 파일 구조: `/common/files.html` · 스킨 정보 파일: `/common/index.xml.html`
- 치환자 구조: `/common/basic.html` · 공통 치환자: `/common/global.html`
- 나머지 치환자 문서: 홈 커버 / 스킨 옵션 / 컨텐츠 / 태그 클라우드 / 방명록 / 글 / 댓글 / 공지사항 / 보호글 / 페이지 / 리스트(리스트, 페이징) / 사이드바(구조, 최근 공지사항, 최근 글, 인기글, 최근 댓글, 카테고리, 랜덤태그, 방문자수, 검색)

## 2. 파일 구조

```
SKIN
├─ index.xml        # 스킨 정보 파일 (이름/버전/저자/기본 설정)
├─ skin.html        # 메인 템플릿 (치환자를 HTML로 치환)
├─ style.css        # 스타일시트 (skin.html에서 분리)
├─ preview.gif      # 미리보기 (112x84)
├─ preview256.jpg   # 사용 중 스킨 미리보기 (256x192)
├─ preview560.jpg   # 스킨 목록 미리보기 (560x420)
├─ preview1600.jpg  # 스킨 상세보기 (1600x1200)
└─ images/          # 필수 아닌 리소스 전부 (js, img, css 등)
```

## 3. 치환자 기본 문법

두 가지 형태가 있다.

1. **그룹 치환자**: `<s_NAME> ... </s_NAME>` — 블록/반복 영역. 내부에 `s_..._rep` 반복자 포함 가능.
2. **값 치환자**: `[##_NAME_##]` — 단일 값으로 치환.

```html
<s_tag>
  <div class="taglog">
    <h3>태그</h3>
    <ul>
      <s_tag_rep>
        <li><a href="[##_tag_link_##]" class="[##_tag_class_##]">[##_tag_name_##]</a></li>
      </s_tag_rep>
    </ul>
  </div>
</s_tag>
```

- 그룹 치환자 안의 내용은 "스킨 데이터"가 렌더링되어 변환됨.
- 조건 표시는 그룹 치환자로 처리 (예: `<s_if_var_...>`, 스킨 옵션 치환자 문서 참조).

## 4. 공통 치환자 (필수 요소 포함)

| 치환자 | 설명 |
|---|---|
| `<s_t3>` | **티스토리 공통 javascript 삽입 (필수)** — `<body>` 내에 반드시 포함 |
| `[##_page_title_##]` | 페이지 제목 (`<title>`) |
| `[##_body_id_##]` | 페이지 타입별 body id (아래 표) |
| `[##_title_##]` | 블로그 제목 |
| `[##_blog_link_##]` | 블로그 URL |
| `[##_blog_menu_##]` | 블로그 메뉴 리스트 |
| `[##_desc_##]` / `[##_blogger_##]` | 블로그 설명 / 소유자 필명 |
| `[##_image_##]` / `[##_blog_image_##]` | 대표 이미지 URL / IMG 태그 포함 |
| `[##_rss_url_##]` / `[##_taglog_link_##]` / `[##_guestbook_link_##]` | RSS / 태그로그 / 방명록 URL |
| `[##_revenue_list_upper_##]` | **광고** — 홈/목록 상단 |
| `[##_revenue_list_lower_##]` | **광고** — 홈/목록 하단 |

### body_id 페이지 타입 (CSS 분기에 활용)

| body_id | 페이지 |
|---|---|
| `tt-body-index` | 홈 화면 |
| `tt-body-page` | 글 화면 |
| `tt-body-category` | 카테고리 목록 |
| `tt-body-archive` | 보관함 목록 |
| `tt-body-tag` | 태그 목록 |
| `tt-body-search` | 검색 결과 |
| `tt-body-guestbook` | 방명록 |
| `tt-body-location` | 지역 로그 |

### 사용 예 (공식 문서)

```html
<html>
<head><title>[##_page_title_##]</title></head>
<body id="[##_body_id_##]">
  <s_t3>
    <header>
      <h1><a href="[##_blog_link_##]">[##_title_##]</a></h1>
      [##_revenue_list_upper_##]
      [##_blog_menu_##]
    </header>
    <section class="sidebar">
      <div class="blogInfo">
        <div class="blogImage">[##_blog_image_##]</div>
        <div class="blogDesc">[##_desc_##] <span class="userID">[##_blogger_##]</span></div>
      </div>
    </section>
    [##_revenue_list_lower_##]
  </s_t3>
</body>
</html>
```

## 5. index.xml (스킨 정보 파일)

- 스킨 적용 시 이 파일 변경으로 **모든 설정이 초기화**됨에 주의.
- 구조: `<skin>` > `information`(name, version, description, license) / `author`(name, homepage, email) / `default`(설정 기본값).

`<default>` 주요 항목:

| 항목 | 설명 |
|---|---|
| recentEntries / recentComments | 최근 글/댓글 개수 |
| entriesOnPage / entriesOnList | 홈 화면 / 글 목록 표시 글 수 |
| showListOnCategory | 카테고리 화면 구성 (0:내용만, 1:목록만, 2:내용+목록) |
| lengthOfRecentEntry 등 | 위젯 말줄임 글자수 |
| expandComment / expandTrackback | 댓글/트랙백 펼침 여부 |
| tree.color / bgColor / activeColor / activeBgColor | 카테고리 트리 색상 |
| contentWidth | 콘텐츠 영역 가로 사이즈 (에디터 위지윅 위치 정확도에 영향) |
| cover | 홈 커버 기본값 정의 |
| 리스트 스타일 | 사용 가능한 글 목록 스타일 정의 |

## 6. 개발 시 주의점

- `<s_t3>` 누락 시 티스토리 공통 기능(툴바, 댓글, 편집기) 오동작.
- 본문/광고 관련 치환자는 **삭제하지 말고** 마크업만 감싸서 스타일링.
- 기존 스킨 백업 후 작업, 로컬/테스트 블로그에서 우선 검증.
