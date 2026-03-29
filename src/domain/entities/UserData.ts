/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Tag {
  id: string;
  name: string;
  color: string;
  background: string;
  textColor: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  label?: string;
  color?: string;
  tags: string[];
  createdAt: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  color: 'yellow' | 'blue' | 'green' | 'red' | 'orange';
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  bookId?: string;
  chapter?: number;
  verse?: number;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  days: number;
  category: 'anual' | 'mensal' | 'semanal' | 'diario';
  duration: string;
  readings: PlanReading[];
}

export interface PlanReading {
  day: number;
  bookId: string;
  chapter: number;
  verses?: string; // e.g., "1-10"
}

export interface ReadingProgress {
  planId: string;
  day: number;
  completed: boolean;
  completedAt?: number;
}
