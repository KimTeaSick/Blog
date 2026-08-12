import { NextRequest, NextResponse } from 'next/server'
import {
  assertKnownPost,
  attachVisitorCookie,
  engagementErrorResponse,
  getEngagement,
  getVisitor,
} from 'app/lib/engagement'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    assertKnownPost(slug)

    const visitor = getVisitor(request)
    const stats = await getEngagement(slug, visitor.hash)
    const response = NextResponse.json(stats)
    response.headers.set('Cache-Control', 'no-store')

    return attachVisitorCookie(response, visitor)
  } catch (error) {
    return engagementErrorResponse(error)
  }
}
