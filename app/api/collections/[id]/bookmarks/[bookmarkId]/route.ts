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
  { params }: { params: Promise<{ id: string; bookmarkId: string }> }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookmarkId } = await params;
    const { url, title, description, collectionId, tags } = await req.json();

    // Verify bookmark belongs to user
    const existing = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    // Update bookmark
    const bookmark = await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        url,
        title,
        description,
        tags,
        collectionId: collectionId || null,
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
  { params }: { params: Promise<{ id: string; bookmarkId: string }> }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookmarkId } = await params;

    // Verify bookmark belongs to user before deleting
    const existing = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ message: "Bookmark deleted" }, { status: 200 });
  } catch (error) {
    console.error('Bookmark delete error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}