import Link from 'next/link'

type NavigationPost = {
  slug: string
  title: string
}

export function PostNavigation({
  previousPost,
  nextPost,
}: {
  previousPost?: NavigationPost
  nextPost?: NavigationPost
}) {
  if (!previousPost && !nextPost) return null

  return (
    <nav
      aria-label="이전글 및 다음글"
      className="mt-16 grid gap-3 border-t border-[var(--line)] pt-8 sm:grid-cols-2"
    >
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="group rounded-sm border border-[var(--line)] p-5 transition-colors hover:border-[var(--fg)] hover:bg-[var(--hover)]"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
            ← 이전글
          </span>
          <span className="mt-3 block text-balance font-semibold leading-6 transition-colors group-hover:text-[var(--accent)]">
            {previousPost.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {nextPost && (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group rounded-sm border border-[var(--line)] p-5 text-left transition-colors hover:border-[var(--fg)] hover:bg-[var(--hover)] sm:text-right"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
            다음글 →
          </span>
          <span className="mt-3 block text-balance font-semibold leading-6 transition-colors group-hover:text-[var(--accent)]">
            {nextPost.title}
          </span>
        </Link>
      )}
    </nav>
  )
}

