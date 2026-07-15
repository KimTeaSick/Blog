import { slugify } from 'app/lib/slugify'

export type Heading = { level: number; text: string; slug: string }

// 원본 MDX 문자열에서 h2/h3 소제목을 추출. 코드블록(```) 내부는 제외.
export function getHeadings(content: string): Heading[] {
  const lines = content.split('\n')
  const headings: Heading[] = []
  let inCode = false

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inCode = !inCode
      continue
    }
    if (inCode) continue

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!match) continue

    const level = match[1].length
    // 인라인 강조 마커(**, *, `, _) 제거해 렌더된 텍스트와 일치시킴
    const text = match[2].replace(/[*_`]/g, '').trim()
    if (!text) continue

    headings.push({ level, text, slug: slugify(text) })
  }

  return headings
}
