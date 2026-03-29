/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import AppShell, { NavPage } from './components/layout/AppShell';
import BibleReader from './components/reader/BibleReader';
import SearchPage from './pages/SearchPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import TagsPage from './pages/TagsPage';
import ModulesPage from './pages/ModulesPage';
import JournalPage from './pages/JournalPage';
import BookmarksPage from './pages/BookmarksPage';
import PlansPage from './pages/PlansPage';
import HighlightsPage from './pages/HighlightsPage';
import VotdPage from './pages/VotdPage';
import QuizPage from './pages/QuizPage';
import HistoryPage from './pages/HistoryPage';
import MapsPage from './pages/MapsPage';
import AiChatPage from './pages/AiChatPage';
import CommentaryPage from './pages/CommentaryPage';
import DictionaryPage from './pages/DictionaryPage';
import DevotionalPage from './pages/DevotionalPage';
import { useThemePersistence } from './hooks/useThemePersistence';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('reader');
  const [navParams, setNavParams] = useState<any>({});

  useThemePersistence();

  const navigateTo = useCallback((page: NavPage, params?: any) => {
    setActivePage(page);
    setNavParams(params || {});
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'reader':
        return <BibleReader />;
      case 'commentary':
        return <CommentaryPage />;
      case 'dictionary':
        return <DictionaryPage />;
      case 'devotional':
        return <DevotionalPage />;
      case 'search':
        return <SearchPage />;
      case 'notes':
        return <NotesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'tags':
        return <TagsPage />;
      case 'modules':
        return <ModulesPage />;
      case 'journal':
        return <JournalPage />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'plans':
        return <PlansPage onNavigateToReader={() => navigateTo('reader')} />;
      case 'highlights':
        return <HighlightsPage />;
      case 'votd':
        return <VotdPage />;
      case 'quiz':
        return <QuizPage />;
      case 'history':
        return <HistoryPage />;
      case 'maps':
        return <MapsPage />;
      case 'ai':
        return <AiChatPage />;
      case 'prayers':
      case 'gratitude':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <div className="w-20 h-20 bg-[var(--accent-bg)] rounded-3xl flex items-center justify-center text-[var(--accent)] mb-6">
              <span className="text-4xl font-bold">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">{activePage.toUpperCase()} - Em Breve</h2>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              Esta funcionalidade premium está sendo preparada com todo cuidado teológico para você.
            </p>
            <button 
              onClick={() => setActivePage('reader')}
              className="mt-8 px-8 py-3 bg-[var(--accent)] text-white rounded-2xl text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Voltar para a Bíblia
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell activePage={activePage} onNavigate={navigateTo}>
      {renderPage()}
    </AppShell>
  );
}
