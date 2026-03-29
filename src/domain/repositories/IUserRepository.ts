/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bookmark, Highlight, Note, Tag, ReadingProgress } from '../entities/UserData';

export interface IUserRepository {
  // Bookmarks
  saveBookmark(bookmark: Bookmark): Promise<void>;
  getBookmarks(): Promise<Bookmark[]>;
  deleteBookmark(id: string): Promise<void>;

  // Highlights
  saveHighlight(highlight: Highlight): Promise<void>;
  getHighlights(): Promise<Highlight[]>;
  deleteHighlight(id: string): Promise<void>;

  // Notes
  saveNote(note: Note): Promise<void>;
  getNotes(): Promise<Note[]>;
  deleteNote(id: string): Promise<void>;

  // Tags
  saveTag(tag: Tag): Promise<void>;
  getTags(): Promise<Tag[]>;
  deleteTag(id: string): Promise<void>;

  // Reading Progress
  saveProgress(progress: ReadingProgress): Promise<void>;
  getProgress(planId: string): Promise<ReadingProgress[]>;
}
