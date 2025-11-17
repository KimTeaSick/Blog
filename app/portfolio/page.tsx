import { PortfolioList } from 'app/components/portfolio-list'

export const metadata = {
  title: 'Portfolio',
  description: 'View my portfolio projects.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        Portfolio
      </h1>
      <PortfolioList />
    </section>
  )
}
