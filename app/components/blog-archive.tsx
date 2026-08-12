'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export type BlogArchiveItem = {
  slug: string
  title: string
  summary: string
  date: string
  category: string
  tags: string[]
  image?: string
}

export function BlogArchive({ posts }: { posts: BlogArchiveItem[] }) {
  const [filter, setFilter] = useState('전체')
  const [featured, ...rest] = posts
  const categories = useMemo(
    () => ['전체', ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts]
  )
  const filtered =
    filter === '전체'
      ? rest
      : rest.filter((post) => post.category === filter)

  if (!featured) {
    return (
      <p className="border-t border-[var(--line)] py-12 text-[var(--muted)]">
        아직 작성된 글이 없습니다.
      </p>
    )
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[1180px] px-5 pb-12 md:px-11">
        <Link
          href={`/blog/${featured.slug}`}
          className="group -mx-3 grid gap-7 rounded-md p-3 transition-colors hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:-mx-7 md:grid-cols-2 md:items-center md:gap-12 md:p-7"
        >
          <PostVisual post={featured} featured />
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--muted)]">
              <span className="bg-[var(--accent)] px-2.5 py-1 font-medium uppercase tracking-[0.1em] text-[var(--on-accent)]">
                {featured.category}
              </span>
              <time>{featured.date}</time>
            </div>
            <h2 className="text-balance text-[clamp(1.75rem,4vw,2.625rem)] font-semibold leading-[1.12] tracking-[-0.035em] transition-colors group-hover:text-[var(--accent)]">
              {featured.title}
            </h2>
            <p className="mt-5 text-pretty text-[clamp(0.95rem,1.5vw,1.0625rem)] leading-7 text-[var(--muted)]">
              {featured.summary}
            </p>
            <TagList tags={featured.tags} outlined />
          </div>
        </Link>
      </section>

      <section className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] px-5 py-6 md:px-11">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = filter === category
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(category)}
                className={`rounded-full border px-4 py-2 font-mono text-xs transition-colors ${
                  active
                    ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]'
                    : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--fg)] hover:text-[var(--fg)]'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
        <span className="font-mono text-xs text-[var(--muted)]">
          {filtered.length}개의 글
        </span>
      </section>

      <section className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-x-8 gap-y-12 px-5 pb-20 pt-10 sm:grid-cols-2 md:px-11 lg:grid-cols-3 md:pb-28">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </>
  )
}

export function PostCard({ post }: { post: BlogArchiveItem }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex min-w-0 flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
    >
      <PostVisual post={post} />
      <time className="mt-5 font-mono text-xs text-[var(--muted)]">
        {post.date}
      </time>
      <h3 className="mt-3 text-balance text-xl font-semibold leading-[1.28] tracking-[-0.025em] transition-colors group-hover:text-[var(--accent)]">
        {post.title}
      </h3>
      <p className="mt-3 text-pretty text-[15px] leading-6 text-[var(--muted)]">
        {post.summary}
      </p>
      <TagList tags={post.tags} />
    </Link>
  )
}

function PostVisual({
  post,
  featured = false,
}: {
  post: BlogArchiveItem
  featured?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm bg-[var(--bg-soft)] ${
        featured ? 'aspect-[16/10]' : 'aspect-[3/2]'
      }`}
    >
      {post.image ? (
        <Image
          src={post.image}
          alt=""
          fill
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, 33vw'}
          className="object-cover transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90"
        />
      ) : (
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,var(--line)_0_1px,transparent_1px_11px)]" />
      )}
      {!featured && (
        <span className="absolute left-3 top-3 bg-[var(--bg)] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--fg)]">
          {post.category}
        </span>
      )}
    </div>
  )
}

function TagList({ tags, outlined = false }: { tags: string[]; outlined?: boolean }) {
  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`font-mono text-[11px] text-[var(--muted)] ${
            outlined
              ? 'rounded-full border border-[var(--line)] px-2.5 py-1'
              : ''
          }`}
        >
          {outlined ? tag : `#${tag}`}
        </span>
      ))}
    </div>
  )
}

