'use client'

import { useEffect, useRef, useState } from 'react'

type ShareMenuProps = {
  url: string
}

export function ShareMenu({ url }: ShareMenuProps) {
  const [message, setMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        detailsRef.current?.removeAttribute('open')
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') detailsRef.current?.removeAttribute('open')
    }

    document.addEventListener('mousedown', closeMenu)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeMenu)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }

    setMessage('링크를 복사했습니다.')
    detailsRef.current?.removeAttribute('open')
    window.setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="relative" ref={containerRef}>
      <details ref={detailsRef}>
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-2 font-mono text-[11px] text-[var(--muted)] transition-colors marker:hidden hover:border-[var(--fg)] hover:text-[var(--fg)]">
          <ShareIcon />
          공유하기
        </summary>
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-md border border-[var(--line)] bg-[var(--bg)] p-1.5 shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={copyLink}
            className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm text-[var(--fg)] hover:bg-[var(--bg-soft)]"
          >
            <LinkIcon />
            링크 복사
          </button>
        </div>
      </details>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
      {message && (
        <div className="absolute right-0 top-full z-30 mt-2 whitespace-nowrap rounded-sm bg-[var(--fg)] px-3 py-2 font-mono text-xs text-[var(--bg)] shadow-lg">
          {message}
        </div>
      )}
    </div>
  )
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
    </svg>
  )
}
