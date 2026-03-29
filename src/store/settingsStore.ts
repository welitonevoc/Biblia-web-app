/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode =
  | 'dark'
  | 'light'
  | 'amoled'
  | 'sepia'
  | 'minimalist'
  | 'velvet'
  | 'ocean'
  | 'forest'
  | 'royal'
  | 'midnight';

export interface ThemeConfig {
  mode: ThemeMode;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: string;
  horizontalMargin: number;
}

export interface AppSettings {
  textDisplay: {
    paragraphMode: boolean;
    verseNumbers: boolean;
    jesusWordsRed: boolean;
    chapterTitles: boolean;
    headlines: boolean;
    footnotes: boolean;
  };
  studyTools: {
    strongsTags: boolean;
    strongsLinks: boolean;
    morphTags: boolean;
    interlinearMode: boolean;
    originalLanguages: boolean;
    translatorNotes: boolean;
    transliteration: boolean;
  };
  visualResources: {
    highlights: boolean;
    bookmarks: boolean;
    crossRefs: boolean;
    mergeAdjacentRefs: boolean;
  };
  behavior: {
    animations: boolean;
    horizontalScroll: boolean;
  };
  navigation: {
    language: 'pt-BR' | 'en';
  };
  modules: {
    commentary: boolean;
    dictionary: boolean;
    xrefs: boolean;
  };
  ai: {
    autoSuggest: boolean;
    model: 'gemini-2.0-flash' | 'gemini-pro';
    language: 'pt-BR' | 'en' | 'es';
  };
}

interface SettingsStore {
  theme: ThemeConfig;
  settings: AppSettings;
  activeModuleId: string | null;
  setThemeMode: (mode: ThemeMode) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (lh: number) => void;
  setFontFamily: (f: string) => void;
  setHorizontalMargin: (m: number) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  setActiveModule: (id: string | null) => void;
}

const defaultTheme: ThemeConfig = {
  mode: 'dark',
  fontSize: 18,
  lineHeight: 1.9,
  letterSpacing: 0,
  fontFamily: 'Literata',
  horizontalMargin: 24,
};

const defaultSettings: AppSettings = {
  textDisplay: {
    paragraphMode: false,
    verseNumbers: true,
    jesusWordsRed: true,
    chapterTitles: true,
    headlines: true,
    footnotes: true,
  },
  studyTools: {
    strongsTags: false,
    strongsLinks: false,
    morphTags: false,
    interlinearMode: false,
    originalLanguages: false,
    translatorNotes: false,
    transliteration: false,
  },
  visualResources: {
    highlights: true,
    bookmarks: true,
    crossRefs: true,
    mergeAdjacentRefs: false,
  },
  behavior: {
    animations: true,
    horizontalScroll: false,
  },
  navigation: {
    language: 'pt-BR',
  },
  modules: {
    commentary: false,
    dictionary: false,
    xrefs: false,
  },
  ai: {
    autoSuggest: false,
    model: 'gemini-2.0-flash',
    language: 'pt-BR',
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      settings: defaultSettings,
      activeModuleId: 'acf-2007',
      setThemeMode: (mode) => set((state) => ({ theme: { ...state.theme, mode } })),
      setFontSize: (fontSize) => set((state) => ({ theme: { ...state.theme, fontSize } })),
      setLineHeight: (lineHeight) => set((state) => ({ theme: { ...state.theme, lineHeight } })),
      setFontFamily: (fontFamily) => set((state) => ({ theme: { ...state.theme, fontFamily } })),
      setHorizontalMargin: (horizontalMargin) => set((state) => ({ theme: { ...state.theme, horizontalMargin } })),
      updateSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),
      setActiveModule: (activeModuleId) => set({ activeModuleId }),
    }),
    {
      name: 'yv-settings',
    }
  )
);
