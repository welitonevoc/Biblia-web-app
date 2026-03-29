/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  Share2, 
  BookOpen, 
  Zap,
  MoreVertical,
  ArrowDownCircle,
  MessageSquare,
  Search,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente teológico Verbum. Como posso ajudar em seus estudos bíblicos hoje?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "Você é um assistente teológico erudito e equilibrado, focado em ajudar usuários a entender a Bíblia, contextos históricos e teologia cristã. Suas respostas devem ser profundas, respeitosas e baseadas em evidências bíblicas e históricas.",
        },
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || 'Desculpe, não consegui processar sua pergunta.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col py-8 px-6">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-[var(--text)] italic">IA CHAT</h1>
            <p className="text-xs uppercase font-black tracking-[0.3em] text-[var(--accent)]">Consultoria Teológica</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-dim)] hover:text-red-500 hover:border-red-500/30 transition-all shadow-premium"
          >
            <Trash2 size={18} />
          </button>
          <button className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all shadow-premium">
            <History size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8 pr-4 mb-8">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-6",
              message.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-premium border border-[var(--border)]",
              message.role === 'assistant' ? "bg-[var(--accent-bg)] text-[var(--accent)]" : "bg-[var(--bg-card)] text-[var(--text-dim)]"
            )}>
              {message.role === 'assistant' ? <Bot size={24} /> : <User size={24} />}
            </div>
            
            <div className={cn(
              "max-w-[80%] p-8 rounded-[40px] shadow-premium relative overflow-hidden",
              message.role === 'assistant' 
                ? "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text)] rounded-tl-none" 
                : "bg-[var(--accent)] text-[var(--bg)] rounded-tr-none"
            )}>
              {message.role === 'assistant' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]/20" />
              )}
              <p className="text-base font-medium leading-relaxed italic whitespace-pre-wrap">
                {message.content}
              </p>
              <div className={cn(
                "mt-6 flex items-center gap-4 text-xs font-black uppercase tracking-widest",
                message.role === 'assistant' ? "text-[var(--text-dim)]" : "text-[var(--bg)]/60"
              )}>
                <span>{new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center gap-2">
                  <button className="hover:text-[var(--accent)] transition-colors"><Copy size={12} /></button>
                  <button className="hover:text-[var(--accent)] transition-colors"><Share2 size={12} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold border border-[var(--border)]">
              <Bot size={24} className="animate-pulse" />
            </div>
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-8 rounded-[40px] rounded-tl-none shadow-premium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent pointer-events-none z-10" />
        <div className="relative z-20 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[32px] p-2 shadow-premium group focus-within:border-[var(--accent)]/40 transition-all">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 pl-4">
              <button className="p-2 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"><BookOpen size={18} /></button>
              <button className="p-2 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"><Zap size={18} /></button>
            </div>
            <input 
              type="text" 
              placeholder="Pergunte algo sobre a Bíblia..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none py-6 px-4 text-[var(--text)] focus:ring-0 outline-none text-base font-medium italic"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-gold",
                input.trim() && !isLoading 
                  ? "bg-[var(--accent)] text-[var(--bg)] scale-100" 
                  : "bg-[var(--bg-card)] text-[var(--text-dim)] scale-90 opacity-50"
              )}
            >
              <Send size={24} className={cn("transition-transform", input.trim() && "translate-x-0.5 -translate-y-0.5")} />
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-xs font-black uppercase tracking-[0.3em] text-[var(--text-dim)]">
          IA pode cometer erros. Sempre verifique com as Escrituras.
        </p>
      </div>
    </div>
  );
}
