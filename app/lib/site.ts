export const siteConfig = {
  name: 'jo5eph dev blog',
  author: 'Joseph Kim',
  description:
    '개발 과정에서 배운 것과 생각을 기록하는 프론트엔드 개발 블로그입니다.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-omega-six-74.vercel.app').replace(
    /\/$/,
    ''
  ),
}

export const baseUrl = siteConfig.url

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }

  return `${baseUrl}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

export function getBlogOgImage(title: string, description?: string) {
  const params = new URLSearchParams({ title })
  if (description) params.set('description', description)
  return absoluteUrl(`/og?${params.toString()}`)
}
