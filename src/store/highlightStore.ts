/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Highlight {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  color: string;
  timestamp: number;
}

interface HighlightState {
  highlights: Highlight[];
  addHighlight: (highlight: Omit<Highlight, 'id' | 'timestamp'>) => void;
  removeHighlight: (id: string) => void;
  getHighlightsByVerse: (bookId: string, chapter: number, verse: number) => Highlight[];
}

export const useHighlightStore = create<HighlightState>()(
  persist(
    (set, get) => ({
      highlights: [],
      addHighlight: (h) => {
        const id = `${h.bookId}-${h.chapter}-${h.verse}-${Date.now()}`;
        const newHighlight: Highlight = {
          ...h,
          id,
          timestamp: Date.now(),
        };
        set((state) => ({
          highlights: [newHighlight, ...state.highlights],
        }));
      },
      removeHighlight: (id) => {
        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== id),
        }));
      },
      getHighlightsByVerse: (bookId, chapter, verse) => {
        return get().highlights.filter(
          (h) => h.bookId === bookId && h.chapter === chapter && h.verse === verse
        );
      },
    }),
    {
      name: 'yv-highlights',
    }
  )
);
