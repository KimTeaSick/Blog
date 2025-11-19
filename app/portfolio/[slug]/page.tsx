import { notFound } from 'next/navigation'
import Image from 'next/image'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getPortfolioProjects, getPortfolioProject } from 'app/portfolio/utils'
import { baseUrl } from 'app/sitemap'

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
  const ogImage = thumbnail || `${baseUrl}/og?title=${encodeURIComponent(title)}`

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

  return (
    <section>
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

      {/* Thumbnail */}
      {project.metadata.thumbnail && (
        <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={project.metadata.thumbnail}
            alt={project.metadata.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Header */}
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {project.metadata.title}
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 mb-8 text-sm gap-2">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(project.metadata.date)}
        </p>
        {project.metadata.tags && project.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      {(project.metadata.github || project.metadata.demo) && (
        <div className="flex gap-4 mb-8">
          {project.metadata.github && (
            <a
              href={project.metadata.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
            >
              GitHub
            </a>
          )}
          {project.metadata.demo && (
            <a
              href={project.metadata.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
            >
              Live Demo
            </a>
          )}
        </div>
      )}

      {/* Content */}
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={project.content} slug={slug} type="portfolio" />
      </article>

      {/* Image Gallery */}
      {project.images.length > 0 && (
        <div className="mt-12 space-y-4">
          {project.images.map((image, index) => (
            <div
              key={image}
              className="w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800"
            >
              <img
                src={image}
                alt={`${project.metadata.title} - Image ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
