---
title: "ARGO 4S - 자동 매매 웹 서비스"
description: "Next.js + FastAPI 기반 자동 매수·매도 시스템"
date: "2024-05-12"
tags: ["Next.js", "FastAPI", "SQLAlchemy", "React Query"]
github: ""
demo: ""
---

## Overview

사용자가 설정한 조건으로 코인을 자동 매수/매도하는 시스템입니다.

## Key Features

- React Query 기반 네트워크 캐싱 최적화
- 코인/검색/매매/유저정보 상태 분리 구조 구축
- Headless Component 기반 재사용성 강화
- FastAPI 백엔드 개발
  - SQLAlchemy ORM
  - JWT 로그인
  - 스케줄러 제작 → 데이터 제공 속도 **40% 향상**
- Bithumb OpenAPI 연동

## Tech Stack

Next.js, Typescript, Tailwind, FastAPI
