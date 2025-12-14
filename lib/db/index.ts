import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as relations from './relations'
import * as schema from './schema'

// For server-side usage only
const isDevelopment = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

const connectionString =
  process.env.DATABASE_URL ??
  (isTest
    ? 'postgres://user:pass@localhost:5432/testdb'
    : 'postgres://user:pass@localhost:5432/postgres')

if (!process.env.DATABASE_URL && !isTest) {
  // Avoid crashing during build/CI environments that don't provide runtime
  // secrets. Any real DB access will still fail unless a valid DATABASE_URL is
  // provided at runtime.
  console.warn('[DB] DATABASE_URL is not set. Using a placeholder connection.')
}

// Log which connection is being used (for debugging)
if (isDevelopment) {
  console.log('[DB] Using PostgreSQL connection')
}

// SSL configuration for cloud databases (Supabase, Neon, etc.)
const sslDisabled = process.env.DATABASE_SSL_DISABLED === 'true'

const client = postgres(connectionString, {
  ssl: sslDisabled ? false : { rejectUnauthorized: false },
  prepare: false,
  max: 20
})

export const db = drizzle(client, {
  schema: { ...schema, ...relations }
})

// Helper type for all tables
export type Schema = typeof schema
