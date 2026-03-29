/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tag as TagIcon, Search, Plus, Sparkles, BookOpen, Layers, Database, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TagSystem from '../components/tags/TagSystem';
import { cn } from '../lib/utils';

export default function TagsPage() {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const stats = [
    { label: 'Versículos', value: '31.102', icon: BookOpen, color: 'blue' },
    { label: 'Etiquetas', value: '65+', icon: TagIcon, color: 'amber' },
    { label: 'Categorias', value: '10', icon: Layers, color: 'green' },
    { label: 'Referências', value: '344k', icon: Database, color: 'purple' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-8 pb-32 h-full flex flex-col">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3 block">Taxonomia Bíblica</span>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">Verbum Tags</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Sistema Teológico de Indexação</p>
        </div>
        <div className="w-16 h-16 bg-white/[0.03] text-[#D4AF37] rounded-[24px] shadow-2xl border border-white/5 flex items-center justify-center group">
          <Sparkles size={32} className="stroke-[2px] group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
            className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 shadow-xl hover:border-[#D4AF37]/20 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                s.color === 'blue' ? "bg-blue-500/10 text-blue-400" :
                s.color === 'amber' ? "bg-[#D4AF37]/10 text-[#D4AF37]" :
                s.color === 'green' ? "bg-emerald-500/10 text-emerald-400" :
                "bg-purple-500/10 text-purple-400"
              )}>
                <s.icon size={20} className="stroke-[2.5px]" />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">{s.label}</span>
            </div>
            <p className="text-3xl font-black text-white tracking-tighter group-hover:text-[#D4AF37] transition-colors relative z-10">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 h-full bg-white/[0.01] border border-white/5 rounded-[40px] p-8 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <TagSystem 
            selectedTagIds={selectedTagIds}
            onChange={setSelectedTagIds}
          />
        </div>

        <div className="space-y-8">
          <div className="bg-white/[0.02] rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-[#D4AF37]/5 blur-[60px] rounded-full pointer-events-none" />
            
            <h3 className="text-lg font-black text-white mb-8 flex items-center gap-3 relative z-10">
              <Layers size={20} className="text-[#D4AF37] stroke-[2.5px]" />
              Base Teológica
            </h3>
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-[10px] font-black shrink-0 border border-[#D4AF37]/20 group-hover/item:bg-[#D4AF37] group-hover/item:text-black transition-all">1</div>
                <p className="text-xs text-white/40 leading-relaxed font-medium group-hover/item:text-white/70 transition-colors">
                  <span className="font-black text-white block mb-1">16 Verdades Fundamentais</span> Baseado na Declaração de Fé das Assembleias de Deus.
                </p>
              </div>
              <div className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-[10px] font-black shrink-0 border border-[#D4AF37]/20 group-hover/item:bg-[#D4AF37] group-hover/item:text-black transition-all">2</div>
                <p className="text-xs text-white/40 leading-relaxed font-medium group-hover/item:text-white/70 transition-colors">
                  <span className="font-black text-white block mb-1">Thompson Chain</span> Cadeias temáticas para estudo indutivo profundo.
                </p>
              </div>
              <div className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-[10px] font-black shrink-0 border border-[#D4AF37]/20 group-hover/item:bg-[#D4AF37] group-hover/item:text-black transition-all">3</div>
                <p className="text-xs text-white/40 leading-relaxed font-medium group-hover/item:text-white/70 transition-colors">
                  <span className="font-black text-white block mb-1">Cross-References</span> Mais de 344.800 referências cruzadas integradas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-[40px] p-10 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-[#D4AF37]/20 blur-[60px] rounded-full pointer-events-none" />
            
            <h3 className="text-lg font-black text-[#D4AF37] mb-3 relative z-10 tracking-tight">Estudo Temático</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-8 relative z-10 font-medium">
              Selecione etiquetas para filtrar versículos e notas relacionados a temas específicos.
            </p>
            <button className="w-full py-5 bg-white text-black rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#D4AF37] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative z-10">
              Gerar Relatório Teológico
              <ChevronRight size={16} className="stroke-[3px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
