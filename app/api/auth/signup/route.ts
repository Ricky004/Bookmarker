import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json()
  const supabase = await createClient()

  // Sign up with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Create user in Prisma database
  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id, // Use Supabase UUID directly
          email: data.user.email!,
          name: name || email.split('@')[0], // Use provided name or email prefix
        },
      })
    } catch (dbError) {
      console.error('Failed to create user in database:', dbError)
      // User might already exist, which is okay
    }
  }

  return NextResponse.json({ message: 'Check your email to verify', user: data.user })
}