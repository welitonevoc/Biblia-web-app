/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bookmark } from '../domain/entities/UserData';

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, updatedFields: Partial<Omit<Bookmark, 'id' | 'createdAt'>>) => void;
  importBookmarks: (bookmarks: Bookmark[]) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarks: [],
      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [
          {
            ...bookmark,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          },
          ...state.bookmarks,
        ]
      })),
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.id !== id)
      })),
      updateBookmark: (id, updatedFields) => set((state) => ({
        bookmarks: state.bookmarks.map(b => b.id === id ? { ...b, ...updatedFields } : b)
      })),
      importBookmarks: (newBookmarks) => set((state) => ({
        bookmarks: [...new Set([...state.bookmarks, ...newBookmarks])]
      })),
    }),
    {
      name: 'verbum-bookmarks-storage',
    }
  )
);
