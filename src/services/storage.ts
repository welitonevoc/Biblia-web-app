/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { openDB, IDBPDatabase } from 'idb';
import { Bookmark, Highlight, Note, Tag, ReadingProgress } from '../domain/entities/UserData';

export class StorageService {
  private db: Promise<IDBPDatabase>;

  constructor() {
    this.db = openDB('you-bible-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('bookmarks')) {
          db.createObjectStore('bookmarks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('highlights')) {
          db.createObjectStore('highlights', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('tags')) {
          db.createObjectStore('tags', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('reading_progress')) {
          db.createObjectStore('reading_progress', { keyPath: ['planId', 'day'] });
        }
      },
    });
  }

  async saveBookmark(bookmark: Bookmark): Promise<void> {
    const db = await this.db;
    await db.put('bookmarks', bookmark);
  }

  async getBookmarks(): Promise<Bookmark[]> {
    const db = await this.db;
    return db.getAll('bookmarks');
  }

  async deleteBookmark(id: string): Promise<void> {
    const db = await this.db;
    await db.delete('bookmarks', id);
  }

  async saveHighlight(highlight: Highlight): Promise<void> {
    const db = await this.db;
    await db.put('highlights', highlight);
  }

  async getHighlights(): Promise<Highlight[]> {
    const db = await this.db;
    return db.getAll('highlights');
  }

  async deleteHighlight(id: string): Promise<void> {
    const db = await this.db;
    await db.delete('highlights', id);
  }

  async saveNote(note: Note): Promise<void> {
    const db = await this.db;
    await db.put('notes', note);
  }

  async getNotes(): Promise<Note[]> {
    const db = await this.db;
    return db.getAll('notes');
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.db;
    await db.delete('notes', id);
  }

  async saveTag(tag: Tag): Promise<void> {
    const db = await this.db;
    await db.put('tags', tag);
  }

  async getTags(): Promise<Tag[]> {
    const db = await this.db;
    return db.getAll('tags');
  }

  async deleteTag(id: string): Promise<void> {
    const db = await this.db;
    await db.delete('tags', id);
  }

  async saveProgress(progress: ReadingProgress): Promise<void> {
    const db = await this.db;
    await db.put('reading_progress', progress);
  }

  async getProgress(planId: string): Promise<ReadingProgress[]> {
    const db = await this.db;
    const tx = db.transaction('reading_progress', 'readonly');
    const store = tx.objectStore('reading_progress');
    const all = await store.getAll();
    return all.filter(p => p.planId === planId);
  }
}
