# Portfolio & Blog

Next.js 기반의 통합 포트폴리오 및 블로그 사이트입니다.

## 주요 기능

- **포트폴리오**: 프로젝트를 이미지와 함께 소개하는 포트폴리오 섹션
- **블로그**: MDX 기반의 기술 블로그
- **반응형 디자인**: 모바일부터 데스크탑까지 완벽하게 대응
- **다크 모드 지원**: 시스템 설정에 따른 자동 다크 모드
- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## 프로젝트 구조

```
/app
├── page.tsx                    # 홈 페이지 (포트폴리오 + 블로그 미리보기)
├── layout.tsx                  # 공통 레이아웃
├── portfolio/
│   ├── page.tsx               # 포트폴리오 목록
│   ├── [slug]/
│   │   └── page.tsx           # 포트폴리오 상세
│   └── utils.ts               # 포트폴리오 유틸 함수
├── blog/
│   ├── page.tsx               # 블로그 목록
│   ├── [slug]/
│   │   └── page.tsx           # 블로그 상세
│   ├── posts/                 # 블로그 포스트 (MDX)
│   └── utils.ts               # 블로그 유틸 함수
└── components/
    ├── nav.tsx                # 네비게이션
    ├── portfolio-list.tsx     # 포트폴리오 목록 컴포넌트
    ├── posts.tsx              # 블로그 포스트 목록 컴포넌트
    └── mdx.tsx                # MDX 렌더링 컴포넌트

/public
└── portfolio/
    ├── project-name-1/
    │   ├── thumbnail.png      # 썸네일 이미지
    │   ├── 01.png            # 갤러리 이미지
    │   ├── 02.png
    │   └── detail.md         # 프로젝트 상세 내용
    └── project-name-2/
        └── ...
```

## 시작하기

### 개발 서버 실행

```bash
npm run dev
# 또는
pnpm dev
```

http://localhost:3000 에서 확인할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 포트폴리오 프로젝트 추가하기

1. `public/portfolio/` 폴더에 새 프로젝트 폴더 생성
2. 프로젝트 폴더에 다음 파일들 추가:

### detail.md 예시

```markdown
---
title: "프로젝트 제목"
description: "프로젝트 간단한 설명"
date: "2024-11-15"
tags: ["Next.js", "TypeScript", "TailwindCSS"]
github: "https://github.com/username/repo"
demo: "https://demo.example.com"
---

## 프로젝트 개요

프로젝트에 대한 상세한 설명...

## 주요 기능

- 기능 1
- 기능 2

## 기술 스택

- Next.js
- TypeScript
- ...
```

### 이미지 파일

- `thumbnail.png` (또는 .jpg, .svg 등): 목록에 표시될 썸네일
- `01.png`, `02.png`, ... : 상세 페이지 갤러리에 표시될 이미지들

## 블로그 포스트 추가하기

`app/blog/posts/` 폴더에 새 `.mdx` 파일을 생성하세요.

### 블로그 포스트 예시

```markdown
---
title: "포스트 제목"
publishedAt: "2024-11-15"
summary: "포스트 요약"
---

포스트 내용...
```

## 커스터마이징

### 네비게이션

`app/components/nav.tsx` 파일에서 네비게이션 메뉴를 수정할 수 있습니다.

### 스타일

- TailwindCSS 사용
- `app/global.css`에서 전역 스타일 수정
- 컴포넌트별 인라인 스타일링

### 메타데이터

`app/layout.tsx`에서 사이트 메타데이터를 수정할 수 있습니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.0
- **Content**: MDX (next-mdx-remote)
- **Deployment**: Vercel (권장)

## Deploy on Vercel

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).
