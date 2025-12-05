import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prevent creating multiple connection pools in development
export const prisma = globalForPrisma.prisma ?? (() => {
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma