import { notFound } from 'next/navigation'
import Image from 'next/image'
import { CustomMDX } from 'app/components/mdx'
import { getPortfolioProjects, getPortfolioProject } from 'app/portfolio/utils'
import { absoluteUrl, baseUrl } from 'app/lib/site'

export async function generateStaticParams() {
  const projects = getPortfolioProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getPortfolioProject(slug)
  if (!project) {
    return
  }

  const { title, description, date, thumbnail } = project.metadata
  const ogImage = thumbnail
    ? absoluteUrl(thumbnail)
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: date,
      url: `${baseUrl}/portfolio/${project.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function PortfolioProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getPortfolioProject(slug)

  if (!project) {
    notFound()
  }

  const heroImage = project.metadata.thumbnail || project.images[0]

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            headline: project.metadata.title,
            datePublished: project.metadata.date,
            description: project.metadata.description,
            image: project.metadata.thumbnail
              ? `${baseUrl}${project.metadata.thumbnail}`
              : `${baseUrl}/og?title=${encodeURIComponent(project.metadata.title)}`,
            url: `${baseUrl}/portfolio/${project.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />

      <header className="mx-auto w-full max-w-[1180px] px-5 pb-12 pt-14 md:px-11 md:pb-16 md:pt-24">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
          Portfolio / Case study
        </p>
        <h1 className="title mt-5 max-w-[20ch] text-[clamp(2.125rem,5.5vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
          {project.metadata.title}
        </h1>
        <p className="mt-6 max-w-[56ch] text-pretty text-[clamp(1rem,1.7vw,1.125rem)] leading-7 text-[var(--muted)]">
          {project.metadata.description}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--muted)]">
          <time>{project.metadata.date.replaceAll('-', '.')}</time>
          <span aria-hidden="true">/</span>
          {project.metadata.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--line)] px-2.5 py-1">
              {tag}
            </span>
          ))}
        </div>
        {(project.metadata.github || project.metadata.demo) && (
          <div className="mt-7 flex flex-wrap gap-3">
            {project.metadata.github && (
              <a
                href={project.metadata.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[3px] bg-[var(--fg)] px-5 py-3 text-sm font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
              >
                GitHub ↗
              </a>
            )}
            {project.metadata.demo && (
              <a
                href={project.metadata.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[3px] border border-[var(--line)] px-5 py-3 text-sm font-semibold transition-colors hover:border-[var(--fg)]"
              >
                서비스 보기 ↗
              </a>
            )}
          </div>
        )}
      </header>

      {heroImage && (
        <section className="mx-auto w-full max-w-[1180px] px-5 pb-14 md:px-11 md:pb-20">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-[var(--bg-soft)]">
            <Image
              src={heroImage}
              alt={`${project.metadata.title} 대표 화면`}
              fill
              sizes="(max-width: 1180px) 100vw, 1100px"
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-10 md:px-11 md:pb-28 md:pt-14">
          <article className="prose max-w-[760px]">
            <CustomMDX source={project.content} slug={slug} type="portfolio" />
          </article>

          {project.images.length > 0 && (
            <div className="mt-16 border-t border-[var(--line)] pt-9">
              <p className="mb-6 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                Project gallery
              </p>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                {project.images.map((image, index) => (
                  <div
                    key={image}
                    className="w-[88%] shrink-0 snap-center overflow-hidden rounded-sm bg-[var(--bg-soft)] sm:w-[62%] lg:w-[48%]"
                  >
                    <img
                      src={image}
                      alt={`${project.metadata.title} 화면 ${index + 1}`}
                      className="h-auto w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
