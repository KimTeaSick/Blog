# 조회수·좋아요 데이터베이스 설정

블로그 본문은 기존 Git/ISR 방식을 유지하고, 조회수와 익명 좋아요만 Neon Postgres에 저장합니다.

## Vercel 설정

1. Vercel 프로젝트에서 `Storage` 또는 `Marketplace`를 엽니다.
2. `Neon Postgres`를 추가하고 현재 프로젝트의 Production/Preview 환경에 연결합니다.
3. 프로젝트 환경 변수에 `DATABASE_URL`이 생성됐는지 확인합니다.
4. 새 배포를 실행합니다.

Vercel 빌드에서는 `scripts/migrate-engagement.mjs --soft`가 실행되어 필요한 테이블을 자동 생성합니다. 데이터베이스가 연결되지 않은 로컬 환경에서는 마이그레이션을 건너뛰므로 기존 개발과 빌드가 중단되지 않습니다.

로컬에서 Neon을 연결할 때는 `.env.local`에 `DATABASE_URL`을 추가한 후 다음 명령을 실행합니다.

```bash
npm run db:migrate
```

## 집계 기준

- 조회수: 익명 브라우저별 글 하나당 하루 1회
- 좋아요: 익명 브라우저별 글 하나당 1회, 다시 누르면 취소
- 방문자 UUID는 HttpOnly 쿠키에 저장하고 데이터베이스에는 SHA-256 해시만 저장
