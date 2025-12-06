"use client"

import * as React from "react"
import Link from "next/link"
import { CreateCollection } from "@/components/CreateCollection"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useCallback, useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { collectionAPI } from "@/lib/api"
import { Bookmark } from "lucide-react"

interface Collection {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  _count?: {
    bookmarks: number;
  };
}

const collectionColors = [
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-cyan-500 to-cyan-600',
  'from-blue-500 to-blue-600',
  'from-gray-400 to-gray-500',
  'from-pink-500 to-pink-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const data = await collectionAPI.getAll();
      setCollections(data as Collection[]);
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 font-bold text-emerald-400 text-xl mb-4 ml-1">
          <Bookmark className="w-6 h-6" />
          <span>BookMarker</span>
        </div>
        <CreateCollection />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/" className="text-slate-200 hover:text-white">
                    Home
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                <div className="px-2 py-1 text-sm text-slate-400">Loading...</div>
              ) : collections.length === 0 ? (
                <div className="px-2 py-1 text-sm text-slate-400">No collections yet</div>
              ) : (
                collections.map((collection, index) => {
                  const colorClass = collectionColors[index % collectionColors.length];
                  const bookmarkCount = collection._count?.bookmarks || 0;
                  
                  return (
                    <SidebarMenuItem key={collection.id}>
                      <Link 
                        href={`/collections/${collection.id}`}
                        className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 hover:text-white transition-colors group"
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-sm">
                            {collection.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Name */}
                        <span className="flex-1 text-sm font-medium truncate">
                          {collection.name}
                        </span>
                        
                        {/* Count Badge */}
                        <span className="px-2 py-0.5 text-xs rounded-md bg-slate-700/50 text-slate-300 group-hover:bg-slate-600/50">
                          {bookmarkCount}
                        </span>
                      </Link>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
