'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'

const navItems = [
  { href: '/', label: '홈' },
  { href: '/portfolio', label: '포트폴리오' },
  { href: '/blog', label: '블로그' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--bg)/0.94] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-7 gap-y-3 px-5 py-3.5 md:px-11">
        <Link
          href="/"
          className="flex items-baseline gap-2 text-[17px] font-bold tracking-[-0.025em]"
          aria-label="jo5eph 홈"
        >
          jo5eph
          <span className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-[var(--accent)]">
            engineering
          </span>
        </Link>
        <nav
          className="flex items-center gap-3 text-sm font-medium sm:gap-5"
          aria-label="주요 메뉴"
        >
          <div className="flex items-center gap-3 sm:gap-5">
            {navItems.map(({ href, label }) => {
              const active =
                href === '/' ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`border-b-2 py-1 transition-colors ${
                    active
                      ? 'border-[var(--accent)] text-[var(--fg)]'
                      : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
