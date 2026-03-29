/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Verse, SearchResult } from '../entities/Verse';

export interface IBibleRepository {
  loadModule(buffer: ArrayBuffer): Promise<void>;
  getBooks(): Promise<Book[]>;
  getChapter(bookId: string, chapter: number): Promise<Verse[]>;
  search(query: string, limit?: number, offset?: number): Promise<SearchResult[]>;
  isInitialized(): boolean;
}
