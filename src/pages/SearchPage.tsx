/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, History, Sparkles, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_RESULTS = [
  { book: 'Gênesis', chapter: 1, verse: 1, text: 'No princípio criou Deus o céu e a terra.' },
  { book: 'João', chapter: 1, verse: 1, text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.' },
  { book: 'Salmos', chapter: 1, verse: 1, text: 'Bem-aventurado o homem que não anda segundo o conselho dos ímpios.' },
  { book: 'Mateus', chapter: 5, verse: 3, text: 'Bem-aventurados os pobres de espírito, porque deles é o reino dos céus.' },
  { book: 'Romanos', chapter: 8, verse: 28, text: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_RESULTS>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(['amor', 'fé', 'salvação', 'princípio']);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      const timer = setTimeout(() => {
        setResults(MOCK_RESULTS.filter(r => 
          r.text.toLowerCase().includes(query.toLowerCase()) || 
          r.book.toLowerCase().includes(query.toLowerCase())
        ));
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const highlightMatch = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === term.toLowerCase() 
        ? <mark key={i} className="bg-[var(--accent)]/30 text-[var(--accent)] font-bold rounded-sm px-0.5">{part}</mark> 
        : part
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 pb-32 h-full flex flex-col">
      <div className="mb-12">
        <span className="text-xs font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3 block">Exploração Bíblica</span>
        <h1 className="text-6xl font-black tracking-tighter text-white mb-2">Busca Inteligente</h1>
        <p className="text-sm text-white/40 uppercase tracking-widest font-bold">Encontre sabedoria em milissegundos</p>
      </div>

      <div className="relative mb-12 group">
        <div className="absolute inset-0 bg-[#D4AF37] blur-[60px] opacity-0 group-focus-within:opacity-10 transition-all duration-700" />
        <div className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-[32px] p-2 shadow-2xl group-focus-within:border-[#D4AF37]/30 backdrop-blur-xl transition-all duration-500">
          <div className="w-14 h-14 flex items-center justify-center text-white/20 group-focus-within:text-[#D4AF37] transition-colors">
            <Search size={24} className="stroke-[2.5px]" />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que você procura hoje?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-bold text-white placeholder:text-white/10 outline-none px-2"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="w-12 h-12 flex items-center justify-center text-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
          <button className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#D4AF37] to-[#8B732A] text-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
            <Filter size={20} className="stroke-[2.5px]" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-2 border-[#D4AF37]/10 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-t-2 border-[#D4AF37] rounded-full animate-spin" />
              </div>
            <p className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.3em] animate-pulse">Sondando as Escrituras...</p>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between px-4 mb-6">
                <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">{results.length} Versículos Encontrados</p>
                <div className="flex items-center gap-2 text-xs font-black text-[#D4AF37] uppercase tracking-[0.2em] cursor-pointer hover:opacity-70 transition-opacity">
                  <Sparkles size={16} className="stroke-[2.5px]" />
                  Insights da IA
                </div>
              </div>
              {results.map((result, i) => (
                <motion.div
                  key={`${result.book}-${result.chapter}-${result.verse}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', damping: 20 }}
                  className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 hover:border-[#D4AF37]/20 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-sm font-black border border-[#D4AF37]/20">
                        {result.book[0]}
                      </div>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">{result.book} {result.chapter}:{result.verse}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all">
                      <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <p className="text-lg text-white/60 leading-relaxed group-hover:text-white transition-colors relative z-10 font-medium">
                    {highlightMatch(result.text, query)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : query.length > 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-24 h-24 bg-white/[0.03] border border-white/5 rounded-[40px] flex items-center justify-center text-white/10 mb-8">
                <Search size={40} className="stroke-[1.5px]" />
              </div>
              <p className="text-2xl font-black text-white tracking-tighter mb-2">Nenhum Versículo</p>
              <p className="text-sm text-white/30 font-medium">Tente palavras mais abrangentes ou referências diretas</p>
            </motion.div>
          ) : (
            <motion.div 
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div>
                <div className="flex items-center gap-3 mb-6 px-4">
                  <History size={16} className="text-[#D4AF37]" />
                  <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">Buscas Recentes</h2>
                </div>
                <div className="flex flex-wrap gap-3 px-2">
                  {history.map((h, i) => (
                    <button 
                      key={`${h}-${i}`}
                      onClick={() => setQuery(h)}
                      className="px-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-[40px] p-10 border border-[#D4AF37]/20 relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#D4AF37]/10 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-5 mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-[20px] bg-[#D4AF37] flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    <Sparkles size={24} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Busca Semântica</h3>
                    <p className="text-xs text-[#D4AF37] font-black uppercase tracking-[0.2em]">Powered by Gemini 2.0</p>
                  </div>
                </div>
                <p className="text-base text-white/50 leading-relaxed mb-8 relative z-10 font-medium">
                  Busque por sentimentos ou conceitos teológicos. "Onde fala sobre esperança no sofrimento?" ou "Versículos para paz interior". Nossa IA entende o significado profundo por trás das suas palavras.
                </p>
                <button className="w-full py-6 bg-white text-black rounded-[24px] text-sm font-black uppercase tracking-widest shadow-2xl hover:bg-[#D4AF37] hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10">
                  Ativar Busca por Contexto
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
