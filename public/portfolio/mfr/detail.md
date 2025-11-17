---
title: "MFR - 얼굴 인식 기반 출입 등록 WebApp"
description: "TensorFlow 기반 얼굴 인식 + 촬영 자동화 + Pass 인증을 이용한 출입 등록 서비스"
date: "2024-01-10"
tags: ["Next.js", "TensorFlow", "React Query", "Lazy Loading", "WebApp"]
github: ""
demo: ""
---

## Overview

TensorFlow 기반 얼굴 인식 모델을 이용하여 눈·코·입 등의 특징점이 특정 위치에 들어왔을 때 3초 카운트 후 자동 촬영하는 출입 등록 WebApp입니다.

## Key Features

- TensorFlow 얼굴 인식 연동 및 자동 촬영 프로세스 구축
- Pass 인증 기반 본인 인증 기능
- 접히는 기기(Fold/Flip) 대응 UI 설계
- Lazy loading 적용  
  → 초기 JS 번들 **20% 감소**, 로딩 속도 **1.2s → 0.8s (30% 개선)**

## Tech Stack

Typescript, Next.js, React Query, Styled-Components
