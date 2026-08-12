'use client'

import { useEffect, useRef } from 'react'

// giscus 설정값 (giscus.app 에서 발급 — 공개 식별자라 하드코딩)
const repo = 'KimTeaSick/Blog'
const repoId = 'R_kgDOGe-NCg'
const category = 'General'
const categoryId = 'DIC_kwDOGe-NCs4DBLVm'

const GISCUS_ORIGIN = 'https://giscus.app'

function getTheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function Comments() {
  const ref = useRef<HTMLDivElement>(null)

  // 1) giscus 스크립트 1회 주입
  useEffect(() => {
    const container = ref.current
    // StrictMode/재마운트 시 중복 주입 방지
    if (!container || container.querySelector('script')) return

    const script = document.createElement('script')
    script.src = `${GISCUS_ORIGIN}/client.js`
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', category)
    script.setAttribute('data-category-id', categoryId)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '0')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', getTheme())
    script.setAttribute('data-lang', 'ko')
    script.setAttribute('data-loading', 'lazy')

    container.appendChild(script)
  }, [])

  // 2) 사이트 다크모드 토글과 테마 동기화
  useEffect(() => {
    const sendTheme = () => {
      const iframe =
        document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: getTheme() } } },
        GISCUS_ORIGIN
      )
    }

    // <html> 의 class 변화(dark 토글)를 감지해 giscus 에 전달
    const observer = new MutationObserver(sendTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className="giscus mt-16" />
}
