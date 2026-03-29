/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  List, 
  Settings as SettingsIcon, 
  Share2, 
  Copy, 
  Bookmark, 
  Highlighter, 
  Tag, 
  FileText,
  ChevronDown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBibleStore } from '../../store/bibleStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { cn } from '../../lib/utils';
import { moduleRepository, RemoteModule } from '../../services/moduleRepository';

const MOCK_VERSES = [
  { verse: 1, text: "No princípio criou Deus o céu e a terra." },
  { verse: 2, text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas." },
  { verse: 3, text: "E disse Deus: Haja luz; e houve luz." },
  { verse: 4, text: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas." },
  { verse: 5, text: "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro." },
  { verse: 6, text: "E disse Deus: Haja uma expansão no meio das águas, e haja separação entre águas e águas." },
  { verse: 7, text: "E fez Deus a expansão, e fez separação entre as águas que estavam debaixo da expansão e as águas que estavam sobre a expansão; e assim foi." },
  { verse: 8, text: "E chamou Deus à expansão Céu, e foi a tarde e a manhã, o dia segundo." },
  { verse: 9, text: "E disse Deus: Ajuntem-se as águas debaixo dos céus num lugar; e apareça a porção seca; e assim foi." },
  { verse: 10, text: "E chamou Deus à porção seca Terra; e ao ajuntamento das águas chamou Mares; e viu Deus que era bom." },
];

export default function BibleReader() {
  const { bookId, chapter, verse, currentModuleId, downloadedModuleIds, setModule, navigate } = useBibleStore();
  const { theme, settings } = useSettingsStore();
  const { addBookmark } = useBookmarkStore();
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isModuleSelectorOpen, setIsModuleSelectorOpen] = useState(false);
  const [downloadedModules, setDownloadedModules] = useState<RemoteModule[]>([]);

  const handleAddBookmark = () => {
    selectedVerses.forEach(vNum => {
      const vData = MOCK_VERSES.find(mv => mv.verse === vNum);
      if (vData) {
        addBookmark({
          bookId,
          chapter,
          verse: vNum,
          text: vData.text,
          tags: [],
          label: `Gênesis ${chapter}:${vNum}`
        });
      }
    });
    clearSelection();
  };

  useEffect(() => {
    const fetchDownloadedModules = async () => {
      // In a real app, we'd have a local database. 
      // Here we fetch all and filter by downloaded IDs.
      const allModules = await moduleRepository.fetchModules('verbum-official');
      const filtered = allModules.filter(m => downloadedModuleIds.includes(m.id));
      setDownloadedModules(filtered);
    };
    fetchDownloadedModules();
  }, [downloadedModuleIds]);

  const currentModule = useMemo(() => {
    const found = downloadedModules.find(m => m.id === currentModuleId);
    return found || { abbreviation: currentModuleId.toUpperCase(), name: 'Módulo' };
  }, [downloadedModules, currentModuleId]);

  const toggleVerseSelection = (v: number) => {
    setSelectedVerses(prev => 
      prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v]
    );
  };

  const clearSelection = () => setSelectedVerses([]);

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Reader Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2.5 hover:bg-white/5 rounded-2xl text-white/60 hover:text-white transition-all">
            <List size={20} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsModuleSelectorOpen(!isModuleSelectorOpen)}
              className="flex items-center gap-3 bg-white/[0.03] rounded-2xl px-5 py-2 border border-white/5 hover:border-[#D4AF37]/40 transition-all group"
            >
              <span className="text-sm font-black text-white uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">
                Gênesis 1 • {currentModule.abbreviation}
              </span>
              <ChevronDown size={14} className={cn("text-white/20 transition-transform", isModuleSelectorOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isModuleSelectorOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsModuleSelectorOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-[#0F0F0F] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="px-4 py-2 mb-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-white/20">Minhas Versões</span>
                      </div>
                      {downloadedModules.length > 0 ? (
                        downloadedModules.map((module) => (
                          <button
                            key={module.id}
                            onClick={() => {
                              setModule(module.id);
                              setIsModuleSelectorOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group",
                              currentModuleId === module.id ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "text-white/40 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-black uppercase tracking-tight">{module.abbreviation}</span>
                              <span className="text-xs font-medium opacity-40">{module.name}</span>
                            </div>
                            {currentModuleId === module.id && <Check size={14} />}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-[10px] text-white/20 italic">
                          Nenhum módulo baixado
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-2.5 hover:bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      {/* Reader Content */}
      <div 
        className="flex-1 overflow-y-auto scrollbar-hide py-16 px-8 md:px-16 lg:px-32 max-w-5xl mx-auto w-full"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
          fontFamily: theme.fontFamily
        }}
      >
        <div className="mb-20 text-center">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block">Livro de Gênesis</span>
          <h2 className="text-7xl font-black tracking-tighter text-white mb-6">Capítulo 1</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto opacity-40" />
        </div>

        <div className={cn(
          "space-y-10",
          settings.textDisplay.paragraphMode ? "text-justify" : ""
        )}>
          {MOCK_VERSES.map((v) => (
            <div 
              key={v.verse}
              onClick={() => toggleVerseSelection(v.verse)}
              className={cn(
                "verse-text group relative py-4 px-8 rounded-[32px] transition-all duration-500 cursor-pointer",
                selectedVerses.includes(v.verse) 
                  ? "bg-[#D4AF37]/10 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3)] shadow-gold" 
                  : "hover:bg-white/[0.03]"
              )}
            >
              <span className="verse-number absolute -left-4 top-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {v.verse}
              </span>
              <p className="text-[#E0E0E0] leading-[2] font-medium tracking-tight text-xl md:text-2xl">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-black text-[#D4AF37] mr-4 align-middle group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500">
                  {v.verse}
                </span>
                {v.text}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-24 flex items-center justify-between gap-6 pb-32">
          <button className="flex-1 flex flex-col items-start gap-1 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] text-white/40 hover:text-white hover:border-[#D4AF37]/30 transition-all group">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37]/60">Anterior</span>
            <div className="flex items-center gap-2">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-lg font-black uppercase tracking-tight">Apocalipse 22</span>
            </div>
          </button>
          <button className="flex-1 flex flex-col items-end gap-1 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] text-white/40 hover:text-white hover:border-[#D4AF37]/30 transition-all group">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37]/60">Próximo</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black uppercase tracking-tight">Gênesis 2</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Selection Toolbar */}
      <AnimatePresence>
        {selectedVerses.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-[#0F0F0F]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[28px] p-3 flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 px-3 border-r border-white/10 mr-1">
              <div className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/40 cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-yellow-400/5" />
              <div className="w-7 h-7 rounded-full bg-blue-400/20 border border-blue-400/40 cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-blue-400/5" />
              <div className="w-7 h-7 rounded-full bg-green-400/20 border border-green-400/40 cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-green-400/5" />
              <div className="w-7 h-7 rounded-full bg-red-400/20 border border-red-400/40 cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-red-400/5" />
            </div>
            
            <div className="flex items-center gap-1">
              <button className="p-3 hover:bg-white/5 rounded-2xl text-white/60 hover:text-white transition-all" title="Copiar">
                <Copy size={18} />
              </button>
              <button 
                onClick={handleAddBookmark}
                className="p-3 hover:bg-white/5 rounded-2xl text-white/60 hover:text-white transition-all" 
                title="Marcar"
              >
                <Bookmark size={18} />
              </button>
              <button className="p-3 hover:bg-white/5 rounded-2xl text-white/60 hover:text-white transition-all" title="Etiquetar">
                <Tag size={18} />
              </button>
              <button className="p-3 hover:bg-white/5 rounded-2xl text-white/60 hover:text-white transition-all" title="Nota">
                <FileText size={18} />
              </button>
            </div>
            
            <div className="w-px h-8 bg-white/10 mx-2" />
            
            <button 
              onClick={clearSelection}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-2xl transition-all"
            >
              Limpar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
