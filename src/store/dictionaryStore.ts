/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AiDictionaryEntry {
  id: string;
  word: string;
  originalForm: string;
  transliteration: string;
  baseTranslation: string;
  strongs: string;
  lxx?: string;
  morphologyCode?: string;
  sources: {
    dnt?: string;
    nidotte?: string;
    vine?: string;
  };
  morphology: {
    greek?: {
      tense?: string;
      voice?: string;
      mode?: string;
      personNumber?: string;
      case?: string;
    };
    hebrew?: {
      root?: string;
      binyan?: string;
      state?: string;
      genderNumber?: string;
    };
  };
  semantics: {
    disambiguation: string;
    senses: { sense: string; probability: number }[];
    polysemy: string;
  };
  frequency: {
    ot: number;
    nt: number;
    verses: string[];
    distribution: string;
  };
  semanticField: {
    relations: string[];
    classification: string[];
  };
  etymology: {
    hebrew?: string;
    greek?: string;
    evolution: string;
  };
  translations: {
    version: string;
    translation: string;
  }[];
  crossReferences: string[];
  semanticGraph: {
    nodes: string[];
    connections: { from: string; to: string; weight: number }[];
  };
  contextualAnalysis: {
    literary: string;
    historical: string;
    cultural: string;
    theological: string;
  };
  exegeticalAnalysis: {
    doctrines: string[];
    authorUsage: string;
    patristic?: string;
    reformedModern: string;
  };
  textualCriticism: {
    variants: string;
    differences: string;
  };
  timestamp: number;
}

export interface DictionaryModule {
  id: string;
  name: string;
  type: 'mysword' | 'mybible';
  description: string;
}

interface DictionaryState {
  // AI Dictionary Database
  aiEntries: AiDictionaryEntry[];
  addAiEntry: (entry: AiDictionaryEntry) => void;
  removeAiEntry: (id: string) => void;
  getAiEntry: (word: string) => AiDictionaryEntry | undefined;
  
  // Modules
  modules: DictionaryModule[];
  activeModuleId: string | null;
  setActiveModule: (id: string | null) => void;
  
  // Search History
  searchHistory: string[];
  addToHistory: (word: string) => void;
}

export const useDictionaryStore = create<DictionaryState>()(
  persist(
    (set, get) => ({
      aiEntries: [],
      addAiEntry: (entry) => {
        set((state) => {
          // Avoid duplicates
          const filtered = state.aiEntries.filter(e => e.word.toLowerCase() !== entry.word.toLowerCase());
          return { aiEntries: [entry, ...filtered] };
        });
      },
      removeAiEntry: (id) => {
        set((state) => ({
          aiEntries: state.aiEntries.filter(e => e.id !== id)
        }));
      },
      getAiEntry: (word) => {
        return get().aiEntries.find(e => e.word.toLowerCase() === word.toLowerCase());
      },
      
      modules: [
        { id: 'strong-pt', name: 'Strong Português', type: 'mysword', description: 'Léxico Hebraico e Grego de Strong' },
        { id: 'vines', name: 'Dicionário Vine', type: 'mybible', description: 'Dicionário Expositivo de Palavras do AT e NT' },
      ],
      activeModuleId: 'strong-pt',
      setActiveModule: (id) => set({ activeModuleId: id }),
      
      searchHistory: [],
      addToHistory: (word) => {
        set((state) => {
          const filtered = state.searchHistory.filter(w => w !== word);
          return { searchHistory: [word, ...filtered].slice(0, 20) };
        });
      },
    }),
    {
      name: 'yv-dictionary',
    }
  )
);
