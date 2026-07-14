import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

export type BlogPost = {
  slug: string
  metadata: Metadata
  content: string
  images: string[]
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  if (!match) {
    return null
  }
  let frontMatterBlock = match[1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getPostImages(postPath: string): string[] {
  try {
    const files = fs.readdirSync(postPath)
    return files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)
      })
      .sort()
  } catch (error) {
    return []
  }
}

export function getBlogPosts(): BlogPost[] {
  const postsDir = path.join(process.cwd(), 'contents', 'blog', 'posts')

  if (!fs.existsSync(postsDir)) {
    return []
  }

  const entries = fs.readdirSync(postsDir)

  return entries
    .map((entry) => {
      const entryPath = path.join(postsDir, entry)
      const stat = fs.statSync(entryPath)

      let slug: string
      let metadata: Metadata
      let content: string
      let images: string[] = []

      if (stat.isDirectory()) {
        // Folder structure: posts/slug/content.mdx
        const contentPath = path.join(entryPath, 'content.mdx')

        if (!fs.existsSync(contentPath)) {
          return null
        }

        const fileContent = fs.readFileSync(contentPath, 'utf-8')
        const parsed = parseFrontmatter(fileContent)

        if (!parsed) {
          console.warn(`Skipping post without valid frontmatter: ${entry}`)
          return null
        }

        slug = entry
        metadata = parsed.metadata
        content = parsed.content
        images = getPostImages(entryPath).map(img => `/api/blog-image/${slug}/${img}`)
      } else if (path.extname(entry) === '.mdx') {
        // Legacy file structure: posts/slug.mdx
        const fileContent = fs.readFileSync(entryPath, 'utf-8')
        const parsed = parseFrontmatter(fileContent)

        if (!parsed) {
          console.warn(`Skipping post without valid frontmatter: ${entry}`)
          return null
        }

        slug = path.basename(entry, '.mdx')
        metadata = parsed.metadata
        content = parsed.content
      } else {
        return null
      }

      return {
        slug,
        metadata,
        content,
        images,
      }
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    })
}

export function getBlogPost(slug: string): BlogPost | null {
  const posts = getBlogPosts()
  return posts.find((post) => post.slug === slug) || null
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
