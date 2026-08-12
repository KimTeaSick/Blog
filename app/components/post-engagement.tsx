'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type EngagementStats = {
  views: number
  likes: number
  liked: boolean
}

type EngagementContextValue = {
  stats: EngagementStats | null
  pending: boolean
  unavailable: boolean
  toggleLike: () => Promise<void>
}

const EngagementContext = createContext<EngagementContextValue | null>(null)
const viewedPosts = new Set<string>()

async function readResponse(response: Response): Promise<EngagementStats> {
  if (!response.ok) {
    throw new Error(`Engagement request failed: ${response.status}`)
  }

  return response.json()
}

export function PostEngagementProvider({
  slug,
  children,
}: {
  slug: string
  children: ReactNode
}) {
  const [stats, setStats] = useState<EngagementStats | null>(null)
  const [pending, setPending] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let active = true
    const endpoint = viewedPosts.has(slug) ? 'stats' : 'view'
    const method = endpoint === 'view' ? 'POST' : 'GET'

    viewedPosts.add(slug)

    fetch(`/api/posts/${encodeURIComponent(slug)}/${endpoint}`, {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
    })
      .then(readResponse)
      .then((nextStats) => {
        if (active) setStats(nextStats)
      })
      .catch(() => {
        if (active) {
          setStats({ views: 0, likes: 0, liked: false })
          setUnavailable(true)
        }
      })

    return () => {
      active = false
    }
  }, [slug])

  const toggleLike = async () => {
    if (!stats || pending) return

    const previous = stats
    const liked = !previous.liked
    setPending(true)
    setStats({
      ...previous,
      liked,
      likes: Math.max(0, previous.likes + (liked ? 1 : -1)),
    })

    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(slug)}/like`,
        {
          method: liked ? 'POST' : 'DELETE',
          credentials: 'same-origin',
          cache: 'no-store',
        }
      )
      setStats(await readResponse(response))
    } catch {
      setStats(previous)
    } finally {
      setPending(false)
    }
  }

  return (
    <EngagementContext.Provider
      value={{ stats, pending, unavailable, toggleLike }}
    >
      {children}
    </EngagementContext.Provider>
  )
}

function useEngagement() {
  const context = useContext(EngagementContext)

  if (!context) {
    throw new Error(
      'Post engagement components must be inside PostEngagementProvider.'
    )
  }

  return context
}

export function PostViewCount() {
  const { stats, unavailable } = useEngagement()

  if (!stats) {
    return (
      <div
        aria-label="조회수 불러오는 중"
        className="h-4 w-12 animate-pulse rounded bg-[var(--hover)]"
      />
    )
  }

  return (
    <span
      className="flex items-center gap-1.5 border-l border-[var(--line)] pl-5 font-mono text-xs text-[var(--muted)]"
      title={unavailable ? '조회수 연결 대기 중' : '조회수'}
    >
      <EyeIcon />
      <span>{stats.views.toLocaleString('ko-KR')}</span>
      <span className="sr-only">회 조회</span>
    </span>
  )
}

export function PostLikeButton() {
  const { stats, pending, unavailable, toggleLike } = useEngagement()

  return (
    <section className="py-10 text-center">
      <p className="text-sm text-[var(--muted)]">이 글이 도움이 되었나요?</p>
      <button
        type="button"
        onClick={toggleLike}
        disabled={!stats || pending || unavailable}
        aria-pressed={stats?.liked ?? false}
        className={`mt-4 inline-flex min-w-28 items-center justify-center gap-2 border px-5 py-3 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] disabled:cursor-wait disabled:opacity-60 ${
          stats?.liked
            ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]'
            : 'border-[var(--line)] text-[var(--fg)] hover:border-[var(--fg)]'
        }`}
      >
        <HeartIcon filled={stats?.liked ?? false} />
        <span>{stats ? stats.likes.toLocaleString('ko-KR') : '—'}</span>
        <span>{stats?.liked ? '좋아요 취소' : '좋아요'}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {stats?.liked
          ? '좋아요를 표시했습니다.'
          : '좋아요를 표시하지 않았습니다.'}
      </span>
    </section>
  )
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  )
}
