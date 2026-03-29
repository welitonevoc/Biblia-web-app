/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Share2, 
  Copy, 
  Download, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface DailyVerse {
  text: string;
  reference: string;
  date: string;
}

export default function VotdPage() {
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Mock daily verse
    setVerse({
      text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
      reference: "João 3:16",
      date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    });
  }, []);

  if (!verse) return null;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-32">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-4 mb-6 px-6 py-3 bg-[var(--accent-bg)] rounded-full border border-[var(--accent)]/10 shadow-gold">
          <Sparkles size={18} className="text-[var(--accent)]" />
          <span className="text-[10px] uppercase font-black tracking-[0.5em] text-[var(--accent)]">Versículo do Dia</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-[var(--text)] italic mb-4">INSPIRAÇÃO DIÁRIA</h1>
        <p className="text-[var(--text-dim)] uppercase text-[11px] font-black tracking-[0.3em]">{verse.date}</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -inset-4 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-dim)]/10 rounded-[64px] blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-[48px] p-16 md:p-24 shadow-premium overflow-hidden">
          {/* Large Quote Mark */}
          <span className="absolute top-12 left-12 text-[200px] text-[var(--accent)] opacity-5 font-serif leading-none pointer-events-none">"</span>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <blockquote className="mb-12">
              <p className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.4] text-[var(--text)] italic tracking-tight">
                {verse.text}
              </p>
            </blockquote>
            
            <div className="flex items-center gap-6 mb-16">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--accent)]/30" />
              <h2 className="text-xl font-black text-[var(--accent)] uppercase tracking-[0.2em] drop-shadow-[0_0_10px_var(--accent-bg)]">
                {verse.reference}
              </h2>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--accent)]/30" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 border",
                  isLiked 
                    ? "bg-red-500 text-white border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" 
                    : "bg-[var(--bg-card)] text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--accent)]/30 hover:text-[var(--text)]"
                )}
              >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
                <span className="text-[10px] font-black uppercase tracking-widest">Favoritar</span>
              </button>
              
              <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--bg-card)] text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--accent)]/30 hover:text-[var(--text)] transition-all duration-500">
                <Share2 size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Compartilhar</span>
              </button>
              
              <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--bg-card)] text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--accent)]/30 hover:text-[var(--text)] transition-all duration-500">
                <Download size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Baixar Imagem</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <button className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:text-[var(--text)] transition-all shadow-premium">
            <ChevronLeft size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Anterior</span>
          </button>
          
          <button className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:text-[var(--text)] transition-all shadow-premium">
            <span className="text-[10px] font-black uppercase tracking-widest">Próximo</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>

      {/* Archive Section */}
      <section className="mt-32">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Calendar size={18} />
            </div>
            <h2 className="text-2xl font-black text-[var(--text)] uppercase tracking-tighter italic">Arquivo da Semana</h2>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] hover:underline">Ver Todos</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[32px] p-8 hover:bg-[var(--bg-hover)] transition-all duration-500 shadow-premium group">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-4">2{i} de Março</p>
              <p className="text-sm font-medium text-[var(--text)] italic mb-6 line-clamp-3">
                "O Senhor é o meu pastor, nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas."
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">Salmos 23:1-2</span>
                <Share2 size={14} className="text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
