import type { ReactNode } from 'react'
import Link from 'next/link'

type PageHeroProps = {
  eyebrow: string
  title: string
  description?: string
  children?: ReactNode
  compact?: boolean
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`mx-auto w-full max-w-[1180px] px-5 md:px-11 ${
        compact
          ? 'pb-10 pt-12 md:pb-14 md:pt-20'
          : 'pb-12 pt-14 md:pb-16 md:pt-24'
      }`}
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h1
        className={`mt-5 max-w-[16ch] text-balance font-semibold leading-[0.99] tracking-[-0.045em] text-[var(--fg)] ${
          compact
            ? 'text-[clamp(2.125rem,5.5vw,3.75rem)]'
            : 'text-[clamp(2.25rem,6vw,4.25rem)]'
        }`}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-7 max-w-[54ch] text-pretty text-[clamp(1rem,1.7vw,1.125rem)] leading-7 text-[var(--muted)]">
          {description}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </section>
  )
}

export function SectionHeader({
  title,
  href,
  linkLabel = '전체 보기 →',
}: {
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-2xl font-semibold tracking-[-0.025em]">{title}</h2>
      {href && (
        <Link
          href={href}
          className="font-mono text-xs text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
