import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { Comments } from 'app/components/comments'
import { TableOfContents } from 'app/components/table-of-contents'
import { getBlogPosts } from 'app/blog/utils'
import { getHeadings } from 'app/lib/toc'
import { absoluteUrl, getBlogOgImage, siteConfig } from 'app/lib/site'
import { ShareMenu } from 'app/components/share-menu'
import type { Metadata } from 'next'

// ISR: 60초마다 자동으로 재검증
export const revalidate = 60

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata | undefined> {
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)
  if (!post) {
    return
  }

  let { title, publishedAt: publishedTime, summary: description } = post.metadata
  const pageUrl = absoluteUrl(`/blog/${post.slug}`)
  const ogImage = getBlogOgImage(title, description)

  return {
    title,
    description,
    keywords: ['프론트엔드', '웹 개발', 'JavaScript', 'TypeScript', 'React', 'Next.js'],
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    category: 'technology',
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: pageUrl,
      siteName: siteConfig.name,
      locale: 'ko_KR',
      authors: [siteConfig.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} 공유 썸네일`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  const headings = getHeadings(post.content)
  const pageUrl = absoluteUrl(`/blog/${post.slug}`)
  const ogImage = getBlogOgImage(post.metadata.title, post.metadata.summary)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.publishedAt,
    description: post.metadata.summary,
    image: [ogImage],
    url: pageUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    inLanguage: 'ko-KR',
    author: {
      '@type': 'Person',
      name: siteConfig.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <header className="mx-auto w-full max-w-[1180px] px-5 pb-12 pt-14 md:px-11 md:pb-16 md:pt-24">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
          Engineering blog
        </p>
        <h1 className="title mt-5 max-w-[17ch] text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
          {post.metadata.title}
        </h1>
        <p className="mt-6 max-w-[54ch] text-pretty text-[clamp(1rem,1.7vw,1.125rem)] leading-7 text-[var(--muted)]">
          {post.metadata.summary}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
          <time className="font-mono text-xs text-[var(--muted)]">
            {post.metadata.publishedAt.replaceAll('-', '.')}
          </time>
          <ShareMenu url={pageUrl} />
        </div>
      </header>
      <section className="border-t border-[var(--line)]">
        <div className="post-layout mx-auto w-full max-w-[1180px] px-5 pb-20 pt-10 md:px-11 md:pb-28 md:pt-14">
          <article className="prose max-w-none">
            <CustomMDX source={post.content} slug={slug} />
          </article>
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
            </div>
          </aside>
          <div className="max-w-[760px] xl:col-start-1">
            <Comments />
          </div>
        </div>
      </section>
    </>
  )
}
