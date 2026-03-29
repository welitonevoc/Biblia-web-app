/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  FileText, 
  Calendar, 
  Settings, 
  MoreHorizontal,
  Home,
  Tag,
  Highlighter,
  HelpCircle,
  History,
  Map as MapIcon,
  MessageSquare,
  Sparkles,
  Menu,
  ChevronLeft,
  Heart,
  PenTool,
  BookMarked,
  Database,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';

export type NavPage = 
  | 'reader' 
  | 'commentary'
  | 'dictionary'
  | 'devotional'
  | 'search' 
  | 'bookmarks' 
  | 'notes' 
  | 'plans' 
  | 'settings'
  | 'tags'
  | 'highlights'
  | 'votd'
  | 'quiz'
  | 'topics'
  | 'maps'
  | 'crossref'
  | 'history'
  | 'modules'
  | 'ai'
  | 'journal'
  | 'prayers'
  | 'gratitude'
  | 'modules';

interface AppShellProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: 'reader', icon: BookOpen, label: 'Bíblia' },
  { id: 'commentary', icon: MessageSquare, label: 'Comentário' },
  { id: 'dictionary', icon: Database, label: 'Dicionário' },
  { id: 'devotional', icon: Sparkles, label: 'Devocional' },
  { id: 'journal', icon: PenTool, label: 'Meu Diário' },
  { id: 'prayers', icon: Heart, label: 'Orações' },
  { id: 'gratitude', icon: Sparkles, label: 'Gratidão' },
  { id: 'search', icon: Search, label: 'Buscar' },
  { id: 'bookmarks', icon: Bookmark, label: 'Marcadores' },
  { id: 'notes', icon: FileText, label: 'Notas' },
  { id: 'plans', icon: Calendar, label: 'Planos' },
  { id: 'tags', icon: Tag, label: 'Etiquetas' },
  { id: 'highlights', icon: Highlighter, label: 'Destaques' },
  { id: 'votd', icon: BookMarked, label: 'VOTD' },
  { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
  { id: 'history', icon: History, label: 'Histórico' },
  { id: 'maps', icon: MapIcon, label: 'Mapas' },
  { id: 'modules', icon: Database, label: 'Módulos' },
  { id: 'ai', icon: MessageSquare, label: 'IA Chat' },
  { id: 'settings', icon: Settings, label: 'Configurações' },
] as const;

export default function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const handleNavigate = (page: NavPage) => {
    onNavigate(page);
    setIsSidebarOpen(false);
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)] relative overflow-hidden selection:bg-[var(--accent)] selection:text-[var(--bg)]">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      {/* Unified Sidebar (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-full sm:w-80 bg-[var(--bg-surface)] z-[110] flex flex-col border-r border-[var(--border)] shadow-2xl"
            >
              {/* Sidebar Header */}
              <div className="p-8 sm:p-10 flex flex-col items-center relative z-10 border-b border-[var(--border)]">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dim)] rounded-[24px] flex items-center justify-center text-[var(--bg)] font-black text-3xl shadow-gold mb-6"
                >
                  V
                </motion.div>
                <div className="text-center">
                  <h1 className="text-2xl font-black tracking-[-0.05em] text-[var(--text)] italic leading-none">VERBUM</h1>
                  <p className="text-[9px] uppercase font-black tracking-[0.4em] text-[var(--accent)] mt-3">Theology & Study</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-6 right-6 p-3 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors rounded-xl hover:bg-[var(--bg-hover)]"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-4 sm:px-6 space-y-1 overflow-y-auto scrollbar-hide py-8">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={`nav-${item.id}`}
                    onClick={() => handleNavigate(item.id as NavPage)}
                    className={cn(
                      "w-full flex items-center gap-5 px-6 py-4 rounded-[20px] transition-all duration-300 group relative overflow-hidden",
                      activePage === item.id 
                        ? "bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent)]/10 shadow-sm" 
                        : "text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--bg-hover)]/40"
                    )}
                  >
                    <item.icon size={20} className={cn(
                      "transition-transform duration-300",
                      activePage === item.id ? "scale-110 stroke-[2.5px] drop-shadow-[0_0_8px_var(--accent)]" : "group-hover:scale-110"
                    )} />
                    <span className="text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap">{item.label}</span>
                    
                    {activePage === item.id && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-6 bg-[var(--accent)] rounded-r-full shadow-[0_0_10px_var(--accent)]"
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* User Profile */}
              <div className="p-6 sm:p-8 border-t border-[var(--border)] bg-[var(--bg-surface)]">
                {user ? (
                  <div className="bg-[var(--bg-card)] p-4 rounded-2xl flex items-center gap-4 border border-[var(--border)] shadow-lg">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-10 h-10 rounded-xl object-cover border border-[var(--border)]" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-black text-xs">
                        {getInitials(user.displayName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-[var(--text)] uppercase truncate">{user.displayName || 'Usuário'}</p>
                      <p className="text-[8px] text-[var(--accent)] uppercase font-black tracking-widest mt-0.5">Membro</p>
                    </div>
                    <button onClick={() => logout()} className="p-2 text-[var(--text-dim)] hover:text-red-500 transition-colors">
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-[var(--accent)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <LogIn size={16} />
                    Entrar / Cadastrar
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Unified Top Header */}
        <header className="h-20 px-4 sm:px-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl z-40 shrink-0">
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] hover:scale-105 active:scale-95 transition-all shadow-premium group"
              aria-label="Abrir Menu"
            >
              <Menu size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-black tracking-tighter text-[var(--text)] italic leading-none">VERBUM</h1>
              <p className="text-[8px] uppercase font-black tracking-[0.3em] text-[var(--accent)] mt-1">
                {NAV_ITEMS.find(i => i.id === activePage)?.label || 'Bíblia'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
              <div className={cn("w-2 h-2 rounded-full", user ? "bg-green-500 animate-pulse" : "bg-yellow-500")} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
                {user ? 'Online' : 'Visitante'}
              </span>
            </div>
            {user ? (
              <div 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--accent)]/20 shadow-gold hover:scale-105 transition-transform cursor-pointer"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] text-xs font-black">
                    {getInitials(user.displayName)}
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] hover:scale-105 transition-transform cursor-pointer"
              >
                <UserIcon size={20} />
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 relative overflow-hidden bg-[var(--bg)]">
          {/* Background Decorative Blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[var(--accent)]/3 blur-[100px] rounded-full pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, scale: 0.99, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -5 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="h-full overflow-y-auto scrollbar-hide"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
