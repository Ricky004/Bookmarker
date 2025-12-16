"use client";

import { useState, useEffect, useCallback } from "react";
import { bookmarkAPI, collectionAPI } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CreateBookmark } from "./CreateBookmark";
import { Header } from "./Header";
import { Separator } from "@/components/ui/separator";
import { useBookmarkRefresh } from "@/lib/context/BookmarkContext";

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
  const { refreshKey, triggerRefresh } = useBookmarkRefresh();

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
  }, [fetchCollectionData, refreshKey]);

  const handleDelete = async (bookmarkId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await bookmarkAPI.delete(collectionId, bookmarkId);
      setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
      triggerRefresh();
    } catch (err) {
      alert("Failed to delete: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                  {collection?.name || "Collection"}
                </h1>
                <CreateBookmark 
                  defaultCollectionId={collectionId}
                />
              </div>
              
              <Separator className="mb-6" />

              {bookmarks.length === 0 ? (
                <p className="text-gray-500 mt-4">No bookmarks in this collection yet.</p>
              ) : (
                <div className="space-y-3 mt-6">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      {/* Checkbox */}
                      <div className="flex items-center">
                        <input type="checkbox" className="w-5 h-5 rounded-full border-gray-300" disabled />
                      </div>
                      
                      {/* Icon/Logo */}
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
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
        <footer className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Built with ❤️ by <span className="font-medium text-gray-700">Tridip Dam</span>
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Ricky004"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/tridipdamofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
