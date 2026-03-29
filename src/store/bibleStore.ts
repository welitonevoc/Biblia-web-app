/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BibleNavState {
  bookId: string;
  chapter: number;
  verse: number;
  currentModuleId: string;
  downloadedModuleIds: string[];
  hasModule: boolean;
  onboardingDone: boolean;
  navigate: (bookId: string, chapter: number, verse?: number) => void;
  setModule: (moduleId: string) => void;
  addDownloadedModule: (moduleId: string) => void;
  removeDownloadedModule: (moduleId: string) => void;
  setHasModule: (v: boolean) => void;
  setOnboardingDone: (v: boolean) => void;
}

export const useBibleStore = create<BibleNavState>()(
  persist(
    (set) => ({
      bookId: '1',
      chapter: 1,
      verse: 1,
      currentModuleId: 'nvi-pt',
      downloadedModuleIds: ['nvi-pt', 'acf-pt'],
      hasModule: false,
      onboardingDone: false,
      navigate: (bookId, chapter, verse = 1) => set({ bookId, chapter, verse }),
      setModule: (currentModuleId) => set({ currentModuleId }),
      addDownloadedModule: (moduleId) => set((state) => ({ 
        downloadedModuleIds: [...new Set([...state.downloadedModuleIds, moduleId])] 
      })),
      removeDownloadedModule: (moduleId) => set((state) => ({ 
        downloadedModuleIds: state.downloadedModuleIds.filter(id => id !== moduleId) 
      })),
      setHasModule: (hasModule) => set({ hasModule }),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
    }),
    {
      name: 'yv-nav',
    }
  )
);
