"use client"

import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import BookmarksList from "./BookmarksList"
import { Header } from "./Header"

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Welcome to Bookmark Manager</h1>
          
          {/* Instructions Card */}
          <div className="mt-6 p-6 bg-linear-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">🚀 Getting Started</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <p><span className="font-medium">Create a Collection:</span> Click the &quot;New Collection&quot; button in the sidebar to organize your bookmarks</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <p><span className="font-medium">Add Bookmarks:</span> Click on any collection from the sidebar to open it and start adding bookmarks</p>
              </div>
            </div>
          </div>

          <BookmarksList />
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
  )
}
