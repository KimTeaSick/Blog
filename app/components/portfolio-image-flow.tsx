import Image from 'next/image'
import { getPortfolioProjects } from 'app/portfolio/utils'

const columnAnimations = [
  'animate-[portfolio-flow-up_33s_linear_infinite]',
  'animate-[portfolio-flow-down_39s_linear_infinite]',
  'animate-[portfolio-flow-up_36s_linear_infinite]',
  'animate-[portfolio-flow-down_30s_linear_infinite]',
  'animate-[portfolio-flow-up_42s_linear_infinite]',
  'animate-[portfolio-flow-down_33s_linear_infinite]',
]

export function PortfolioImageFlow() {
  const images = Array.from(
    new Set(
      getPortfolioProjects().flatMap((project) => [
        ...(project.metadata.thumbnail ? [project.metadata.thumbnail] : []),
        ...project.images,
      ])
    )
  )

  if (images.length === 0) return null

  const columns = Array.from({ length: 6 }, (_, columnIndex) =>
    Array.from(
      { length: 5 },
      (_, imageIndex) => images[(columnIndex * 4 + imageIndex * 3) % images.length]
    )
  )

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-md bg-[var(--bg-soft)] md:aspect-[21/8] md:min-h-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-6 gap-2 bg-[var(--bg-soft)] p-2 md:gap-3 md:p-3"
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="overflow-hidden rounded-sm">
            <div
              className={`flex will-change-transform flex-col ${columnAnimations[columnIndex]}`}
            >
              {[0, 1].map((copyIndex) => (
                <div
                  key={copyIndex}
                  className="flex flex-col gap-2 pb-2 md:gap-3 md:pb-3"
                >
                  {column.map((src, imageIndex) => (
                    <div
                      key={`${copyIndex}-${src}-${imageIndex}`}
                      className="relative aspect-[1/2] overflow-hidden rounded-sm bg-[var(--bg)] shadow-sm"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 16vw, 170px"
                        className="object-cover opacity-75 saturate-[0.8] transition-opacity dark:opacity-55"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--bg)_0%,transparent_18%,transparent_82%,var(--bg)_100%)] opacity-45" />

      <div className="absolute inset-0 z-10 flex items-center justify-center p-5 md:p-8">
        <div className="w-full max-w-[620px] rounded border border-neutral-200 bg-white p-5 text-neutral-950 shadow-2xl dark:border-neutral-800 dark:bg-black dark:text-white md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
            <span>Frontend / Interaction</span>
            <span>Portfolio flow · 2019 — Now</span>
          </div>
          <p className="mt-16 max-w-[24ch] text-balance text-2xl font-semibold leading-tight tracking-[-0.03em] md:mt-20 md:text-4xl">
            기술보다 먼저, 사람이 편하게 쓸 수 있는 구조를 생각합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
