const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function apiCall(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  token?: string
) {
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
  create: (data: any, token: string) =>
    apiCall("/bookmarks", "POST", data, token),

  // Get all bookmarks
  getAll: (token: string) =>
    apiCall("/bookmarks", "GET", undefined, token),

  // Update bookmark
  update: (id: number, data: any, token: string) =>
    apiCall(`/bookmarks/${id}`, "PUT", data, token),

  // Delete bookmark
  delete: (id: number, token: string) =>
    apiCall(`/bookmarks/${id}`, "DELETE", undefined, token),
};