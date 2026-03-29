/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Filter, 
  LayoutGrid, 
  List, 
  Search, 
  Sparkles, 
  Trophy,
  ArrowRight,
  Play
} from 'lucide-react';
import { usePlanStore } from '../store/planStore';
import { ReadingPlan } from '../domain/entities/ReadingPlan';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import PlanDetailsPage from './PlanDetailsPage';

interface PlansPageProps {
  onNavigateToReader: () => void;
}

export default function PlansPage({ onNavigateToReader }: PlansPageProps) {
  const { availablePlans, userProgress, startPlan, calculateProgress, activePlanId, setActivePlan } = usePlanStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (activePlanId) {
    return <PlanDetailsPage planId={activePlanId} onBack={() => setActivePlan(null)} onNavigateToReader={onNavigateToReader} />;
  }

  const categories = ['Todos', 'Bíblia Toda', 'Novo Testamento', 'Antigo Testamento', 'Temático', 'Devocional'];

  const filteredPlans = availablePlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || plan.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const activeUserPlans = availablePlans
    .filter(p => userProgress[p.id])
    .sort((a, b) => (userProgress[b.id]?.lastAccessed || 0) - (userProgress[a.id]?.lastAccessed || 0));

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
            <Calendar size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)]">Planos de Leitura</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-[var(--text)] mb-4 italic">Jornada Sagrada</h1>
            <p className="text-sm text-[var(--text-muted)] max-w-xl font-medium leading-relaxed">
              Transforme sua vida através da disciplina espiritual. Escolha um plano que se adapte ao seu ritmo e mergulhe nas Escrituras.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-[var(--bg-surface)] p-1 rounded-2xl border border-[var(--border)]">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === 'grid' ? "bg-[var(--bg-card)] text-[var(--accent)] shadow-lg" : "text-[var(--text-dim)]"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === 'list' ? "bg-[var(--bg-card)] text-[var(--accent)] shadow-lg" : "text-[var(--text-dim)]"
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Plans Section */}
      {activeUserPlans.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-black text-[var(--text)] flex items-center gap-3">
              <Sparkles size={20} className="text-[var(--accent)]" />
              Seu Progresso Atual
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeUserPlans.map(plan => (
              <ActivePlanCard 
                key={plan.id} 
                plan={plan} 
                progress={calculateProgress(plan.id)} 
                onClick={() => setActivePlan(plan.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-12 space-y-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={20} />
          <input 
            type="text"
            placeholder="Buscar planos por título ou tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-[32px] py-5 pl-16 pr-8 text-sm text-[var(--text)] focus:border-[var(--accent)] outline-none transition-all shadow-premium"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                activeCategory === cat 
                  ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] shadow-gold" 
                  : "bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--text-dim)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plans List */}
      <div className={cn(
        "grid gap-8",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
            >
              <PlanCard plan={plan} onStart={() => startPlan(plan.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActivePlanCard({ plan, progress, onClick }: { plan: ReadingPlan; progress: number; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[var(--bg-surface)] rounded-[40px] p-8 border border-[var(--border)] relative overflow-hidden group hover:border-[var(--accent)] transition-all duration-500 shadow-premium cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--accent-bg)] to-transparent opacity-50 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[var(--border)]">
          <img src={plan.imageUrl} alt={plan.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-[var(--accent)]">{progress}%</span>
          <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-dim)]">Concluído</p>
        </div>
      </div>

      <h3 className="text-xl font-black text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">{plan.title}</h3>
      
      <div className="w-full h-2 bg-[var(--bg-card)] rounded-full mb-8 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[var(--accent-dim)] to-[var(--accent)] rounded-full"
        />
      </div>

      <button className="w-full py-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text)] group-hover:bg-[var(--accent)] group-hover:text-[var(--bg)] group-hover:border-[var(--accent)] transition-all flex items-center justify-center gap-3 group/btn shadow-lg">
        Continuar Leitura
        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function PlanCard({ plan, onStart }: { plan: ReadingPlan; onStart: () => void }) {
  return (
    <div 
      onClick={onStart}
      className="bg-[var(--bg-surface)] rounded-[40px] overflow-hidden border border-[var(--border)] group hover:border-[var(--accent)] transition-all duration-500 flex flex-col h-full shadow-premium cursor-pointer"
    >
      <div className="h-48 relative overflow-hidden">
        <img 
          src={plan.imageUrl} 
          alt={plan.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-[var(--bg)]/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">
            {plan.category}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-4 text-[var(--text-dim)]">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{plan.durationDays} Dias</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
          <div className="flex items-center gap-1.5">
            <BookOpen size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Completo</span>
          </div>
        </div>

        <h3 className="text-2xl font-black text-[var(--text)] mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight">{plan.title}</h3>
        <p className="text-sm text-[var(--text-muted)] mb-8 line-clamp-2 leading-relaxed">{plan.description}</p>

        <div className="mt-auto">
          <button 
            onClick={onStart}
            className="w-full py-5 bg-[var(--accent)] text-[var(--bg)] rounded-3xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-gold"
          >
            Começar Jornada
            <Play size={14} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
