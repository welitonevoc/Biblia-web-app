/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ReadingPlan, UserPlanProgress, PlanTask } from '../domain/entities/ReadingPlan';

interface PlanStore {
  availablePlans: ReadingPlan[];
  userProgress: Record<string, UserPlanProgress>; // planId -> progress
  activePlanId: string | null;
  
  // Actions
  startPlan: (planId: string) => void;
  toggleTaskCompletion: (planId: string, taskId: string) => void;
  calculateProgress: (planId: string) => number;
  setActivePlan: (planId: string | null) => void;
  resetPlan: (planId: string) => void;
  setCurrentDay: (planId: string, day: number) => void;
}

const MOCK_PLANS: ReadingPlan[] = [
  {
    id: 'bible-365',
    title: 'Bíblia em um Ano',
    description: 'A jornada completa através das Escrituras, do Gênesis ao Apocalipse.',
    durationDays: 365,
    category: 'Bíblia Toda',
    imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop',
    days: Array.from({ length: 365 }, (_, i) => ({
      day: i + 1,
      tasks: [
        { id: `b365-d${i+1}-t1`, reference: `Gênesis ${i + 1}`, bookId: '1', chapterStart: i + 1, chapterEnd: i + 1 }
      ]
    }))
  },
  {
    id: 'nt-90',
    title: 'Novo Testamento em 90 Dias',
    description: 'Mergulhe na vida de Cristo e no nascimento da igreja primitiva.',
    durationDays: 90,
    category: 'Novo Testamento',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&auto=format&fit=crop',
    days: Array.from({ length: 90 }, (_, i) => ({
      day: i + 1,
      tasks: [
        { id: `nt90-d${i+1}-t1`, reference: `Mateus ${i + 1}`, bookId: '40', chapterStart: i + 1, chapterEnd: i + 1 }
      ]
    }))
  },
  {
    id: 'wisdom-30',
    title: '30 Dias de Sabedoria',
    description: 'Uma seleção especial de Provérbios e Eclesiastes para o seu dia a dia.',
    durationDays: 30,
    category: 'Temático',
    imageUrl: 'https://images.unsplash.com/photo-1490730141103-6ac27d020028?q=80&w=800&auto=format&fit=crop',
    days: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      tasks: [
        { id: `w30-d${i+1}-t1`, reference: `Provérbios ${i + 1}`, bookId: '20', chapterStart: i + 1, chapterEnd: i + 1 }
      ]
    }))
  }
];

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      availablePlans: MOCK_PLANS,
      userProgress: {},
      activePlanId: null,

      startPlan: (planId) => {
        const existing = get().userProgress[planId];
        if (!existing) {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              [planId]: {
                planId,
                startDate: Date.now(),
                lastAccessed: Date.now(),
                completedTasks: [],
                currentDay: 1,
                isCompleted: false,
              }
            },
            activePlanId: planId
          }));
        } else {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              [planId]: {
                ...existing,
                lastAccessed: Date.now()
              }
            },
            activePlanId: planId
          }));
        }
      },

      toggleTaskCompletion: (planId, taskId) => {
        set((state) => {
          const progress = state.userProgress[planId];
          if (!progress) return state;

          const isCompleted = progress.completedTasks.includes(taskId);
          const newCompletedTasks = isCompleted
            ? progress.completedTasks.filter(id => id !== taskId)
            : [...progress.completedTasks, taskId];

          const plan = state.availablePlans.find(p => p.id === planId);
          const totalTasks = plan?.days.reduce((acc, day) => acc + day.tasks.length, 0) || 0;
          const isPlanFinished = newCompletedTasks.length === totalTasks;

          return {
            userProgress: {
              ...state.userProgress,
              [planId]: {
                ...progress,
                completedTasks: newCompletedTasks,
                isCompleted: isPlanFinished,
                lastAccessed: Date.now()
              }
            }
          };
        });
      },

      calculateProgress: (planId) => {
        const state = get();
        const plan = state.availablePlans.find(p => p.id === planId);
        const progress = state.userProgress[planId];
        
        if (!plan || !progress) return 0;
        
        const totalTasks = plan.days.reduce((acc, day) => acc + day.tasks.length, 0);
        if (totalTasks === 0) return 0;
        
        return Math.round((progress.completedTasks.length / totalTasks) * 100);
      },

      setActivePlan: (activePlanId) => {
        if (activePlanId) {
          set((state) => {
            const progress = state.userProgress[activePlanId];
            if (!progress) return { activePlanId };
            return {
              userProgress: {
                ...state.userProgress,
                [activePlanId]: {
                  ...progress,
                  lastAccessed: Date.now()
                }
              },
              activePlanId
            };
          });
        } else {
          set({ activePlanId: null });
        }
      },

      resetPlan: (planId) => {
        set((state) => {
          const { [planId]: _, ...rest } = state.userProgress;
          return { userProgress: rest };
        });
      },

      setCurrentDay: (planId, day) => {
        set((state) => {
          const progress = state.userProgress[planId];
          if (!progress) return state;

          return {
            userProgress: {
              ...state.userProgress,
              [planId]: {
                ...progress,
                currentDay: day
              }
            }
          };
        });
      }
    }),
    {
      name: 'verbum-plans-storage',
    }
  )
);
