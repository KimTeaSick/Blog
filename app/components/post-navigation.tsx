import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'

// 날짜 내림차순(최신순) 목록에서 현재 글의 앞뒤를 계산.
// newer(다음 글) = 더 최신 = 배열의 이전 인덱스, older(이전 글) = 더 과거 = 다음 인덱스.
export function PostNavigation({ slug }: { slug: string }) {
  const posts = getBlogPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  if (idx === -1) return null

  const newer = idx > 0 ? posts[idx - 1] : null // 다음 글 (오른쪽)
  const older = idx < posts.length - 1 ? posts[idx + 1] : null // 이전 글 (왼쪽)
  if (!newer && !older) return null

  const arrowBtn =
    'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-lg text-neutral-600 shadow-sm backdrop-blur transition-colors group-hover:border-neutral-400 dark:border-neutral-800 dark:bg-black/70 dark:text-neutral-300 dark:group-hover:border-neutral-600'
  const label =
    'max-w-[12rem] rounded-lg bg-white/90 px-3 py-1.5 text-sm text-neutral-700 shadow-sm backdrop-blur transition-all duration-200 dark:bg-neutral-900/90 dark:text-neutral-300 line-clamp-2'

  return (
    <>
      {/* 데스크톱(PC, xl≥1200): 본문 좌우 플로팅 화살표. 제목은 hover 시 노출 */}
      <div className="hidden xl:block">
        {older && (
          <Link
            href={`/blog/${older.slug}`}
            aria-label={`이전 글: ${older.metadata.title}`}
            className="group fixed left-6 top-1/2 z-40 flex -translate-y-1/2 items-center gap-3"
          >
            <span className={arrowBtn}>←</span>
            <span
              className={`${label} -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}
            >
              {older.metadata.title}
            </span>
          </Link>
        )}
        {newer && (
          <Link
            href={`/blog/${newer.slug}`}
            aria-label={`다음 글: ${newer.metadata.title}`}
            className="group fixed right-6 top-1/2 z-40 flex -translate-y-1/2 flex-row-reverse items-center gap-3"
          >
            <span className={arrowBtn}>→</span>
            <span
              className={`${label} translate-x-2 text-right opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}
            >
              {newer.metadata.title}
            </span>
          </Link>
        )}
      </div>

      {/* 모바일·태블릿(xl 미만): 본문 하단 이전/다음 카드 */}
      <nav className="mt-16 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800 xl:hidden">
        {older ? (
          <Link href={`/blog/${older.slug}`} className="group flex flex-col gap-1">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              ← 이전 글
            </span>
            <span className="line-clamp-2 text-sm font-medium text-neutral-900 transition-colors group-hover:text-neutral-500 dark:text-neutral-100 dark:group-hover:text-neutral-400">
              {older.metadata.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link
            href={`/blog/${newer.slug}`}
            className="group flex flex-col items-end gap-1 text-right"
          >
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              다음 글 →
            </span>
            <span className="line-clamp-2 text-sm font-medium text-neutral-900 transition-colors group-hover:text-neutral-500 dark:text-neutral-100 dark:group-hover:text-neutral-400">
              {newer.metadata.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  )
}
