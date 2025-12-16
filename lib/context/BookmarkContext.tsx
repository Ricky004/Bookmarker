// lib/context/BookmarkContext.tsx
"use client"

import React, { createContext, useContext, useCallback, useState } from 'react';

interface BookmarkContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <BookmarkContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarkRefresh() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarkRefresh must be used within BookmarkProvider');
  }
  return context;
}