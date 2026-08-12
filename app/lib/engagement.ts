import 'server-only'

import { createHash, randomUUID } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'
import { getBlogPost } from 'app/blog/utils'

const VISITOR_COOKIE = 'blog_visitor_id'
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type DatabaseClient = ReturnType<typeof neon>

type RawStats = {
  views: string | number
  likes: string | number
  liked: boolean
}

export type EngagementStats = {
  views: number
  likes: number
  liked: boolean
}

export type Visitor = {
  id: string
  hash: string
  isNew: boolean
}

export class DatabaseNotConfiguredError extends Error {}
export class PostNotFoundError extends Error {}
export class InvalidOriginError extends Error {}

let database: DatabaseClient | null = null
let databaseUrl: string | null = null

function getDatabase(): DatabaseClient {
  const connectionString =
    process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!connectionString) {
    throw new DatabaseNotConfiguredError('Database is not configured.')
  }

  if (!database || databaseUrl !== connectionString) {
    database = neon(connectionString)
    databaseUrl = connectionString
  }

  return database
}

function normalizeStats(row: RawStats | undefined): EngagementStats {
  return {
    views: Number(row?.views ?? 0),
    likes: Number(row?.likes ?? 0),
    liked: Boolean(row?.liked),
  }
}

async function ensureStatsRow(sql: DatabaseClient, slug: string) {
  await sql`
    INSERT INTO post_stats (slug)
    VALUES (${slug})
    ON CONFLICT (slug) DO NOTHING
  `
}

export function assertKnownPost(slug: string) {
  if (!getBlogPost(slug)) {
    throw new PostNotFoundError('Post not found.')
  }
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')

  if (origin && origin !== request.nextUrl.origin) {
    throw new InvalidOriginError('Cross-origin mutation is not allowed.')
  }
}

export function getVisitor(request: NextRequest): Visitor {
  const existing = request.cookies.get(VISITOR_COOKIE)?.value
  const isNew = !existing || !UUID_PATTERN.test(existing)
  const id = isNew ? randomUUID() : existing

  return {
    id,
    hash: createHash('sha256').update(id).digest('hex'),
    isNew,
  }
}

export function attachVisitorCookie<T extends NextResponse>(
  response: T,
  visitor: Visitor
): T {
  if (visitor.isNew) {
    response.cookies.set({
      name: VISITOR_COOKIE,
      value: visitor.id,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    })
  }

  return response
}

export async function getEngagement(
  slug: string,
  visitorHash: string
): Promise<EngagementStats> {
  const sql = getDatabase()
  const rows = await sql`
    SELECT
      COALESCE((SELECT views FROM post_stats WHERE slug = ${slug}), 0)::TEXT AS views,
      COALESCE((SELECT likes FROM post_stats WHERE slug = ${slug}), 0)::TEXT AS likes,
      EXISTS(
        SELECT 1
        FROM post_likes
        WHERE slug = ${slug} AND visitor_hash = ${visitorHash}
      ) AS liked
  `

  return normalizeStats(rows[0] as RawStats | undefined)
}

export async function recordView(
  slug: string,
  visitorHash: string
): Promise<EngagementStats> {
  const sql = getDatabase()
  await ensureStatsRow(sql, slug)

  const rows = await sql`
    WITH inserted AS (
      INSERT INTO post_views_daily (slug, visitor_hash)
      VALUES (${slug}, ${visitorHash})
      ON CONFLICT (slug, visitor_hash, viewed_on) DO NOTHING
      RETURNING 1
    )
    UPDATE post_stats
    SET
      views = views + (SELECT COUNT(*) FROM inserted),
      updated_at = NOW()
    WHERE slug = ${slug}
    RETURNING
      views::TEXT AS views,
      likes::TEXT AS likes,
      EXISTS(
        SELECT 1
        FROM post_likes
        WHERE slug = ${slug} AND visitor_hash = ${visitorHash}
      ) AS liked
  `

  return normalizeStats(rows[0] as RawStats | undefined)
}

export async function addLike(
  slug: string,
  visitorHash: string
): Promise<EngagementStats> {
  const sql = getDatabase()
  await ensureStatsRow(sql, slug)

  const rows = await sql`
    WITH inserted AS (
      INSERT INTO post_likes (slug, visitor_hash)
      VALUES (${slug}, ${visitorHash})
      ON CONFLICT (slug, visitor_hash) DO NOTHING
      RETURNING 1
    )
    UPDATE post_stats
    SET
      likes = likes + (SELECT COUNT(*) FROM inserted),
      updated_at = NOW()
    WHERE slug = ${slug}
    RETURNING
      views::TEXT AS views,
      likes::TEXT AS likes,
      TRUE AS liked
  `

  return normalizeStats(rows[0] as RawStats | undefined)
}

export async function removeLike(
  slug: string,
  visitorHash: string
): Promise<EngagementStats> {
  const sql = getDatabase()
  await ensureStatsRow(sql, slug)

  const rows = await sql`
    WITH removed AS (
      DELETE FROM post_likes
      WHERE slug = ${slug} AND visitor_hash = ${visitorHash}
      RETURNING 1
    )
    UPDATE post_stats
    SET
      likes = GREATEST(
        likes - (SELECT COUNT(*) FROM removed),
        0
      ),
      updated_at = NOW()
    WHERE slug = ${slug}
    RETURNING
      views::TEXT AS views,
      likes::TEXT AS likes,
      FALSE AS liked
  `

  return normalizeStats(rows[0] as RawStats | undefined)
}

export function engagementErrorResponse(error: unknown) {
  if (error instanceof PostNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  if (error instanceof InvalidOriginError) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }

  if (error instanceof DatabaseNotConfiguredError) {
    return NextResponse.json(
      { error: 'Engagement database is not configured.' },
      { status: 503 }
    )
  }

  console.error('Engagement API error:', error)
  return NextResponse.json(
    { error: 'Unable to update engagement.' },
    { status: 500 }
  )
}
