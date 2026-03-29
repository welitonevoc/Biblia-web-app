/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PlanTask {
  id: string;
  reference: string; // e.g., "Gênesis 1-3"
  bookId: string;
  chapterStart: number;
  chapterEnd: number;
}

export interface PlanDay {
  day: number;
  tasks: PlanTask[];
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  category: 'Bíblia Toda' | 'Novo Testamento' | 'Antigo Testamento' | 'Temático' | 'Devocional';
  imageUrl: string;
  days: PlanDay[];
}

export interface UserPlanProgress {
  planId: string;
  startDate: number;
  lastAccessed: number;
  completedTasks: string[]; // IDs of PlanTask
  currentDay: number;
  isCompleted: boolean;
}
