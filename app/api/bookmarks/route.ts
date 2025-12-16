import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
    const { url, title, description, tags, collectionId } = await req.json();

    // If collectionId is provided, verify it belongs to user
    if (collectionId) {
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId }
      });

      if (!collection || collection.userId !== userId) {
        return NextResponse.json({ error: "Collection not found" }, { status: 404 });
      }
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title,
        description,
        tags: tags || [],
        user: {
          connect: { id: userId }
        },
        ...(collectionId && {
          collection: {
            connect: { id: collectionId }
          }
        }),
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

