import { useState, useEffect, useCallback } from "react";

export interface BookmarkedPost {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  excerpt?: string | null;
  bookmarkedAt: string;
}

const STORAGE_KEY = "inkwell_bookmarks";

function getStored(): BookmarkedPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>(getStored);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setBookmarks(getStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addBookmark = useCallback((post: Omit<BookmarkedPost, "bookmarkedAt">) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === post.id)) return prev;
      const next = [{ ...post, bookmarkedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.some((b) => b.id === id);
  }, [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
