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

export function CreateBookmark() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    title,
                    description,
                    tags: [],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create bookmark');
            }

            // Reset form and close dialog
            setUrl("");
            setTitle("");
            setDescription("");
            setOpen(false);
            
            // Refresh the page to show new bookmark
            window.location.reload();
        } catch (err) {
           setError(err instanceof Error ? err.message : "Failed to create bookmark")
        } finally {
           setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Bookmark</DialogTitle>
                        <DialogDescription>
                            Save a new bookmark to your collection. Add a URL, title, and description to organize your saved links.
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
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
