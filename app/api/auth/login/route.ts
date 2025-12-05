import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Ensure user exists in Prisma database (for existing users)
  if (data.user) {
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          email: data.user.email!,
        },
        create: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.email!.split('@')[0],
        },
      })
    } catch (dbError) {
      console.error('Failed to sync user in database:', dbError)
    }
  }

  return NextResponse.json({ user: data.user })
}