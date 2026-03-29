/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  Trophy,
  Share2,
  MoreVertical,
  Play,
  Check,
  List
} from 'lucide-react';
import { usePlanStore } from '../store/planStore';
import { useBibleStore } from '../store/bibleStore';
import { ReadingPlan, PlanDay, PlanTask } from '../domain/entities/ReadingPlan';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface PlanDetailsPageProps {
  planId: string;
  onBack: () => void;
  onNavigateToReader: () => void;
}

export default function PlanDetailsPage({ planId, onBack, onNavigateToReader }: PlanDetailsPageProps) {
  const { availablePlans, userProgress, toggleTaskCompletion, calculateProgress } = usePlanStore();
  const { navigate } = useBibleStore();
  
  const plan = availablePlans.find(p => p.id === planId);
  const progress = userProgress[planId];
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { resetPlan } = usePlanStore();

  if (!plan || !progress) return null;

  const completionPercentage = calculateProgress(planId);
  const totalTasks = plan.days.reduce((acc, day) => acc + day.tasks.length, 0);
  const completedCount = progress.completedTasks.length;

  const handleTaskClick = (task: PlanTask) => {
    navigate(task.bookId, task.chapterStart);
    onNavigateToReader();
  };

  const handleMarkDayComplete = (day: PlanDay) => {
    day.tasks.forEach(task => {
      if (!progress.completedTasks.includes(task.id)) {
        toggleTaskCompletion(planId, task.id);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-32">
      {/* Header */}
      <div className="mb-16">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Voltar aos Planos</span>
        </button>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3 aspect-[3/4] rounded-[48px] overflow-hidden border-4 border-[var(--border)] shadow-premium relative group">
            <img 
              src={plan.imageUrl} 
              alt={plan.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--bg)]">
                    <Trophy size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Nível Premium</span>
               </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-[var(--accent-bg)] border border-[var(--accent-dim)]/20 rounded-full text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">
                {plan.category}
              </span>
              <span className="text-[var(--text-dim)]">•</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
                Iniciado em {new Date(progress.startDate).toLocaleDateString('pt-BR')}
              </span>
              <div className="ml-auto flex items-center gap-4">
                {showResetConfirm ? (
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Confirmar?</span>
                    <button 
                      onClick={() => {
                        resetPlan(planId);
                        onBack();
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest"
                    >
                      Sim
                    </button>
                    <button 
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1 bg-[var(--bg-card)] text-[var(--text-muted)] rounded-lg text-[9px] font-black uppercase tracking-widest"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowResetConfirm(true)}
                    className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                  >
                    Reiniciar Plano
                  </button>
                )}
              </div>
            </div>

            <h1 className="text-5xl font-black tracking-tighter text-[var(--text)] mb-6 italic leading-tight">{plan.title}</h1>
            <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed font-medium">{plan.description}</p>

            <div className="grid grid-cols-3 gap-6 mb-12">
              <StatCard icon={Calendar} label="Duração" value={`${plan.durationDays} Dias`} />
              <StatCard icon={CheckCircle2} label="Concluído" value={`${completedCount}/${totalTasks}`} />
              <StatCard icon={Clock} label="Ritmo" value="Diário" />
            </div>

            <div className="bg-[var(--bg-surface)] rounded-[40px] p-8 border border-[var(--border)] shadow-premium">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1">Progresso Geral</p>
                  <h3 className="text-4xl font-black text-[var(--accent)]">{completionPercentage}%</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1">Status</p>
                   <span className="text-sm font-bold text-[var(--text)]">
                     {completionPercentage === 100 ? 'Jornada Concluída!' : 'Em andamento'}
                   </span>
                </div>
              </div>
              <div className="w-full h-3 bg-[var(--bg-card)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-[var(--accent-dim)] to-[var(--accent)] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-[var(--text)] mb-8 flex items-center gap-4">
          <List size={24} className="text-[var(--accent)]" />
          Cronograma de Leitura
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {plan.days.map((day) => (
            <DayRow 
              key={day.day} 
              day={day} 
              planId={plan.id}
              completedTasks={progress.completedTasks}
              onToggleTask={toggleTaskCompletion}
              onReadTask={handleTaskClick}
              onMarkDayComplete={handleMarkDayComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border)] flex flex-col items-center text-center group hover:border-[var(--accent)] transition-all">
      <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform">
        <Icon size={18} />
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1">{label}</p>
      <p className="text-sm font-black text-[var(--text)]">{value}</p>
    </div>
  );
}

function DayRow({ 
  day, 
  planId, 
  completedTasks, 
  onToggleTask, 
  onReadTask,
  onMarkDayComplete
}: { 
  day: PlanDay; 
  planId: string;
  completedTasks: string[];
  onToggleTask: (pId: string, tId: string) => void;
  onReadTask: (task: PlanTask) => void;
  onMarkDayComplete: (day: PlanDay) => void;
}) {
  const isDayCompleted = day.tasks.every(t => completedTasks.includes(t.id));

  return (
    <div className={cn(
      "bg-[var(--bg-surface)] rounded-3xl border transition-all duration-300 overflow-hidden",
      isDayCompleted ? "border-[var(--accent)]/30 opacity-70" : "border-[var(--border)] hover:border-[var(--text-dim)]"
    )}>
      <div className="p-6 flex items-center gap-6">
        <button 
          onClick={() => onMarkDayComplete(day)}
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all",
            isDayCompleted ? "bg-[var(--accent)] text-[var(--bg)]" : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--accent)] border border-transparent"
          )}
        >
          {isDayCompleted ? <CheckCircle2 size={20} /> : day.day}
        </button>
        
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1">Dia {day.day}</p>
          <div className="flex flex-wrap gap-4">
            {day.tasks.map(task => {
              const isTaskCompleted = completedTasks.includes(task.id);
              return (
                <div key={task.id} className="flex items-center gap-3">
                  <button 
                    onClick={() => onToggleTask(planId, task.id)}
                    className={cn(
                      "w-6 h-6 rounded-lg border flex items-center justify-center transition-all",
                      isTaskCompleted 
                        ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--bg)]" 
                        : "bg-[var(--bg-card)] border-[var(--border)] text-transparent hover:border-[var(--accent)]"
                    )}
                  >
                    <Check size={14} strokeWidth={4} />
                  </button>
                  <button 
                    onClick={() => onReadTask(task)}
                    className={cn(
                      "text-sm font-bold transition-colors",
                      isTaskCompleted ? "text-[var(--text-dim)] line-through" : "text-[var(--text)] hover:text-[var(--accent)]"
                    )}
                  >
                    {task.reference}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={() => onReadTask(day.tasks[0])}
          className="w-10 h-10 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-dim)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all"
        >
          <Play size={16} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
