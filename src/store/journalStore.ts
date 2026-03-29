/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  relatedVerses?: string[];
  createdAt: number;
  updatedAt: number;
}

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => JournalEntry | undefined;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },
      updateEntry: (id, updatedFields) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updatedFields, updatedAt: Date.now() }
              : entry
          ),
        }));
      },
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      getEntry: (id) => get().entries.find((entry) => entry.id === id),
    }),
    {
      name: 'verbum-journal-storage',
    }
  )
);
