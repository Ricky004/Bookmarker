import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Bookmarks API routes
async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    const collection = await prisma.collection.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error('Collection creation error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collection = await prisma.collection.findMany({
      where: { userId },
      include: {
        _count: {
          select: { bookmarks: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.error('Collection fetch error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

