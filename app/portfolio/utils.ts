import fs from 'fs'
import path from 'path'

export type PortfolioMetadata = {
  title: string
  description: string
  date: string
  tags: string[]
  thumbnail?: string
  github?: string
  demo?: string
}

export type PortfolioProject = {
  slug: string
  metadata: PortfolioMetadata
  content: string
  images: string[]
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) {
    throw new Error('No frontmatter found')
  }

  const frontMatterBlock = match[1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<PortfolioMetadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()

    // Remove quotes
    value = value.replace(/^['"](.*)['"]$/, '$1')

    // Handle tags array
    if (key.trim() === 'tags') {
      const tagsMatch = value.match(/\[(.*)\]/)
      if (tagsMatch) {
        metadata.tags = tagsMatch[1]
          .split(',')
          .map((tag) => tag.trim().replace(/['"]/g, ''))
      }
    } else {
      metadata[key.trim() as keyof PortfolioMetadata] = value as any
    }
  })

  return { metadata: metadata as PortfolioMetadata, content }
}

function getProjectImages(projectPath: string): string[] {
  try {
    const files = fs.readdirSync(projectPath)
    return files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext) &&
               !file.startsWith('thumbnail')
      })
      .sort()
  } catch (error) {
    return []
  }
}

export function getPortfolioProjects(): PortfolioProject[] {
  const portfolioDir = path.join(process.cwd(), 'public', 'portfolio')

  // Create directory if it doesn't exist
  if (!fs.existsSync(portfolioDir)) {
    return []
  }

  const projectDirs = fs.readdirSync(portfolioDir).filter((file) => {
    const filePath = path.join(portfolioDir, file)
    return fs.statSync(filePath).isDirectory()
  })

  return projectDirs
    .map((dir) => {
      const projectPath = path.join(portfolioDir, dir)
      const detailPath = path.join(projectPath, 'detail.md')

      if (!fs.existsSync(detailPath)) {
        return null
      }

      const fileContent = fs.readFileSync(detailPath, 'utf-8')
      const { metadata, content } = parseFrontmatter(fileContent)
      const images = getProjectImages(projectPath)

      // Set default thumbnail if not specified
      if (!metadata.thumbnail) {
        // Try to find thumbnail with any supported extension
        const thumbnailFiles = fs.readdirSync(projectPath).filter((file) =>
          file.startsWith('thumbnail')
        )
        if (thumbnailFiles.length > 0) {
          metadata.thumbnail = `/portfolio/${dir}/${thumbnailFiles[0]}`
        }
      }

      return {
        slug: dir,
        metadata,
        content,
        images: images.map((img) => `/portfolio/${dir}/${img}`),
      }
    })
    .filter((project): project is PortfolioProject => project !== null)
    .sort((a, b) => {
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    })
}

export function getPortfolioProject(slug: string): PortfolioProject | null {
  const projects = getPortfolioProjects()
  return projects.find((project) => project.slug === slug) || null
}

export function formatDate(date: string): string {
  const targetDate = new Date(date)
  return targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
