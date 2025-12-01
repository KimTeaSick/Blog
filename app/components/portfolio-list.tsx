import Link from "next/link";
import Image from "next/image";
import { formatDate, getPortfolioProjects } from "app/portfolio/utils";

export function PortfolioList({ limit }: { limit?: number }) {
  let projects = getPortfolioProjects();

  if (limit) {
    projects = projects.slice(0, limit);
  }

  if (projects.length === 0) {
    return (
      <p className="text-neutral-600 dark:text-neutral-400">
        No portfolio projects yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/portfolio/${project.slug}`}
          className="group block"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {project.metadata.thumbnail && (
              <div className="relative w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={project.metadata.thumbnail}
                  alt={project.metadata.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg tracking-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {project.metadata.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
                  {formatDate(project.metadata.date)}
                </p>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-2">
                {project.metadata.description}
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
          </div>
        </Link>
      ))}
    </div>
  );
}
