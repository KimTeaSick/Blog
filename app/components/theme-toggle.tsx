'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')

    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  if (!mounted) {
    return (
      <span className="flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--muted)]">
        <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--fg)] after:absolute after:right-0 after:top-0 after:h-2.5 after:w-1 after:rounded-r-full after:bg-[var(--bg)]" />
        Dark
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
      aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
    >
      <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--fg)] after:absolute after:right-0 after:top-0 after:h-2.5 after:w-1 after:rounded-r-full after:bg-[var(--bg)]" />
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
