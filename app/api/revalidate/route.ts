import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts } from 'app/blog/utils'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = process.env.REVALIDATION_TOKEN

  // 보안: Authorization 토큰 확인
  if (!token || authHeader !== `Bearer ${token}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { path, slug } = body

    // 특정 경로만 revalidate
    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now()
      })
    }

    // 특정 블로그 포스트만 revalidate
    if (slug) {
      revalidatePath(`/blog/${slug}`)
      revalidatePath('/blog')
      revalidatePath('/')
      return NextResponse.json({
        revalidated: true,
        slug,
        paths: [`/blog/${slug}`, '/blog', '/'],
        now: Date.now()
      })
    }

    // 전체 블로그 페이지 revalidate
    const posts = getBlogPosts()
    const paths = [
      '/',
      '/blog',
      ...posts.map(post => `/blog/${post.slug}`)
    ]

    paths.forEach(path => revalidatePath(path))

    return NextResponse.json({
      revalidated: true,
      count: paths.length,
      paths,
      now: Date.now()
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Error revalidating', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET 요청으로 상태 확인
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Use POST request with Authorization header to revalidate'
  })
}
