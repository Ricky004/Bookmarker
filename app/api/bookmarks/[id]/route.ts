import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, title, description, tags, collectionId } = await req.json();
    const bookmarkId = params.id;

    // Verify bookmark exists and belongs to user
    const existingBookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId }
    });

    if (!existingBookmark || existingBookmark.userId !== userId) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    // Update bookmark
    const bookmark = await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        url,
        title,
        description,
        tags: tags || [],
        ...(collectionId !== undefined && { collectionId }),
      },
    });

    return NextResponse.json(bookmark, { status: 200 });
  } catch (error) {
    console.error('Bookmark update error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookmarkId = params.id;

    // Verify bookmark exists and belongs to user
    const existingBookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId }
    });

    if (!existingBookmark || existingBookmark.userId !== userId) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    // Delete bookmark
    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ message: "Bookmark deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Bookmark deletion error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}