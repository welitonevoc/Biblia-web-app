/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  History, 
  Trash2, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Calendar, 
  Filter, 
  Search,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface HistoryItem {
  id: string;
  bookId: string;
  chapter: number;
  timestamp: number;
  progress: number;
}

const MOCK_HISTORY: HistoryItem[] = [
  { id: '1', bookId: 'Gênesis', chapter: 1, timestamp: Date.now() - 1000 * 60 * 30, progress: 100 },
  { id: '2', bookId: 'João', chapter: 3, timestamp: Date.now() - 1000 * 60 * 60 * 2, progress: 45 },
  { id: '3', bookId: 'Salmos', chapter: 23, timestamp: Date.now() - 1000 * 60 * 60 * 24, progress: 100 },
  { id: '4', bookId: 'Mateus', chapter: 5, timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, progress: 20 },
  { id: '5', bookId: 'Romanos', chapter: 8, timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, progress: 80 },
];

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 pb-32">
      <header className="mb-16">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold">
              <History size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-[var(--text)] italic">HISTÓRICO</h1>
              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--accent)]">Sua Jornada na Palavra</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20">
            <Trash2 size={16} />
            <span>Limpar Tudo</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar no histórico..." 
              className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all outline-none shadow-premium"
            />
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)]/30 transition-all shadow-premium">
            <Filter size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Filtrar</span>
          </button>
        </div>
      </header>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--border)] to-transparent hidden md:block" />

        <div className="space-y-12">
          {MOCK_HISTORY.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-0 md:pl-24"
            >
              {/* Timeline Dot */}
              <div className="absolute left-7 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent)] shadow-gold hidden md:block z-10" />
              
              <div className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-[40px] p-8 hover:bg-[var(--bg-hover)] transition-all duration-500 shadow-premium flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                {/* Progress Background */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-[var(--accent)]/20 transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />

                <div className="w-20 h-20 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <BookOpen size={32} />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className="text-2xl font-black text-[var(--text)] uppercase tracking-tighter italic">{item.bookId}</h3>
                    <span className="text-2xl font-black text-[var(--accent)] italic">{item.chapter}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{new Date(item.timestamp).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4">
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1">Progresso</p>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border)]">
                        <div 
                          className="h-full bg-[var(--accent)]"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-[var(--text)]">{item.progress}%</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-3 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-black uppercase tracking-widest shadow-gold hover:scale-105 transition-all">
                    <span>Continuar</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <button className="absolute top-6 right-6 p-2 text-[var(--text-dim)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty State Mock */}
      {MOCK_HISTORY.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] mb-8 shadow-premium">
            <History size={40} className="opacity-20" />
          </div>
          <h2 className="text-2xl font-black text-[var(--text)] uppercase tracking-tighter italic mb-4">Histórico Vazio</h2>
          <p className="text-[var(--text-dim)] max-w-md uppercase text-[10px] font-black tracking-[0.2em] leading-relaxed">
            Sua jornada de leitura começará a aparecer aqui assim que você abrir a Palavra.
          </p>
        </div>
      )}
    </div>
  );
}
