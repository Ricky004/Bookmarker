"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useBookmarkRefresh } from "@/lib/context/BookmarkContext";
import { Edit } from "lucide-react"

interface EditBookmarkProps {
    bookmark: {
        id: string;
        url: string;
        title: string;
        description: string | null;
        collectionId: string | null;
    };
}

export function EditBookmark({ bookmark }: EditBookmarkProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState(bookmark.url)
    const [title, setTitle] = useState(bookmark.title)
    const [description, setDescription] = useState(bookmark.description || "")
    const [error, setError] = useState("")
    const { triggerRefresh } = useBookmarkRefresh();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const apiUrl = bookmark.collectionId 
                ? `/api/collections/${bookmark.collectionId}/bookmarks/${bookmark.id}`
                : `/api/bookmarks/${bookmark.id}`;
            
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    title,
                    description,
                    tags: [],
                    collectionId: bookmark.collectionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to edit bookmark');
            }

            // Close dialog (keep form values as they are the updated values)
            setOpen(false);
            
            // Trigger refresh for sidebar and bookmarks list
            triggerRefresh();

        } catch (err) {
           setError(err instanceof Error ? err.message : "Failed to edit bookmark")
        } finally {
           setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="" title="Edit">
                    <Edit className="h-8 w-8 p-1.5 rounded-lg transition-colors text-gray-600 hover:text-blue-600 hover:bg-blue-100" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Bookmark</DialogTitle>
                        <DialogDescription>
                            Edit bookmark. 
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-3">
                            <Label htmlFor="url">URL</Label>
                            <Input 
                                id="url" 
                                name="url" 
                                placeholder="https://www.google.com" 
                                value={url} 
                                onChange={(e) => setUrl(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input 
                                id="title" 
                                name="title" 
                                placeholder="Google article" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input 
                                id="description" 
                                name="description" 
                                placeholder="Brief article about AI agents" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}