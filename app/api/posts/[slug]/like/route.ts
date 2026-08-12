import { NextRequest, NextResponse } from 'next/server'
import {
  addLike,
  assertKnownPost,
  assertSameOrigin,
  attachVisitorCookie,
  engagementErrorResponse,
  getVisitor,
  removeLike,
} from 'app/lib/engagement'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function updateLike(
  request: NextRequest,
  params: Promise<{ slug: string }>,
  liked: boolean
) {
  try {
    assertSameOrigin(request)

    const { slug } = await params
    assertKnownPost(slug)

    const visitor = getVisitor(request)
    const stats = liked
      ? await addLike(slug, visitor.hash)
      : await removeLike(slug, visitor.hash)
    const response = NextResponse.json(stats)
    response.headers.set('Cache-Control', 'no-store')

    return attachVisitorCookie(response, visitor)
  } catch (error) {
    return engagementErrorResponse(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return updateLike(request, params, true)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return updateLike(request, params, false)
}
