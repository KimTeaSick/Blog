'use client'

import { useEffect, useState } from 'react'
import type { Heading } from 'app/lib/toc'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = useState<string>('')

  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면 상단에 들어온 heading 중 가장 위쪽을 활성으로
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id)
        }
      },
      // 상단 88px(스티키 nav) 아래부터, 하단 65%는 무시 → "현재 읽는 섹션" 감지
      { rootMargin: '-88px 0px -65% 0px', threshold: 0 }
    )

    headings.forEach((h) => {
      const el = document.getElementById(h.slug)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav aria-label="목차" className="text-sm">
      <p className="mb-3 font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        목차
      </p>
      <ul>
        {headings.map((h) => {
          const active = activeSlug === h.slug
          return (
            <li key={h.slug}>
              <a
                href={`#${h.slug}`}
                className={`block border-l-2 py-1 leading-snug transition-colors ${
                  h.level === 3 ? 'pl-6' : 'pl-3'
                } ${
                  active
                    ? 'border-neutral-900 font-medium text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
                    : 'border-neutral-200 text-neutral-500 hover:text-neutral-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
