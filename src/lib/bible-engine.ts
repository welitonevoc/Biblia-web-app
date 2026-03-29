/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { Book, Verse, SearchResult } from '../domain/entities/Verse';

export interface BibleModuleConfig {
  id: string;
  booksTable?: string;
  versesTable: string;
  detailsTable?: string;
  columns: {
    bookId: string;
    bookName?: string;
    verseBook: string;
    verseChapter: string;
    verseNumber: string;
    verseText: string;
  };
  normalizeBookIds?: boolean;
  hasRichText?: boolean;
  sequentialBookIds?: boolean;
}

export class BibleEngine {
  private db: Database | null = null;
  private sqlJs: SqlJsStatic | null = null;
  private moduleConfig: BibleModuleConfig | null = null;
  private initialized: boolean = false;

  async init(arrayBuffer: ArrayBuffer): Promise<void> {
    if (!this.sqlJs) {
      this.sqlJs = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      });
    }
    this.db = new this.sqlJs.Database(new Uint8Array(arrayBuffer));
    this.detectModuleConfig();
    this.initialized = true;
  }

  private detectModuleConfig() {
    if (!this.db) return;
    // Simple detection logic for common formats
    const tables = this.db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0]?.values.flat() as string[];
    
    if (tables.includes('verses')) {
      this.moduleConfig = {
        id: 'standard',
        versesTable: 'verses',
        columns: {
          bookId: 'book_number',
          verseBook: 'book_number',
          verseChapter: 'chapter',
          verseNumber: 'verse',
          verseText: 'text'
        }
      };
    } else if (tables.includes('bible')) {
      this.moduleConfig = {
        id: 'mysword',
        versesTable: 'bible',
        columns: {
          bookId: 'book',
          verseBook: 'book',
          verseChapter: 'chapter',
          verseNumber: 'verse',
          verseText: 'text'
        }
      };
    }
  }

  async getBooks(): Promise<Book[]> {
    if (!this.db || !this.moduleConfig) return [];
    // Mocking books for now if booksTable is missing
    const books: Book[] = [
      { id: '1', name: 'Gênesis', shortName: 'Gn', chapters: 50, testament: 'OT', numericId: 1 },
      { id: '2', name: 'Êxodo', shortName: 'Êx', chapters: 40, testament: 'OT', numericId: 2 },
      // ... add more or fetch from DB if available
    ];
    return books;
  }

  async getChapter(bookId: string, chapter: number): Promise<Verse[]> {
    if (!this.db || !this.moduleConfig) return [];
    const { versesTable, columns } = this.moduleConfig;
    const query = `SELECT ${columns.verseBook}, ${columns.verseChapter}, ${columns.verseNumber}, ${columns.verseText} 
                   FROM ${versesTable} 
                   WHERE ${columns.verseBook} = ? AND ${columns.verseChapter} = ?`;
    const results = this.db.exec(query, [bookId, chapter]);
    
    if (results.length === 0) return [];
    
    return results[0].values.map((row: any) => ({
      bookId: row[0].toString(),
      chapter: row[1],
      verse: row[2],
      text: row[3]
    }));
  }

  async search(query: string, limit: number = 50, offset: number = 0): Promise<SearchResult[]> {
    if (!this.db || !this.moduleConfig) return [];
    const { versesTable, columns } = this.moduleConfig;
    const sql = `SELECT ${columns.verseBook}, ${columns.verseChapter}, ${columns.verseNumber}, ${columns.verseText} 
                 FROM ${versesTable} 
                 WHERE ${columns.verseText} LIKE ? 
                 LIMIT ? OFFSET ?`;
    const results = this.db.exec(sql, [`%${query}%`, limit, offset]);
    
    if (results.length === 0) return [];
    
    return results[0].values.map((row: any) => ({
      bookId: row[0].toString(),
      chapter: row[1],
      verse: row[2],
      text: row[3]
    }));
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
