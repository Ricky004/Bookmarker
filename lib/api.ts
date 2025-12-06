const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface BookmarkData {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  collectionId?: string;
}

interface CollectionData {
  name: string;
}

export async function apiCall<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API call failed");
  }

  return response.json();
}

export const bookmarkAPI = {
  // Create bookmark
  create: (data: BookmarkData, token?: string) =>
    apiCall("/bookmarks", "POST", data, token),

  // Get all bookmarks
  getAll: (token?: string) =>
    apiCall("/bookmarks", "GET", undefined, token),

  // Get bookmarks by collection
  getByCollection: (collectionId: string, token?: string) =>
    apiCall(`/collections/${collectionId}/bookmarks`, "GET", undefined, token),

  // Update bookmark
  update: (collectionId: string, bookmarkId: string, data: BookmarkData, token?: string) =>
    apiCall(`/collections/${collectionId}/bookmarks/${bookmarkId}`, "PUT", data, token),

  // Delete bookmark
  delete: (collectionId: string, bookmarkId: string, token?: string) =>
    apiCall(`/collections/${collectionId}/bookmarks/${bookmarkId}`, "DELETE", undefined, token),
};

export const collectionAPI = {
  // Create collection
  create: (data: CollectionData, token?: string) =>
    apiCall("/collections", "POST", data, token),

  // Get all collections
  getAll: (token?: string) =>
    apiCall("/collections", "GET", undefined, token),
};