'use client'

import { useState } from 'react'

export function ArticleShare({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

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

    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const iconClass =
    'flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:text-neutral-400 dark:hover:text-white'

  return (
    <section aria-label="글 공유하기">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.04em] text-[var(--muted)]">
        Share this article
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={copyLink}
          aria-label="글 링크 복사"
          className={iconClass}
        >
          <CopyIcon />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? '링크를 복사했습니다.' : ''}
      </span>
      {copied && (
        <p className="mt-2 font-mono text-[10px] text-[var(--muted)]">
          링크를 복사했습니다.
        </p>
      )}
    </section>
  )
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="6.5" y="5" width="13" height="16" rx="2.5" />
      <path d="M16.5 5V4.5A2.5 2.5 0 0 0 14 2H6a2.5 2.5 0 0 0-2.5 2.5V16A2.5 2.5 0 0 0 6 18.5h.5" />
    </svg>
  )
}
