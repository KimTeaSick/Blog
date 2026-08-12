import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 py-24 md:px-11 md:py-36">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
        Error 404
      </p>
      <h1 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-6 text-[var(--muted)]">
        주소가 바뀌었거나 삭제된 페이지입니다.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-[3px] bg-[var(--fg)] px-6 py-3.5 text-sm font-semibold text-[var(--bg)]"
      >
        홈으로 돌아가기
      </Link>
    </section>
  )
}
