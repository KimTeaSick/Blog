import { PageHero } from 'app/components/page-hero'
import { PortfolioList } from 'app/components/portfolio-list'

export const metadata = {
  title: 'Portfolio',
  description: '참여한 프로젝트와 문제 해결 과정을 정리했습니다.',
}
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="지금까지 만든 것들"
        description="참여한 프로젝트 9개. 무엇을 맡았고 어떤 문제를 어떻게 풀었는지 실제 작업 내용을 중심으로 정리했습니다."
      >
        <div className="flex flex-wrap gap-2.5 font-mono text-xs text-[var(--muted)]">
          <span className="rounded-full border border-[var(--line)] px-3.5 py-2">
            프로젝트 9
          </span>
          <span className="rounded-full border border-[var(--line)] px-3.5 py-2">
            React · Next.js · React Native
          </span>
          <span className="rounded-full border border-[var(--line)] px-3.5 py-2">
            2024 — Now
          </span>
        </div>
      </PageHero>
      <section className="mx-auto w-full max-w-[1180px] px-5 pb-20 md:px-11 md:pb-28">
        <PortfolioList />
      </section>
    </>
  )
}
