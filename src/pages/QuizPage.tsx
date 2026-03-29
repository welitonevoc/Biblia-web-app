/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Play, 
  Clock, 
  Star,
  Award,
  Zap,
  Target,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'Quem foi o primeiro rei de Israel?',
    options: ['Davi', 'Saul', 'Salomão', 'Samuel'],
    correctAnswer: 1,
    explanation: 'Saul foi ungido por Samuel como o primeiro rei de Israel (1 Samuel 10:1).'
  },
  {
    id: '2',
    text: 'Qual é o livro mais longo da Bíblia?',
    options: ['Gênesis', 'Isaías', 'Salmos', 'Jeremias'],
    correctAnswer: 2,
    explanation: 'O livro de Salmos contém 150 capítulos, sendo o mais longo da Bíblia.'
  },
  {
    id: '3',
    text: 'Quantos discípulos Jesus escolheu?',
    options: ['10', '12', '14', '7'],
    correctAnswer: 1,
    explanation: 'Jesus escolheu doze discípulos para segui-lo (Mateus 10:1).'
  }
];

export default function QuizPage() {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleStart = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === MOCK_QUESTIONS[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameState('result');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 pb-32">
      <AnimatePresence mode="wait">
        {gameState === 'lobby' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-4 mb-8 px-6 py-3 bg-[var(--accent-bg)] rounded-full border border-[var(--accent)]/10 shadow-gold">
              <Brain size={18} className="text-[var(--accent)]" />
              <span className="text-[10px] uppercase font-black tracking-[0.5em] text-[var(--accent)]">Desafio Bíblico</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-[var(--text)] italic mb-6">TESTE SEU CONHECIMENTO</h1>
            <p className="text-[var(--text-dim)] uppercase text-[11px] font-black tracking-[0.3em] mb-16 max-w-xl mx-auto leading-relaxed">
              Desafie-se com perguntas sobre a Palavra de Deus e suba no ranking global de sabedoria bíblica.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Zap, label: 'Rápido', value: '3 Minutos' },
                { icon: Target, label: 'Precisão', value: '10 Questões' },
                { icon: Users, label: 'Global', value: 'Ranking' }
              ].map((stat, i) => (
                <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[32px] p-8 shadow-premium">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mx-auto mb-4">
                    <stat.icon size={24} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-1">{stat.label}</h3>
                  <p className="text-lg font-black text-[var(--text)] uppercase italic">{stat.value}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={handleStart}
              className="group relative inline-flex items-center gap-6 px-12 py-6 bg-[var(--accent)] text-[var(--bg)] rounded-[32px] font-black uppercase tracking-[0.2em] shadow-gold hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Play size={24} className="fill-current" />
              <span>Iniciar Desafio</span>
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <Star size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[var(--text)] uppercase tracking-tighter italic">Questão {currentQuestionIndex + 1}</h2>
                  <p className="text-[9px] text-[var(--text-dim)] font-black uppercase tracking-widest">Nível: Iniciante</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[9px] text-[var(--text-dim)] font-black uppercase tracking-widest">Pontuação</p>
                  <p className="text-xl font-black text-[var(--accent)] italic">{score * 100}</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[var(--accent)]/20 border-t-[var(--accent)] animate-spin" />
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[48px] p-12 md:p-16 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--border)]">
                <motion.div 
                  className="h-full bg-[var(--accent)] shadow-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-[var(--text)] uppercase tracking-tight italic mb-12 leading-tight">
                {MOCK_QUESTIONS[currentQuestionIndex].text}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {MOCK_QUESTIONS[currentQuestionIndex].options.map((option, index) => {
                  const isCorrect = index === MOCK_QUESTIONS[currentQuestionIndex].correctAnswer;
                  const isSelected = selectedOption === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={selectedOption !== null}
                      className={cn(
                        "w-full flex items-center justify-between p-6 rounded-[24px] border transition-all duration-500 text-left group",
                        selectedOption === null 
                          ? "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--bg-hover)]" 
                          : isCorrect 
                            ? "bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                            : isSelected 
                              ? "bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                              : "bg-[var(--bg-card)] border-[var(--border)] opacity-40"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors",
                          selectedOption === null 
                            ? "bg-[var(--bg-surface)] text-[var(--text-dim)] group-hover:bg-[var(--accent)] group-hover:text-[var(--bg)]" 
                            : isCorrect 
                              ? "bg-green-500 text-white" 
                              : isSelected 
                                ? "bg-red-500 text-white" 
                                : "bg-[var(--bg-surface)] text-[var(--text-dim)]"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{option}</span>
                      </div>
                      {selectedOption !== null && isCorrect && <CheckCircle2 size={24} />}
                      {selectedOption !== null && isSelected && !isCorrect && <XCircle size={24} />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showExplanation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 p-8 bg-[var(--accent-bg)] border border-[var(--accent)]/10 rounded-[32px]"
                  >
                    <div className="flex items-center gap-3 mb-4 text-[var(--accent)]">
                      <Award size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Explicação Teológica</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text)] italic leading-relaxed">
                      {MOCK_QUESTIONS[currentQuestionIndex].explanation}
                    </p>
                    <button 
                      onClick={handleNext}
                      className="mt-8 w-full py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-black uppercase tracking-widest shadow-gold hover:scale-[1.02] transition-all"
                    >
                      {currentQuestionIndex < MOCK_QUESTIONS.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dim)] flex items-center justify-center text-[var(--bg)] mx-auto mb-8 shadow-gold animate-bounce">
              <Trophy size={64} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-[var(--text)] italic mb-4 uppercase">Desafio Concluído!</h1>
            <p className="text-[var(--text-dim)] uppercase text-[11px] font-black tracking-[0.3em] mb-12">Você demonstrou grande sabedoria bíblica.</p>
            
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[48px] p-12 mb-12 shadow-premium max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-2">Acertos</p>
                  <p className="text-4xl font-black text-[var(--text)] italic">{score}/{MOCK_QUESTIONS.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-2">Pontos</p>
                  <p className="text-4xl font-black text-[var(--accent)] italic">{score * 100}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={handleStart}
                className="px-12 py-6 bg-[var(--accent)] text-[var(--bg)] rounded-[32px] font-black uppercase tracking-[0.2em] shadow-gold hover:scale-105 transition-all"
              >
                Tentar Novamente
              </button>
              <button 
                onClick={() => setGameState('lobby')}
                className="px-12 py-6 bg-[var(--bg-surface)] text-[var(--text-dim)] border border-[var(--border)] rounded-[32px] font-black uppercase tracking-[0.2em] hover:text-[var(--text)] hover:border-[var(--accent)]/30 transition-all"
              >
                Voltar ao Início
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
