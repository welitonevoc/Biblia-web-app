/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Book {
  id: string;
  name: string;
  shortName: string;
  chapters: number;
  testament: 'OT' | 'NT';
  numericId: number;
}

export interface Verse {
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  isChapterHeader?: boolean;
}

export interface SearchResult {
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  score?: number;
}
