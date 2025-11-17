---
title: "팝테일 - AI 이미지 기반 웹소설 플랫폼"
description: "SSR 기반 웹소설·웹툰 소설 뷰어 및 퍼포먼스 최적화"
date: "2024-08-09"
tags: ["Next.js", "SSR", "Zustand", "React Query"]
github: ""
demo: ""
---

## Overview

AI 이미지 생성 기반 웹소설·웹툰소설을 지원하는 뷰어 중심 플랫폼입니다.

## Key Features

- SSR 적용 → 초기 로딩 **2400ms → 1000ms**
- styled-components FOUC 문제 해결
- 폰트·크기·여백 조절 가능한 뷰어 제작
- EPUB 이미지 로딩 지연 해결  
  → HTML 기반 렌더링 구조로 변경
- Zustand + React Query 로 클린 상태 관리

## Tech Stack

Next.js, Typescript, Styled-Components
