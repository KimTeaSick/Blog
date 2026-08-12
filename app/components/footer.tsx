export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-8 font-mono text-xs text-[var(--muted)] md:px-11">
        <p>© {new Date().getFullYear()} jo5eph</p>
        <nav className="flex items-center gap-6" aria-label="하단 메뉴">
          <a className="transition-colors hover:text-[var(--fg)]" href="/rss">
            rss
          </a>
          <a
            className="transition-colors hover:text-[var(--fg)]"
            href="https://github.com/KimTeaSick"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
        </nav>
      </div>
    </footer>
  )
}
