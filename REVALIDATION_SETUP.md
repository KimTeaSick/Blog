# 블로그 자동 업데이트 설정 가이드

contents만 업데이트해도 Vercel 재배포 없이 바로 반영되도록 설정하는 방법입니다.

## 🎯 작동 원리

1. **ISR (Incremental Static Regeneration)**: 60초마다 자동으로 페이지를 재검증합니다
2. **On-Demand Revalidation**: GitHub에서 contents를 push하면 즉시 페이지를 업데이트합니다

## 📝 설정 순서

### 1. 로컬 환경변수 설정

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일에서 랜덤한 토큰을 생성하세요:

```bash
# 랜덤 토큰 생성 예시
openssl rand -base64 32
```

생성된 토큰을 `.env`에 저장:
```
REVALIDATION_TOKEN=생성한_랜덤_토큰
```

### 2. Vercel 환경변수 설정

Vercel Dashboard에서 환경변수를 설정합니다:

1. https://vercel.com/dashboard 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 다음 변수 추가:
   - **Name**: `REVALIDATION_TOKEN`
   - **Value**: `.env` 파일에 설정한 토큰과 동일한 값
   - **Environment**: Production, Preview, Development 모두 선택

### 3. GitHub Webhook 설정

contents 저장소에 webhook을 설정합니다:

#### A. contents 저장소 확인

```bash
cd /Users/josephkim/blog/contents
git remote -v
```

위 명령으로 contents 저장소의 GitHub URL을 확인하세요.

#### B. Webhook 추가

1. Contents 저장소의 GitHub 페이지로 이동
2. **Settings** → **Webhooks** → **Add webhook** 클릭
3. 다음과 같이 설정:

   - **Payload URL**: `https://your-domain.vercel.app/api/revalidate`
     - `your-domain`을 실제 Vercel 도메인으로 변경하세요

   - **Content type**: `application/json`

   - **Secret**: 비워두기

   - **Which events would you like to trigger this webhook?**
     - "Just the push event" 선택

   - **Custom Headers** 추가:
     - Name: `Authorization`
     - Value: `Bearer 당신의_REVALIDATION_TOKEN`

4. **Add webhook** 클릭

#### C. Webhook 요청 본문 (선택사항)

webhook을 더 세밀하게 제어하려면 GitHub Actions를 사용할 수 있습니다:

```yaml
# .github/workflows/revalidate.yml (contents 저장소에 생성)
name: Revalidate Blog

on:
  push:
    branches:
      - main
    paths:
      - 'blog/**'

jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Revalidation
        run: |
          curl -X POST https://your-domain.vercel.app/api/revalidate \
            -H "Authorization: Bearer ${{ secrets.REVALIDATION_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{}'
```

이 방법을 사용하려면:
1. Contents 저장소의 **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `REVALIDATION_TOKEN`, Value: 당신의 토큰

## 🧪 테스트

### 로컬 테스트

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json"
```

### 프로덕션 테스트

```bash
curl -X POST https://your-domain.vercel.app/api/revalidate \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json"
```

성공 응답 예시:
```json
{
  "revalidated": true,
  "count": 5,
  "paths": ["/", "/blog", "/blog/post1", "/blog/post2"],
  "now": 1234567890
}
```

## 📊 API 사용법

### 전체 블로그 재검증
```bash
curl -X POST https://your-domain.vercel.app/api/revalidate \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"
```

### 특정 포스트만 재검증
```bash
curl -X POST https://your-domain.vercel.app/api/revalidate \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"slug": "post-slug"}'
```

### 특정 경로만 재검증
```bash
curl -X POST https://your-domain.vercel.app/api/revalidate \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"path": "/blog"}'
```

## ✅ 확인사항

- [ ] `.env` 파일에 `REVALIDATION_TOKEN` 설정 완료
- [ ] Vercel에 환경변수 추가 완료
- [ ] GitHub Webhook 설정 완료
- [ ] 로컬/프로덕션 API 테스트 성공
- [ ] contents 저장소에 push 후 자동 업데이트 확인

## 🎉 완료!

이제 contents 저장소에 새 글을 push하면:
1. GitHub Webhook이 자동으로 트리거됩니다
2. Revalidation API가 호출됩니다
3. 관련 페이지들이 즉시 재생성됩니다
4. 사용자는 최신 콘텐츠를 바로 볼 수 있습니다

추가로 ISR이 60초마다 자동으로 재검증하므로, webhook이 실패하더라도 최대 1분 내에 업데이트가 반영됩니다.
