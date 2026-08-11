# 블로그 자동 업데이트 설정 가이드

> ## ⚠️ 이 문서의 방식은 현재 구조에서 동작하지 않습니다
>
> 아래 revalidation 설정은 **"콘텐츠를 런타임에 읽어올 때"** 유효한 방법입니다.
> 지금 이 블로그는 `app/blog/utils.ts` 가 `fs.readFileSync` 로 **빌드 시점에 굳은
> 파일**을 읽습니다. `revalidatePath()` 는 페이지를 다시 렌더링할 뿐이고, 다시
> 렌더링해도 읽는 파일이 그대로이므로 **새 글은 절대 나타나지 않습니다.**
>
> 게다가 `contents/` 는 git 서브모듈이라 **커밋 SHA 를 고정**합니다. blog-contents 에
> push 해도 Blog 저장소의 포인터는 그대로여서, Vercel 이 재배포해도 옛 콘텐츠로
> 다시 빌드됩니다.
>
> **현재 실제로 동작하는 방식은 이렇습니다.**
>
> ```
> blog-contents 에 push
>       ↓  .github/workflows/revalidate.yml
> Vercel Deploy Hook 호출
>       ↓
> Blog 빌드 시작
>       ↓  prebuild → scripts/sync-contents.mjs
> blog-contents 최신 main 을 tarball 로 받아 contents/ 에 채움
>       ↓
> next build → 배포 (약 1~2분)
> ```
>
> 즉 **blog-contents 에 push 하는 것만으로 배포된 블로그가 갱신됩니다.**
> 아래 revalidation 설정은 하지 않아도 되고, 해도 효과가 없습니다.
>
> 나중에 재배포 없이 즉시 반영되게 하려면 `app/blog/utils.ts` 를 파일시스템 대신
> GitHub 에서 fetch 하도록 바꿔야 하며, 그때 비로소 아래 내용이 의미를 갖습니다.

---

<details>
<summary>참고용 원문 (현재 구조에서는 적용되지 않음)</summary>

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

</details>
