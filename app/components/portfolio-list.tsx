import Image from 'next/image'
import Link from 'next/link'
import { getPortfolioProjects } from 'app/portfolio/utils'

export function PortfolioList({
  limit,
  variant = 'list',
}: {
  limit?: number
  variant?: 'list' | 'compact'
}) {
  const allProjects = getPortfolioProjects()
  const projects = limit ? allProjects.slice(0, limit) : allProjects

  if (projects.length === 0) {
    return <p className="text-[var(--muted)]">아직 등록된 프로젝트가 없습니다.</p>
  }

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {projects.map((project, index) => {
          const thumbnail = project.metadata.thumbnail || project.images[0]
          const fallbackThumbnail = `/og?title=${encodeURIComponent(project.metadata.title)}&description=${encodeURIComponent(project.metadata.description)}`

          return (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[var(--bg-soft)]">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={`${project.metadata.title} 썸네일`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90"
                  />
                ) : (
                  <img
                    src={fallbackThumbnail}
                    alt={`${project.metadata.title} 썸네일`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90"
                  />
                )}
                <span className="absolute left-3 top-3 bg-[var(--bg)] px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-[var(--fg)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-4 text-balance text-xl font-semibold leading-snug tracking-[-0.025em] transition-colors group-hover:text-[var(--accent)]">
                {project.metadata.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {project.metadata.description}
              </p>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {projects.map((project, index) => {
        const image = project.metadata.thumbnail || project.images[0]
        return (
          <Link
            key={project.slug}
            href={`/portfolio/${project.slug}`}
            className="group -mx-3 flex flex-wrap items-start gap-6 border-t border-[var(--line)] px-3 py-8 transition-colors hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:-mx-7 md:gap-11 md:px-7 md:py-10"
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm bg-[var(--bg-soft)] sm:w-[280px]">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 280px"
                  className="object-cover transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90"
                />
              ) : (
                <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,var(--line)_0_1px,transparent_1px_11px)]" />
              )}
              <span className="absolute left-3 top-3 bg-[var(--bg)] px-2 py-1 font-mono text-[10px] tracking-[0.08em]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="min-w-0 flex-1 sm:pt-1">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--muted)]">
                <span className="border border-[var(--line)] px-2.5 py-1 uppercase tracking-[0.08em]">
                  {getRole(project.slug)}
                </span>
                <time>{project.metadata.date.replaceAll('-', '.')}</time>
              </div>
              <h2 className="mt-4 text-balance text-[clamp(1.45rem,3vw,2rem)] font-semibold leading-[1.18] tracking-[-0.03em] transition-colors group-hover:text-[var(--accent)]">
                {project.metadata.title}
              </h2>
              <p className="mt-3 max-w-[56ch] text-pretty text-[clamp(0.95rem,1.5vw,1.05rem)] leading-7 text-[var(--muted)]">
                {project.metadata.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm bg-[var(--bg-soft)] px-2.5 py-1 font-mono text-[11px] text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function getRole(slug: string) {
  if (slug === 'argo4s') return 'Full Stack'
  if (['mrmr', 'smart-safety'].includes(slug)) return 'Mobile'
  return 'Frontend'
}
