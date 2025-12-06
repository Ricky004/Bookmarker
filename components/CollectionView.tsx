"use client";

import { useState, useEffect, useCallback } from "react";
import { bookmarkAPI, collectionAPI } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CreateBookmark } from "./CreateBookmark";

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string | null;
  collectionId: string | null;
  tags: string[];
  createdAt: string;
}

interface Collection {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export default function CollectionView({ collectionId }: { collectionId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = getSupabaseBrowserClient();

  const fetchCollectionData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      // Fetch collection details and bookmarks
      const [collectionsData, bookmarksData] = await Promise.all([
        collectionAPI.getAll(),
        bookmarkAPI.getByCollection(collectionId)
      ]);

      const currentCollection = (collectionsData as Collection[]).find(c => c.id === collectionId);
      setCollection(currentCollection || null);
      setBookmarks(bookmarksData as Bookmark[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [supabase, collectionId]);

  useEffect(() => {
    fetchCollectionData();
  }, [fetchCollectionData]);

  const handleDelete = async (bookmarkId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await bookmarkAPI.delete(collectionId, bookmarkId);
      setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
    } catch (err) {
      alert("Failed to delete: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-4">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">
                {collection?.name || "Collection"}
              </h1>
              
              <CreateBookmark defaultCollectionId={collectionId} />

              {bookmarks.length === 0 ? (
                <p className="text-gray-500 mt-4">No bookmarks in this collection yet.</p>
              ) : (
                <div className="space-y-3 mt-6">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      {/* Checkbox */}
                      <div className="flex items-center">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                      </div>
                      
                      {/* Icon/Logo */}
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                          {bookmark.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {bookmark.title}
                          </a>
                          <button className="text-yellow-400 hover:text-yellow-500">
                            ⭐
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bookmark.description}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Share">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(bookmark.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <svg className="w-5 h-5 text-gray-600 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="More">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
        <footer className="p-4 border-t">
          <p className="text-sm text-muted-foreground">Powered by Next.js</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
