'use client'

import { useEffect, useRef, useState } from 'react'
import type { Heading } from 'app/lib/toc'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = useState<string>('')
  const [indicator, setIndicator] = useState<{
    top: number
    height: number
    visible: boolean
  }>({ top: 0, height: 0, visible: false })
  const listRef = useRef<HTMLUListElement>(null)

  // 스크롤에 따라 현재 읽는 섹션 감지
  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id)
        }
      },
      { rootMargin: '-88px 0px -65% 0px', threshold: 0 }
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.slug)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  // 활성 항목에 맞춰 슬라이딩 인디케이터 위치/높이 갱신 → CSS transition으로 부드럽게 이동
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (!activeSlug) {
      setIndicator((prev) => ({ ...prev, visible: false }))
      return
    }
    const activeLink = list.querySelector<HTMLElement>(
      `a[data-slug="${CSS.escape(activeSlug)}"]`
    )
    if (!activeLink) return
    setIndicator({
      top: activeLink.offsetTop,
      height: activeLink.offsetHeight,
      visible: true,
    })
  }, [activeSlug, headings])

  if (!headings.length) return null

  return (
    <nav aria-label="목차" className="text-sm">
      <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--fg)]">
        목차
      </p>
      <div className="relative">
        {/* 좌측 전체 트랙 */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-px bg-[var(--line)]"
        />
        {/* 스크롤 따라 미끄러지는 활성 인디케이터 */}
        <span
          aria-hidden
          className="absolute left-0 w-0.5 rounded-full bg-[var(--accent)] transition-all duration-300 ease-out motion-reduce:transition-none"
          style={{
            transform: `translateY(${indicator.top}px)`,
            height: `${indicator.height}px`,
            opacity: indicator.visible ? 1 : 0,
          }}
        />
        <ul ref={listRef}>
          {headings.map((h) => {
            const active = activeSlug === h.slug
            return (
              <li key={h.slug}>
                <a
                  href={`#${h.slug}`}
                  data-slug={h.slug}
                  className={`block py-1 leading-snug transition-colors duration-200 ${
                    h.level === 3 ? 'pl-6' : 'pl-3'
                  } ${
                    active
                      ? 'font-medium text-[var(--fg)]'
                      : 'text-[var(--muted)] hover:text-[var(--fg)]'
                  }`}
                >
                  {h.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
