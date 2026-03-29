/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bookmark as BookmarkIcon, 
  Search, 
  Trash2, 
  ExternalLink, 
  Filter, 
  X, 
  Plus, 
  Upload, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Tag as TagIcon,
  BookOpen,
  Calendar,
  Share2
} from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useBibleStore } from '../store/bibleStore';
import { moduleRepository } from '../services/moduleRepository';
import { cn } from '../lib/utils';
import { Bookmark } from '../domain/entities/UserData';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, importBookmarks } = useBookmarkStore();
  const { navigate } = useBibleStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ progress: number; status: string } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Extract all unique tags from bookmarks
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    bookmarks.forEach(b => b.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [bookmarks]);

  // Filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesSearch = b.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (b.label?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = !selectedTag || b.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [bookmarks, searchQuery, selectedTag]);

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);
    setImportStatus({ progress: 0, status: 'Lendo arquivo...' });

    try {
      setImportStatus({ progress: 20, status: 'Lendo arquivo...' });
      const imported = await moduleRepository.importBookmarks(file);
      
      setImportStatus({ progress: 80, status: 'Importando marcadores...' });
      importBookmarks(imported);
      
      setImportStatus({ progress: 100, status: 'Importação concluída!' });
      setTimeout(() => {
        setIsImporting(false);
        setImportStatus(null);
      }, 2000);

    } catch (err) {
      setImportError('Falha ao importar marcadores. Verifique o formato do arquivo.');
      setIsImporting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(timestamp);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <BookmarkIcon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Meu Estudo</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
              Marcadores<span className="text-blue-500">.</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer group">
              <input type="file" className="hidden" onChange={handleImportFile} accept=".json,.sqlite,.db,.csv" />
              <div className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all active:scale-95">
                <Upload size={18} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Importar</span>
              </div>
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Import Progress */}
        <AnimatePresence>
          {importStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 rounded-[32px] bg-blue-500/10 border border-blue-500/20 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                {importStatus.progress === 100 ? <CheckCircle2 size={24} /> : <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Upload size={24} /></motion.div>}
              </div>
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-blue-500">{importStatus.status}</span>
                  <span className="text-xs font-mono text-blue-400">{importStatus.progress}%</span>
                </div>
                <div className="h-1.5 bg-blue-500/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${importStatus.progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {importError && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500"
            >
              <AlertCircle size={24} />
              <span className="text-sm font-bold uppercase tracking-wider">{importError}</span>
              <button onClick={() => setImportError(null)} className="ml-auto p-2 hover:bg-red-500/10 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="PESQUISAR NOS MARCADORES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-[24px] bg-white/[0.03] border border-white/5 focus:border-blue-500/50 focus:bg-white/[0.06] outline-none transition-all text-sm font-medium tracking-wide uppercase"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button 
              onClick={() => setSelectedTag(null)}
              className={cn(
                "h-16 px-8 rounded-[24px] border text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                !selectedTag ? "bg-blue-500 border-blue-500 text-black" : "bg-white/[0.03] border-white/5 text-white/40 hover:border-white/20"
              )}
            >
              Todos
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "h-16 px-8 rounded-[24px] border text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  selectedTag === tag ? "bg-blue-500 border-blue-500 text-black" : "bg-white/[0.03] border-white/5 text-white/40 hover:border-white/20"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((bookmark) => (
                <motion.div
                  key={bookmark.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white/[0.02] border border-white/5 rounded-[32px] p-6 md:p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                          {bookmark.bookId}:{bookmark.chapter}:{bookmark.verse}
                        </div>
                        <div className="flex items-center gap-2 text-white/20">
                          <Calendar size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{formatDate(bookmark.createdAt)}</span>
                        </div>
                      </div>

                      {bookmark.label && (
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-blue-500 transition-colors">
                          {bookmark.label}
                        </h3>
                      )}

                      <p className="text-white/60 leading-relaxed italic font-serif mb-6">
                        "{bookmark.text}"
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {bookmark.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-white/40">
                            <TagIcon size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 justify-end">
                      <button 
                        onClick={() => navigate(bookmark.bookId, bookmark.chapter, bookmark.verse)}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:bg-blue-500 hover:border-blue-500 hover:text-black transition-all active:scale-95"
                        title="Ir para o versículo"
                      >
                        <BookOpen size={18} />
                      </button>
                      <button 
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                        title="Compartilhar"
                      >
                        <Share2 size={18} />
                      </button>
                      <button 
                        onClick={() => removeBookmark(bookmark.id)}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-500 transition-all active:scale-95"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10 mx-auto mb-6">
                  <BookmarkIcon size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white/40 mb-2">Nenhum marcador encontrado</h3>
                <p className="text-white/20 text-sm font-medium uppercase tracking-widest">
                  {searchQuery || selectedTag ? 'Tente ajustar seus filtros' : 'Comece a marcar seus versículos favoritos'}
                </p>
                {(searchQuery || selectedTag) && (
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                    className="mt-8 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Limpar Filtros
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
