/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Highlighter, 
  Trash2, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar, 
  BookOpen,
  Share2,
  MoreVertical,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHighlightStore, Highlight } from '../store/highlightStore';
import { cn } from '../lib/utils';

export default function HighlightsPage() {
  const { highlights, removeHighlight } = useHighlightStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const filteredHighlights = highlights.filter(h => {
    const matchesSearch = h.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = !activeColor || h.color === activeColor;
    return matchesSearch && matchesColor;
  });

  const colors = [
    { id: 'yellow', value: 'var(--hl-yellow)', label: 'Amarelo' },
    { id: 'blue', value: 'var(--hl-blue)', label: 'Azul' },
    { id: 'green', value: 'var(--hl-green)', label: 'Verde' },
    { id: 'red', value: 'var(--hl-red)', label: 'Vermelho' },
    { id: 'orange', value: 'var(--hl-orange)', label: 'Laranja' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold">
            <Highlighter size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-[var(--text)] italic">DESTAQUES</h1>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--accent)]">Sua Curadoria Teológica</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar nos seus destaques..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all outline-none shadow-premium"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setActiveColor(null)}
              className={cn(
                "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                !activeColor 
                  ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] shadow-gold" 
                  : "bg-[var(--bg-surface)] text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--accent)]/30"
              )}
            >
              Todos
            </button>
            {colors.map(color => (
              <button 
                key={color.id}
                onClick={() => setActiveColor(color.value)}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-premium",
                  activeColor === color.value 
                    ? "ring-2 ring-[var(--accent)] ring-offset-4 ring-offset-[var(--bg)]" 
                    : "hover:scale-110"
                )}
                style={{ backgroundColor: color.value, borderColor: 'rgba(255,255,255,0.1)' }}
                title={color.label}
              >
                <Palette size={16} className="text-white/50" />
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredHighlights.length > 0 ? (
            filteredHighlights.map((highlight) => (
              <motion.div
                key={highlight.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-[32px] p-8 hover:bg-[var(--bg-hover)] transition-all duration-500 shadow-premium overflow-hidden"
              >
                {/* Color Strip */}
                <div 
                  className="absolute top-0 left-0 w-2 h-full opacity-50"
                  style={{ backgroundColor: highlight.color }}
                />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[var(--text)] uppercase tracking-tight">
                        Livro {highlight.bookId}
                      </h3>
                      <p className="text-[10px] text-[var(--text-dim)] font-black uppercase tracking-widest">
                        Capítulo {highlight.chapter}:{highlight.verse}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeHighlight(highlight.id)}
                    className="p-2 text-[var(--text-dim)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <blockquote className="relative mb-8">
                  <span className="absolute -top-4 -left-2 text-6xl text-[var(--accent)] opacity-10 font-serif">"</span>
                  <p className="text-lg font-medium leading-relaxed text-[var(--text)] italic relative z-10">
                    {highlight.text}
                  </p>
                </blockquote>

                <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
                    <Calendar size={12} />
                    <span>{new Date(highlight.timestamp).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                      <Share2 size={14} />
                    </button>
                    <button className="p-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] mb-8 shadow-premium">
                <Highlighter size={40} className="opacity-20" />
              </div>
              <h2 className="text-2xl font-black text-[var(--text)] uppercase tracking-tighter italic mb-4">Nenhum destaque encontrado</h2>
              <p className="text-[var(--text-dim)] max-w-md uppercase text-[10px] font-black tracking-[0.2em] leading-relaxed">
                Comece a destacar seus versículos favoritos no leitor para vê-los aqui.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
