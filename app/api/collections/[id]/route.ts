import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function getUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: collectionId } = await params;

    // Validate that collectionId exists
    if (!collectionId) {
      return NextResponse.json({ error: "Collection ID is required" }, { status: 400 });
    }

    // First, check if the collection exists and belongs to the user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId: userId,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // Delete all bookmarks in the collection first
    await prisma.bookmark.deleteMany({
      where: {
        collectionId: collectionId,
      },
    });

    // Then delete the collection
    await prisma.collection.delete({
      where: {
        id: collectionId,
      },
    });

    return NextResponse.json({ message: "Collection deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Collection deletion error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}