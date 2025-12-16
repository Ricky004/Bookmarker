"use client";

import { useState, useEffect, useCallback } from "react";
import { bookmarkAPI } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react"
import { useBookmarkRefresh } from "@/lib/context/BookmarkContext";
import { EditBookmark } from "./EditBookmark";

interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string | null;
  collectionId: string | null;
  tags: string[];
  createdAt: string;
}

export default function BookmarksList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { refreshKey, triggerRefresh } = useBookmarkRefresh();

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors
      
      const supabaseClient = getSupabaseBrowserClient();
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const data = await bookmarkAPI.getAll();
      
      if (!data || !Array.isArray(data)) {
        setError("Invalid data received from server");
        return;
      }
      
      setBookmarks(data as Bookmark[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookmarks");
    } finally {
      setLoading(false);
    }
  }, []); // Remove supabase dependency

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks, refreshKey]);

  const handleDelete = async (collectionId: string | null, bookmarkId: string) => {
    try {
      setError("")

      const supabaseClient = getSupabaseBrowserClient();
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) return;

      if (!collectionId) {
        alert("Cannot delete bookmark without collection");
        return;
      }

      await bookmarkAPI.delete(collectionId, bookmarkId);

      setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
      
      triggerRefresh();
     
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete bookmark")
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Bookmarks</h2>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500">No bookmarks yet. Add one!</p>
      ) : (
        <div className="space-y-3">
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
                <EditBookmark bookmark={bookmark} />
                <button 
                  onClick={() => handleDelete(bookmark.collectionId, bookmark.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors" 
                  title="Delete"
                >
                  <Trash2 className="text-gray-500"/>
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="More">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}