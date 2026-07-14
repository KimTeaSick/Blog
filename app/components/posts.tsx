import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts({
  limit,
  variant = 'list',
}: { limit?: number; variant?: 'list' | 'grid' } = {}) {
  let allBlogs = getBlogPosts()

  const sortedBlogs = allBlogs.sort((a, b) => {
    if (
      new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
    ) {
      return -1
    }
    return 1
  })

  const displayBlogs = limit ? sortedBlogs.slice(0, limit) : sortedBlogs

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {displayBlogs.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {post.metadata.image ? (
                <Image
                  src={post.metadata.image}
                  alt={post.metadata.title}
                  fill
                  sizes="(max-width: 640px) 45vw, 130px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl text-neutral-300 dark:text-neutral-600">
                  ✦
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium leading-snug tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors line-clamp-2">
              {post.metadata.title}
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
              {formatDate(post.metadata.publishedAt, false)}
            </p>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {displayBlogs.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group block"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {post.metadata.image && (
              <div className="relative w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={post.metadata.image}
                  alt={post.metadata.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg tracking-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {post.metadata.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
              </div>
              {post.metadata.summary && (
                <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                  {post.metadata.summary}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
