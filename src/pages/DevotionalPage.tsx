/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Search, BookOpen, Filter, ChevronRight, Heart, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function DevotionalPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 pb-32">
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-[var(--text)] italic">DEVOCIONAL</h1>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--accent)]">Pão Diário</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar devocionais, temas ou datas..." 
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all outline-none shadow-premium"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Devotional */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 group bg-[var(--bg-surface)] border border-[var(--border)] rounded-[48px] p-12 hover:bg-[var(--bg-hover)] transition-all duration-500 shadow-premium relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold">
              <Calendar size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">Hoje, 29 de Março</span>
          </div>
          <h2 className="text-4xl font-black text-[var(--text)] uppercase tracking-tighter italic mb-6 leading-none">A Quietude da Alma</h2>
          <p className="text-lg text-[var(--text-dim)] italic leading-relaxed mb-10">
            "Aquietai-vos e sabei que eu sou Deus. Em meio ao caos deste mundo, a voz do Pai nos chama para o descanso em Sua presença..."
          </p>
          <div className="flex items-center gap-6">
            <button className="px-8 py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-black uppercase tracking-widest shadow-gold hover:scale-105 transition-all">
              Ler Devocional
            </button>
            <button className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-dim)] hover:text-red-500 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </motion.div>

        {/* Recent Devotionals */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[var(--bg-surface)] border border-[var(--border)] rounded-[32px] p-8 hover:bg-[var(--bg-hover)] transition-all duration-500 shadow-premium relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-dim)]">28 de Março</span>
              </div>
              <h3 className="text-xl font-black text-[var(--text)] uppercase tracking-tighter italic mb-4">Título Exemplo {i}</h3>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] group-hover:gap-4 transition-all">
                <span>Ler Mais</span>
                <ChevronRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
