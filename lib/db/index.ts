import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as relations from './relations'
import * as schema from './schema'

// For server-side usage only
const isDevelopment = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

if (!process.env.DATABASE_URL && !isTest) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const connectionString =
  process.env.DATABASE_URL ??
  (isTest ? 'postgres://user:pass@localhost:5432/testdb' : undefined)

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
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
