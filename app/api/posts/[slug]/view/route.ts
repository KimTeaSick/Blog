import { NextRequest, NextResponse } from 'next/server'
import {
  assertKnownPost,
  assertSameOrigin,
  attachVisitorCookie,
  engagementErrorResponse,
  getVisitor,
  recordView,
} from 'app/lib/engagement'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    assertSameOrigin(request)

    const { slug } = await params
    assertKnownPost(slug)

    const visitor = getVisitor(request)
    const stats = await recordView(slug, visitor.hash)
    const response = NextResponse.json(stats)
    response.headers.set('Cache-Control', 'no-store')

    return attachVisitorCookie(response, visitor)
  } catch (error) {
    return engagementErrorResponse(error)
  }
}
