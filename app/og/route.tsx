import { ImageResponse } from 'next/og'

export function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || 'jo5eph dev blog'
  let description =
    url.searchParams.get('description') ||
    '개발 과정에서 배운 것과 생각을 기록합니다.'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '72px 80px',
          color: '#f8fafc',
          background:
            'radial-gradient(circle at 82% 18%, #6266d1 0, transparent 36%), linear-gradient(135deg, #0f172a 0%, #172554 52%, #312e81 100%)',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#93c5fd' }}>
          JO5EPH · DEV BLOG
        </div>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ margin: 0, maxWidth: 1000, fontSize: 64, lineHeight: 1.15, letterSpacing: '-0.04em' }}>
            {title}
          </h1>
          <p style={{ margin: '28px 0 0', maxWidth: 920, fontSize: 28, lineHeight: 1.45, color: '#cbd5e1' }}>
            {description}
          </p>
        </div>
        <div style={{ display: 'flex', fontSize: 22, color: '#94a3b8' }}>
          blog-omega-six-74.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  )
}
