/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Tag as TagIcon, ChevronRight, Folder, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
}

export const THEOLOGICAL_CATEGORIES = [
  {
    id: 'attributes',
    name: 'Atributos de Deus',
    icon: '✨',
    tags: [
      { id: 'soberania', name: 'Soberania', color: '#1e3a8a' },
      { id: 'onipotencia', name: 'Onipotência', color: '#2563eb' },
      { id: 'onipresenca', name: 'Onipresença', color: '#3b82f6' },
      { id: 'onisciencia', name: 'Onisciência', color: '#60a5fa' },
      { id: 'santidade', name: 'Santidade', color: '#000000' },
      { id: 'justica', name: 'Justiça', color: '#4b5563' },
      { id: 'amor', name: 'Amor', color: '#db2777' },
      { id: 'fidelidade', name: 'Fidelidade', color: '#0ea5e9' },
    ]
  },
  {
    id: 'salvation',
    name: 'Salvação',
    icon: '✝️',
    tags: [
      { id: 'graca', name: 'Graça', color: '#c9783a' },
      { id: 'fe', name: 'Fé', color: '#16a34a' },
      { id: 'justificacao', name: 'Justificação', color: '#78350f' },
      { id: 'redencao', name: 'Redenção', color: '#dc2626' },
      { id: 'expiacao', name: 'Expiação', color: '#991b1b' },
      { id: 'santificacao', name: 'Santificação', color: '#854d0e' },
      { id: 'glorificacao', name: 'Glorificação', color: '#ca8a04' },
      { id: 'eleicao', name: 'Eleição', color: '#1e40af' },
    ]
  },
  {
    id: 'holy_spirit',
    name: 'Espírito Santo',
    icon: '🕊️',
    tags: [
      { id: 'batismo_es', name: 'Batismo no Espírito', color: '#f59e0b' },
      { id: 'dons_es', name: 'Dons do Espírito', color: '#f97316' },
      { id: 'fruto_es', name: 'Fruto do Espírito', color: '#84cc16' },
      { id: 'selo_es', name: 'Selo do Espírito', color: '#3b82f6' },
      { id: 'uncao', name: 'Unção', color: '#eab308' },
      { id: 'intercessao', name: 'Intercessão', color: '#06b6d4' },
    ]
  },
  {
    id: 'christian_life',
    name: 'Vida Cristã',
    icon: '🌱',
    tags: [
      { id: 'oracao', name: 'Oração', color: '#0891b2' },
      { id: 'jejum', name: 'Jejum', color: '#6b7280' },
      { id: 'meditacao', name: 'Meditação', color: '#4f46e5' },
      { id: 'discipulado', name: 'Discipulado', color: '#0d9488' },
      { id: 'mordomia', name: 'Mordomia', color: '#15803d' },
      { id: 'servico', name: 'Serviço', color: '#2563eb' },
      { id: 'adoracao', name: 'Adoração', color: '#be185d' },
      { id: 'louvor', name: 'Louvor', color: '#db2777' },
      { id: 'testemunho', name: 'Testemunho', color: '#16a34a' },
      { id: 'evangelismo', name: 'Evangelismo', color: '#15803d' },
      { id: 'comunhao', name: 'Comunhão', color: '#0d9488' },
      { id: 'perdao', name: 'Perdão', color: '#c9783a' },
    ]
  },
  // ... more categories can be added
];

interface TagSystemProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export default function TagSystem({ selectedTagIds, onChange }: TagSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredTags = useMemo(() => {
    let tags = THEOLOGICAL_CATEGORIES.flatMap(c => c.tags.map(t => ({ ...t, category: c.name })));
    
    if (activeCategory) {
      tags = tags.filter(t => t.category === THEOLOGICAL_CATEGORIES.find(c => c.id === activeCategory)?.name);
    }
    
    if (searchQuery) {
      tags = tags.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return tags;
  }, [searchQuery, activeCategory]);

  const toggleTag = (id: string) => {
    onChange(
      selectedTagIds.includes(id) 
        ? selectedTagIds.filter(i => i !== id) 
        : [...selectedTagIds, id]
    );
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
            <TagIcon size={16} className="text-[var(--accent)]" />
            Etiquetas Teológicas
          </h3>
          <button className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg text-[var(--accent)] transition-colors">
            <Plus size={18} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar etiqueta..."
            className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl py-2 pl-10 pr-10 text-sm focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--bg-hover)] rounded-full text-[var(--text-dim)] hover:text-[var(--text)] transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button 
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
              activeCategory === null 
                ? "bg-[var(--accent)] text-white" 
                : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
            )}
          >
            Todas
          </button>
          {THEOLOGICAL_CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5",
                activeCategory === cat.id 
                  ? "bg-[var(--accent)] text-white" 
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 content-start">
        <AnimatePresence mode="popLayout">
          {filteredTags.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {filteredTags.map(tag => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-xl border transition-all text-left",
                    selectedTagIds.includes(tag.id)
                      ? "bg-[var(--accent-bg)] border-[var(--accent)] text-[var(--accent)]"
                      : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-dim)]"
                  )}
                >
                  <div 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: tag.color }} 
                  />
                  <span className="text-xs font-medium truncate">{tag.name}</span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--bg-hover)] flex items-center justify-center mx-auto mb-4 text-[var(--text-dim)]">
                <Search size={24} />
              </div>
              <p className="text-sm text-[var(--text-muted)] font-medium">Nenhuma etiqueta encontrada</p>
              <p className="text-xs text-[var(--text-dim)] mt-1">Tente outro termo ou limpe os filtros</p>
              {(searchQuery || activeCategory) && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory(null);
                  }}
                  className="mt-4 text-xs text-[var(--accent)] font-bold hover:underline px-4 py-2 bg-[var(--accent-bg)] rounded-lg"
                >
                  Limpar todos os filtros
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedTagIds.length > 0 && (
        <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex flex-wrap gap-1.5">
            {selectedTagIds.map(id => {
              const tag = THEOLOGICAL_CATEGORIES.flatMap(c => c.tags).find(t => t.id === id);
              if (!tag) return null;
              return (
                <div 
                  key={id}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] text-[10px] font-bold uppercase"
                >
                  <span>{tag.name}</span>
                  <button onClick={() => toggleTag(id)} className="hover:text-[var(--text)]">
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
