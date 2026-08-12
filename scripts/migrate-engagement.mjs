import { neon } from '@neondatabase/serverless'

for (const envFile of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(envFile)
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error
    }
  }
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
const soft = process.argv.includes('--soft')

if (!connectionString) {
  if (soft) {
    console.log('Engagement migration skipped: DATABASE_URL is not configured.')
    process.exit(0)
  }

  throw new Error(
    'DATABASE_URL is required. Connect Neon Postgres in Vercel or add it to .env.local.'
  )
}

const sql = neon(connectionString)

await sql`
  CREATE TABLE IF NOT EXISTS post_stats (
    slug TEXT PRIMARY KEY,
    views BIGINT NOT NULL DEFAULT 0 CHECK (views >= 0),
    likes BIGINT NOT NULL DEFAULT 0 CHECK (likes >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

await sql`
  CREATE TABLE IF NOT EXISTS post_likes (
    slug TEXT NOT NULL REFERENCES post_stats(slug) ON DELETE CASCADE,
    visitor_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (slug, visitor_hash)
  )
`

await sql`
  CREATE TABLE IF NOT EXISTS post_views_daily (
    slug TEXT NOT NULL REFERENCES post_stats(slug) ON DELETE CASCADE,
    visitor_hash VARCHAR(64) NOT NULL,
    viewed_on DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (slug, visitor_hash, viewed_on)
  )
`

console.log('Engagement database migration completed.')
