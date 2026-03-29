/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageSquare, Search, BookOpen, Filter, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function CommentaryPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 pb-32">
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-[var(--text)] italic">COMENTÁRIO</h1>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--accent)]">Exegese e Reflexão</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar em comentários teológicos..." 
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all outline-none shadow-premium"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-[40px] p-10 hover:bg-[var(--bg-hover)] transition-all duration-500 shadow-premium relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]/20" />
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-[9px] font-black uppercase tracking-widest border border-[var(--accent)]/10">
                Matthew Henry
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-dim)]">Gênesis 1:1</span>
            </div>
            <h3 className="text-xl font-black text-[var(--text)] uppercase tracking-tighter italic mb-4">No Princípio Criou Deus</h3>
            <p className="text-sm text-[var(--text-dim)] italic leading-relaxed mb-8 line-clamp-3">
              "O primeiro livro da Bíblia é chamado Gênesis, que significa geração ou origem. Ele nos conta sobre a origem de todas as coisas..."
            </p>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] group-hover:gap-4 transition-all">
              <span>Ler Comentário Completo</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
