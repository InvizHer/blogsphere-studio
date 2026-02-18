import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

export interface BookmarkedPost {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  excerpt?: string | null;
  bookmarkedAt: string;
}

const STORAGE_KEY = "inkwell_bookmarks";

// Shared store so all components using useBookmarks see updates instantly
let listeners: Array<() => void> = [];
let cachedBookmarks: BookmarkedPost[] | null = null;

function getStored(): BookmarkedPost[] {
  if (cachedBookmarks !== null) return cachedBookmarks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cachedBookmarks = raw ? JSON.parse(raw) : [];
  } catch {
    cachedBookmarks = [];
  }
  return cachedBookmarks!;
}

function setStored(next: BookmarkedPost[]) {
  cachedBookmarks = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return getStored();
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Also listen to storage events from other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        cachedBookmarks = null; // invalidate cache
        listeners.forEach((l) => l());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addBookmark = useCallback((post: Omit<BookmarkedPost, "bookmarkedAt">) => {
    const current = getStored();
    if (current.some((b) => b.id === post.id)) return;
    setStored([{ ...post, bookmarkedAt: new Date().toISOString() }, ...current]);
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setStored(getStored().filter((b) => b.id !== id));
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.some((b) => b.id === id);
  }, [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
