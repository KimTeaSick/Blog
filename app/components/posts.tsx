import { getBlogPosts } from 'app/blog/utils'
import { BlogArchive, type BlogArchiveItem, PostCard } from './blog-archive'

type BlogPostsProps = {
  limit?: number
  variant?: 'grid' | 'archive'
}

const presentationBySlug: Record<
  string,
  Pick<BlogArchiveItem, 'category' | 'tags'>
> = {
  token_in_LLM: { category: 'AI', tags: ['LLM', '토큰', '비용'] },
  hook_and_skill_and_rule: { category: 'AI', tags: ['에이전트', '도구'] },
  web3: { category: 'Frontend', tags: ['Web3', '면접'] },
  vibecoding: { category: '회고', tags: ['회고', '블로그'] },
}

function toArchiveItem(post: ReturnType<typeof getBlogPosts>[number]): BlogArchiveItem {
  const presentation = presentationBySlug[post.slug] ?? {
    category: 'Engineering',
    tags: ['개발'],
  }

  return {
    slug: post.slug,
    title: post.metadata.title,
    summary: post.metadata.summary,
    date: post.metadata.publishedAt.replaceAll('-', '.'),
    image: post.metadata.image || post.images[0],
    ...presentation,
  }
}

export function BlogPosts({ limit, variant = 'grid' }: BlogPostsProps = {}) {
  const allPosts = getBlogPosts()
  const posts = (limit ? allPosts.slice(0, limit) : allPosts).map(toArchiveItem)

  if (variant === 'archive') {
    return <BlogArchive posts={posts} />
  }

  if (posts.length === 0) {
    return <p className="text-[var(--muted)]">아직 작성된 글이 없습니다.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
