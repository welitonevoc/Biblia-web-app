/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  BookOpen, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  History as HistoryIcon, 
  Languages, 
  BookMarked, 
  Download, 
  Trash2,
  Zap,
  Bot,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDictionaryStore, AiDictionaryEntry } from '../store/dictionaryStore';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

export default function DictionaryPage() {
  const { 
    aiEntries, 
    addAiEntry, 
    removeAiEntry,
    getAiEntry, 
    modules, 
    activeModuleId, 
    setActiveModule,
    searchHistory,
    addToHistory
  } = useDictionaryStore();

  const [activeTab, setActiveTab] = useState<'modules' | 'ai'>('ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AiDictionaryEntry | null>(null);

  const handleAiSearch = async (word: string) => {
    if (!word.trim() || isSearchingAi) return;
    
    setIsSearchingAi(true);
    addToHistory(word);

    // Check local database first
    const localEntry = getAiEntry(word);
    if (localEntry) {
      setSelectedEntry(localEntry);
      setIsSearchingAi(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Forneça uma definição teológica ROBUSTA e ACADÊMICA para a palavra ou conceito: "${word}". 
        Retorne RIGOROSAMENTE um JSON seguindo esta estrutura exata:
        {
          "word": "${word}",
          "originalForm": "Forma original (hebraico/aramaico/grego)",
          "transliteration": "Transliteração",
          "baseTranslation": "Tradução base",
          "strongs": "Código Strong (ex: G26)",
          "lxx": "Referência LXX (se aplicável)",
          "morphologyCode": "Código morfológico",
          "sources": {
            "dnt": "Resumo do DNT",
            "nidotte": "Resumo do NIDOTTE",
            "vine": "Resumo do Vine"
          },
          "morphology": {
            "greek": { "tense": "", "voice": "", "mode": "", "personNumber": "", "case": "" },
            "hebrew": { "root": "", "binyan": "", "state": "", "genderNumber": "" }
          },
          "semantics": {
            "disambiguation": "Explicação da desambiguação",
            "senses": [{ "sense": "Sentido 1", "probability": 0.8 }],
            "polysemy": "Análise de polissemia"
          },
          "frequency": {
            "ot": 0,
            "nt": 0,
            "verses": ["Ref 1", "Ref 2"],
            "distribution": "Descrição da distribuição"
          },
          "semanticField": {
            "relations": ["Rel 1", "Rel 2"],
            "classification": ["Teológico", "Moral"]
          },
          "etymology": {
            "hebrew": "Raiz hebraica",
            "greek": "Raiz grega",
            "evolution": "Evolução histórica"
          },
          "translations": [
            { "version": "Almeida", "translation": "amor" },
            { "version": "NVI", "translation": "amor" }
          ],
          "crossReferences": ["Ref 1", "Ref 2"],
          "semanticGraph": {
            "nodes": ["Nó 1", "Nó 2"],
            "connections": [{ "from": "Nó 1", "to": "Nó 2", "weight": 0.9 }]
          },
          "contextualAnalysis": {
            "literary": "Análise literária",
            "historical": "Análise histórica",
            "cultural": "Análise cultural",
            "theological": "Análise teológica"
          },
          "exegeticalAnalysis": {
            "doctrines": ["Doutrina 1"],
            "authorUsage": "Uso pelos autores",
            "patristic": "Interpretação patrística",
            "reformedModern": "Interpretação reformada/moderna"
          },
          "textualCriticism": {
            "variants": "Variantes manuscritas",
            "differences": "Diferenças TM/LXX/TR"
          }
        }`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "Você é um lexicógrafo teológico de elite, especialista em línguas bíblicas (Hebraico, Aramaico, Grego Koine) e crítica textual. Suas respostas devem ser profundas, acadêmicas e seguir os padrões de dicionários como DNT, NIDOTTE e Vine. Retorne APENAS o JSON.",
        },
      });

      const data = JSON.parse(response.text || '{}');
      const newEntry: AiDictionaryEntry = {
        ...data,
        id: Date.now().toString(),
        timestamp: Date.now()
      };

      addAiEntry(newEntry);
      setSelectedEntry(newEntry);
    } catch (error) {
      console.error('AI Dictionary Error:', error);
    } finally {
      setIsSearchingAi(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto py-8 sm:py-16 px-4 sm:px-8 pb-40">
      <header className="mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-10 mb-12 sm:mb-16">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold shrink-0">
              <Database size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-[var(--text)] italic">DICIONÁRIO</h1>
              <p className="text-[10px] sm:text-xs uppercase font-black tracking-[0.3em] sm:tracking-[0.4em] text-[var(--accent)]">Léxico e IA Teológica</p>
            </div>
          </div>

          <div className="flex bg-[var(--bg-surface)] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-[var(--border)] shadow-premium self-start md:self-auto">
            <button 
              onClick={() => setActiveTab('ai')}
              className={cn(
                "flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'ai' ? "bg-[var(--accent)] text-[var(--bg)] shadow-gold" : "text-[var(--text-dim)] hover:text-[var(--text)]"
              )}
            >
              <Sparkles size={14} className="sm:w-4 sm:h-4" />
              <span>IA</span>
            </button>
            <button 
              onClick={() => setActiveTab('modules')}
              className={cn(
                "flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'modules' ? "bg-[var(--accent)] text-[var(--bg)] shadow-gold" : "text-[var(--text-dim)] hover:text-[var(--text)]"
              )}
            >
              <Languages size={14} className="sm:w-4 sm:h-4" />
              <span>Módulos</span>
            </button>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors sm:w-6 sm:h-6" size={20} />
          <input 
            type="text" 
            placeholder={activeTab === 'ai' ? "Explorar conceito..." : "Buscar módulos..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiSearch(searchQuery)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl sm:rounded-[32px] py-5 sm:py-8 pl-12 sm:pl-16 pr-32 sm:pr-40 text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all outline-none shadow-premium text-lg sm:text-xl font-medium italic"
          />
          <button 
            onClick={() => handleAiSearch(searchQuery)}
            disabled={isSearchingAi || !searchQuery.trim()}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 px-4 sm:px-8 py-2.5 sm:py-4 bg-[var(--accent)] text-[var(--bg)] rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-gold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSearchingAi ? <Loader2 size={18} className="animate-spin" /> : 'Consultar'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar: History & Modules */}
        <div className={cn(
          "lg:col-span-1 space-y-8",
          selectedEntry ? "hidden lg:block" : "block"
        )}>
          {activeTab === 'ai' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">Consultas Locais</h3>
                <HistoryIcon size={16} className="text-[var(--text-dim)]" />
              </div>
              <div className="space-y-3">
                {aiEntries.length === 0 && (
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--text-dim)] text-center py-12 opacity-40">Nenhuma consulta offline</p>
                )}
                {aiEntries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-left group",
                      selectedEntry?.id === entry.id 
                        ? "bg-[var(--accent-bg)] border-[var(--accent)]/30 text-[var(--accent)] shadow-gold" 
                        : "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)]/20"
                    )}
                  >
                    <span className="text-sm font-black uppercase tracking-widest truncate">{entry.word}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--accent)]">Módulos Ativos</h3>
                <Download size={16} className="text-[var(--text-dim)]" />
              </div>
              <div className="space-y-4">
                {modules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModule(mod.id)}
                    className={cn(
                      "w-full p-6 rounded-2xl border transition-all text-left relative overflow-hidden group",
                      activeModuleId === mod.id 
                        ? "bg-[var(--accent-bg)] border-[var(--accent)]/30 text-[var(--accent)] shadow-gold" 
                        : "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)]/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{mod.type}</span>
                      {activeModuleId === mod.id && <Zap size={14} className="fill-current" />}
                    </div>
                    <h4 className="text-base font-black uppercase tracking-widest mb-2">{mod.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-tight">{mod.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content: Definition View */}
        <div className={cn(
          "lg:col-span-3",
          !selectedEntry ? "hidden lg:block" : "block"
        )}>
          <AnimatePresence mode="wait">
            {selectedEntry ? (
              <motion.div
                key={selectedEntry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 shadow-premium relative overflow-hidden space-y-12 sm:space-y-16"
              >
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="lg:hidden flex items-center gap-2 text-[var(--accent)] font-black uppercase tracking-widest text-[10px] mb-8"
                >
                  <ChevronLeft size={16} />
                  <span>Voltar para Histórico</span>
                </button>

                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />
                
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 sm:gap-12">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Bot size={20} className="text-[var(--accent)] sm:w-6 sm:h-6" />
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--accent)]">Identidade Lexical Completa</span>
                    </div>
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[var(--text)] uppercase tracking-tighter italic leading-none">{selectedEntry.word}</h2>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--text-dim)]">
                      <span className="text-[var(--accent)] text-base sm:text-lg">{selectedEntry.originalForm}</span>
                      <span className="opacity-40">/</span>
                      <span className="text-sm sm:text-base">{selectedEntry.transliteration}</span>
                      <span className="opacity-40">/</span>
                      <span className="text-[var(--text)] text-sm sm:text-base">{selectedEntry.baseTranslation}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-6">
                    <div className="flex-1 sm:flex-none px-4 sm:px-8 py-4 sm:py-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl sm:rounded-3xl text-center min-w-[100px] sm:min-w-[120px]">
                      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1 sm:mb-2">Strong</p>
                      <p className="text-xl sm:text-2xl font-black text-[var(--accent)]">{selectedEntry.strongs}</p>
                    </div>
                    {selectedEntry.lxx && (
                      <div className="flex-1 sm:flex-none px-4 sm:px-8 py-4 sm:py-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl sm:rounded-3xl text-center min-w-[100px] sm:min-w-[120px]">
                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1 sm:mb-2">LXX</p>
                        <p className="text-xl sm:text-2xl font-black text-[var(--accent)]">{selectedEntry.lxx}</p>
                      </div>
                    )}
                    {selectedEntry.morphologyCode && (
                      <div className="flex-1 sm:flex-none px-4 sm:px-8 py-4 sm:py-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl sm:rounded-3xl text-center min-w-[100px] sm:min-w-[120px]">
                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1 sm:mb-2">Morph</p>
                        <p className="text-xl sm:text-2xl font-black text-[var(--accent)]">{selectedEntry.morphologyCode}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sources & Morphology */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
                  <section className="space-y-6 sm:space-y-8">
                    <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--accent)] flex items-center gap-3 sm:gap-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Fontes Clássicas
                    </h4>
                    <div className="space-y-4 sm:space-y-6">
                      {Object.entries(selectedEntry.sources || {}).map(([key, value]) => value && (
                        <div key={key} className="p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl sm:rounded-[32px]">
                          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-2 sm:mb-3">{key.toUpperCase()}</p>
                          <p className="text-xs sm:text-sm text-[var(--text-dim)] italic leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-6 sm:space-y-8">
                    <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[var(--accent)] flex items-center gap-3 sm:gap-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Análise Morfológica
                    </h4>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                      {selectedEntry.morphology?.greek && Object.entries(selectedEntry.morphology.greek || {}).map(([key, value]) => value && (
                        <div key={key} className="p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl sm:rounded-2xl">
                          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1 sm:mb-2">{key}</p>
                          <p className="text-xs sm:text-sm font-black text-[var(--text)] uppercase">{value}</p>
                        </div>
                      ))}
                      {selectedEntry.morphology?.hebrew && Object.entries(selectedEntry.morphology.hebrew || {}).map(([key, value]) => value && (
                        <div key={key} className="p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl sm:rounded-2xl">
                          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1 sm:mb-2">{key}</p>
                          <p className="text-xs sm:text-sm font-black text-[var(--text)] uppercase">{value}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Semantics & Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  <section className="md:col-span-2 space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)] flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Desambiguação Semântica
                    </h4>
                    <div className="p-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-[40px] space-y-8">
                      <p className="text-base text-[var(--text)] italic leading-relaxed">{selectedEntry.semantics?.disambiguation}</p>
                      <div className="space-y-4">
                        {selectedEntry.semantics?.senses?.map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl">
                            <span className="text-sm font-medium italic">{s.sense}</span>
                            <span className="text-xs font-black text-[var(--accent)]">{(s.probability * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--text-dim)] italic border-t border-[var(--border)] pt-6">
                        <span className="font-black uppercase tracking-widest mr-3">Polissemia:</span>
                        {selectedEntry.semantics?.polysemy}
                      </p>
                    </div>
                  </section>

                  <section className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)] flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Distribuição
                    </h4>
                    <div className="p-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-[40px] space-y-10">
                      <div className="flex justify-around items-center relative">
                        <div className="text-center flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-2">AT</p>
                          <p className="text-4xl font-black text-[var(--accent)]">{selectedEntry.frequency?.ot}</p>
                        </div>
                        <div className="w-px h-12 bg-[var(--border)] opacity-30" />
                        <div className="text-center flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-2">NT</p>
                          <p className="text-4xl font-black text-[var(--accent)]">{selectedEntry.frequency?.nt}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <p className="text-xs font-black uppercase tracking-widest text-[var(--text-dim)]">Versículos Chave</p>
                        <div className="flex flex-wrap gap-3">
                          {selectedEntry.frequency?.verses?.map((v, i) => (
                            <span key={i} className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl text-[10px] font-black text-[var(--accent)]">{v}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Semantic Field & Graph */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <section className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)] flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Campo Semântico
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {selectedEntry.semanticField?.relations?.map((r, i) => (
                        <div key={i} className="px-8 py-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex items-center gap-4 group hover:border-[var(--accent)]/30 transition-all">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                          <span className="text-sm font-black uppercase tracking-widest text-[var(--text)]">{r}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {selectedEntry.semanticField?.classification?.map((c, i) => (
                        <span key={i} className="px-4 py-2 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-[10px] font-black uppercase tracking-widest border border-[var(--accent)]/10">
                          {c}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)] flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Rede Semântica
                    </h4>
                    <div className="p-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-[40px] h-64 flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--accent) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                      <div className="relative z-10 flex flex-wrap justify-center gap-6">
                        {selectedEntry.semanticGraph?.nodes?.map((n, i) => (
                          <div key={i} className="px-6 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text)] shadow-premium">
                            {n}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Contextual & Exegetical Analysis */}
                <div className="space-y-16">
                  <section className="space-y-10">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)] flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Análise Contextual Avançada
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {Object.entries(selectedEntry.contextualAnalysis || {}).map(([key, value]) => (
                        <div key={key} className="p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-4">{key}</p>
                          <p className="text-sm text-[var(--text-dim)] italic leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-10">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)] flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Análise Exegética Automatizada
                    </h4>
                    <div className="p-12 bg-[var(--bg-card)] border border-[var(--border)] rounded-[48px] space-y-10">
                      <div className="flex flex-wrap gap-4">
                        {selectedEntry.exegeticalAnalysis?.doctrines?.map((d, i) => (
                          <span key={i} className="px-6 py-3 bg-[var(--accent-bg)] text-[var(--accent)] text-[10px] font-black uppercase tracking-widest rounded-2xl border border-[var(--accent)]/10">
                            {d}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Uso Autoral</p>
                          <p className="text-base text-[var(--text-dim)] italic leading-relaxed">{selectedEntry.exegeticalAnalysis?.authorUsage}</p>
                        </div>
                        <div className="space-y-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Reformada / Moderna</p>
                          <p className="text-base text-[var(--text-dim)] italic leading-relaxed">{selectedEntry.exegeticalAnalysis?.reformedModern}</p>
                        </div>
                      </div>
                      {selectedEntry.exegeticalAnalysis?.patristic && (
                        <div className="pt-10 border-t border-[var(--border)]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-6">Interpretação Patrística</p>
                          <p className="text-base text-[var(--text-dim)] italic leading-relaxed">{selectedEntry.exegeticalAnalysis?.patristic}</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Textual Criticism & Translations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <section className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)] flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Crítica Textual
                    </h4>
                    <div className="p-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-[40px] space-y-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-3">Variantes</p>
                        <p className="text-sm text-[var(--text-dim)] italic leading-relaxed">{selectedEntry.textualCriticism?.variants}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-3">Diferenças TM/LXX/TR</p>
                        <p className="text-sm text-[var(--text-dim)] italic leading-relaxed">{selectedEntry.textualCriticism?.differences}</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)] flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-gold" />
                      Uso em Traduções
                    </h4>
                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[40px] overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[var(--bg-surface)] border-b border-[var(--border)]">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">Versão</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">Tradução</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {selectedEntry.translations?.map((t, i) => (
                            <tr key={i} className="hover:bg-[var(--bg-hover)] transition-colors">
                              <td className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--accent)]">{t.version}</td>
                              <td className="px-8 py-6 text-sm text-[var(--text)] italic">{t.translation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                {/* Footer Actions */}
                <div className="mt-32 pt-12 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-10">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] italic">
                      <Languages size={18} />
                      <span>Consultado em {new Date(selectedEntry.timestamp).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] italic">
                      <Zap size={18} />
                      <span>Processado por Verbum AI Elite</span>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <button className="flex items-center gap-4 px-10 py-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all shadow-premium">
                      <BookMarked size={20} />
                      <span>Salvar nos Favoritos</span>
                    </button>
                    <button 
                      onClick={() => {
                        removeAiEntry(selectedEntry.id);
                        setSelectedEntry(null);
                      }}
                      className="flex items-center gap-4 px-10 py-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-premium"
                    >
                      <Trash2 size={20} />
                      <span>Excluir Entrada</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-32 bg-[var(--bg-surface)]/30 border border-dashed border-[var(--border)] rounded-[48px]">
                <div className="w-24 h-24 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] mb-8 shadow-premium">
                  <Sparkles size={40} className="opacity-20" />
                </div>
                <h2 className="text-2xl font-black text-[var(--text)] uppercase tracking-tighter italic mb-4">Explore a Profundidade</h2>
                <p className="text-[var(--text-dim)] max-w-md uppercase text-[10px] font-black tracking-[0.2em] leading-relaxed">
                  Pesquise por termos teológicos para gerar definições robustas com IA que ficarão salvas para consulta offline.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
