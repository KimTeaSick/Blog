import Link from 'next/link'
import { BlogPosts } from 'app/components/posts'
import { PortfolioList } from 'app/components/portfolio-list'
import { SectionHeader } from 'app/components/page-hero'
// import { PortfolioImageFlow } from 'app/components/portfolio-image-flow'

export const revalidate = 60

const focusAreas = [
  {
    title: 'Interactive UI',
    description: '사용자의 행동을 자연스럽게 이끄는 화면과 인터랙션 설계',
  },
  {
    title: '실시간 미디어',
    description: '녹음·재생·하이라이팅이 맞물리는 미디어 경험 구현',
  },
  {
    title: '디자인 시스템',
    description: '재사용 가능한 컴포넌트 체계와 일관된 UI 기반 구축',
  },
  {
    title: '성능 최적화',
    description: 'SSR과 렌더링 구조를 다듬어 실제 로딩 시간을 단축',
  },
  {
    title: '접근성',
    description: '특수학급 교육 서비스에서 배운 접근성 중심의 개발',
  },
  {
    title: 'AI 도구',
    description: '에이전트와 생성형 AI를 개발 워크플로에 적용하는 실험',
  },
]

export default function Page() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1180px] px-5 pb-12 pt-14 md:px-11 md:pb-14 md:pt-24">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
          Joseph Kim · Frontend Developer
        </p>
        <h1 className="mt-5 text-[clamp(1.35rem,5.5vw,4rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
          <span className="block whitespace-nowrap">
            잘 보이고, 잘 눌리고, 잘 쓰이는
          </span>
          <span className="block">서비스를 만듭니다</span>
        </h1>
        <p className="mt-7 max-w-[58ch] text-pretty text-[clamp(1rem,1.7vw,1.18rem)] leading-8 text-[var(--muted)]">
          “사용자가 이 버튼 꼭 누르게 하고 싶다”는 집념으로 인터랙션을
          만들어왔습니다. 특수 학급용 AIDT 서비스도 직접 설계·개발해 현재
          국가특수교육원에서 실제로 사용되고 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/portfolio"
            className="rounded-[3px] bg-[var(--fg)] px-6 py-3.5 text-[15px] font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
          >
            포트폴리오 보기
          </Link>
          <Link
            href="/blog"
            className="rounded-[3px] border border-[var(--line)] px-6 py-3.5 text-[15px] font-semibold transition-colors hover:border-[var(--fg)]"
          >
            블로그 읽기
          </Link>
          <a
            href="https://github.com/KimTeaSick"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[3px] border border-[var(--line)] px-6 py-3.5 text-[15px] font-semibold transition-colors hover:border-[var(--fg)]"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/joseph-kim-35770b248/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[3px] border border-[var(--line)] px-6 py-3.5 text-[15px] font-semibold transition-colors hover:border-[var(--fg)]"
          >
            LinkedIn ↗
          </a>
        </div>
      </section>

      {/*
      <section className="mx-auto w-full max-w-[1180px] px-5 pb-16 md:px-11 md:pb-20">
        <PortfolioImageFlow />
      </section>
      */}

      <section className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 pb-16 md:grid-cols-2 md:gap-14 md:px-11 md:pb-20">
        <div>
          <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-semibold tracking-[-0.03em]">
            무엇을 만들어왔나
          </h2>
          <p className="mt-4 text-pretty text-[clamp(0.95rem,1.5vw,1.05rem)] leading-7 text-[var(--muted)]">
            특수학급 국어 교과서의 녹음·하이라이팅부터 AI 캐릭터 대화
            서비스의 SSR까지, 여러 프로젝트에서 화면과 미디어를
            담당했습니다. 문제와 결정 과정은 프로젝트별로 정리했습니다.
          </p>
          <Link
            href="/portfolio"
            className="mt-5 inline-block border-b border-[var(--accent)] pb-1 font-mono text-xs"
          >
            프로젝트 9개 →
          </Link>
        </div>
        <div>
          <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] font-semibold tracking-[-0.03em]">
            왜 글을 쓰나
          </h2>
          <p className="mt-4 text-pretty text-[clamp(0.95rem,1.5vw,1.05rem)] leading-7 text-[var(--muted)]">
            한 번 겪은 문제를 두 번 헤매지 않으려고 씁니다. 결론만 남기기보다
            어떤 선택을 했고 왜 그렇게 판단했는지, 시도했던 과정까지 함께
            기록합니다.
          </p>
          <Link
            href="/blog"
            className="mt-5 inline-block border-b border-[var(--accent)] pb-1 font-mono text-xs"
          >
            블로그 →
          </Link>
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 md:px-11 md:py-20">
          <SectionHeader title="최근 프로젝트" href="/portfolio" />
          <PortfolioList limit={3} variant="compact" />
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 md:px-11 md:py-20">
          <SectionHeader title="최근 글" href="/blog" />
          <BlogPosts limit={4} />
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 md:px-11 md:py-20">
          <SectionHeader title="관심 있는 영역" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((area) => (
              <div key={area.title} className="rounded-md bg-[var(--bg-soft)] p-6">
                <h3 className="font-mono text-sm font-medium">{area.title}</h3>
                <p className="mt-3 text-[15px] leading-6 text-[var(--muted)]">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
