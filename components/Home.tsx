"use client"

import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CreateBookmark } from "./CreateBookmark"
import BookmarksList from "./BookmarksList"

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold">Welcome to Bookmark Manager</h1>
          <p className="mt-2 text-muted-foreground">Select an item from the sidebar to get started.</p>
          <CreateBookmark />
          <BookmarksList />
        </main>
        <footer className="p-4 border-t">
          <p className="text-sm text-muted-foreground">Powered by Next.js</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
