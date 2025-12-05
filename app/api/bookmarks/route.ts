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
    const { url, title, description, collectionId, tags } = await req.json();

    // Create bookmark with user ID (string UUID from Supabase)
    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title,
        description,
        tags,
        userId,
        collectionId: collectionId || null,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error('Bookmark creation error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error('Bookmark fetch error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}