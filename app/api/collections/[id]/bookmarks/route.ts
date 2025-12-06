import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Bookmarks API routes

async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function POST(req: NextRequest, 
  {params}: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: collectionId } = await params;
    const { url, title, description, tags } = await req.json();

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId }
    })

    if (!collection || collection.userId !== userId) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // Create bookmark with user ID (string UUID from Supabase)
    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title,
        description,
        tags: tags || [],
        user: {
          connect: { id: userId }
        },
        collection: {
          connect: { id: collectionId }
        },
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error('Bookmark creation error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: collectionId } = await params;

    // Verify collection belongs to user
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection || collection.userId !== userId) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { collectionId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error('Bookmark fetch error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}