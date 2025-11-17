import Link from 'next/link'
import { BlogPosts } from 'app/components/posts'
import { PortfolioList } from 'app/components/portfolio-list'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Joseph Kim
      </h1>
      <p className="mb-4">
        {`I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in
        Vim's keystroke commands and tabs' flexibility for personal viewing
        preferences. This extends to my support for static typing, where its
        early error detection ensures cleaner code, and my preference for dark
        mode, which eases long coding sessions by reducing eye strain.`}
      </p>

      {/* Portfolio Section */}
      <div className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Projects
          </h2>
          <Link
            href="/portfolio"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            View all →
          </Link>
        </div>
        <PortfolioList limit={3} />
      </div>

      {/* Blog Section */}
      <div className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Posts
          </h2>
          <Link
            href="/blog"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            View all →
          </Link>
        </div>
        <BlogPosts limit={3} />
      </div>
    </section>
  )
}
