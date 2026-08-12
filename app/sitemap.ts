import { getBlogPosts } from 'app/blog/utils'
import { getPortfolioProjects } from 'app/portfolio/utils'
import { baseUrl } from 'app/lib/site'

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let portfolio = getPortfolioProjects().map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.metadata.date,
  }))

  let routes = ['', '/blog', '/portfolio'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs, ...portfolio]
}
