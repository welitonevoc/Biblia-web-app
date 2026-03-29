/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar, 
  Tag as TagIcon, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  ArrowLeft,
  Save,
  Smile,
  Meh,
  Frown,
  Heart,
  CloudRain,
  Sun,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useJournalStore, JournalEntry } from '../store/journalStore';
import { cn } from '../lib/utils';

const MOODS = [
  { id: 'happy', icon: <Smile size={20} />, label: 'Feliz', color: '#10b981' },
  { id: 'peaceful', icon: <Sun size={20} />, label: 'Em Paz', color: '#3b82f6' },
  { id: 'neutral', icon: <Meh size={20} />, label: 'Neutro', color: '#6b7280' },
  { id: 'sad', icon: <Frown size={20} />, label: 'Triste', color: '#ef4444' },
  { id: 'grateful', icon: <Heart size={20} />, label: 'Grato', color: '#db2777' },
  { id: 'struggling', icon: <CloudRain size={20} />, label: 'Lutando', color: '#6366f1' },
];

export default function JournalPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Partial<JournalEntry> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  const filteredEntries = useMemo(() => {
    return entries.filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: JournalEntry[] } = {};
    filteredEntries.forEach(entry => {
      const date = new Date(entry.createdAt);
      const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(entry);
    });
    return groups;
  }, [filteredEntries]);

  const handleCreate = () => {
    setEditingEntry({
      title: '',
      content: '',
      mood: 'neutral',
      tags: [],
      relatedVerses: []
    });
    setIsEditing(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsEditing(true);
    setViewingEntry(null);
  };

  const handleSave = () => {
    if (!editingEntry?.title || !editingEntry?.content) return;

    if (editingEntry.id) {
      updateEntry(editingEntry.id, {
        title: editingEntry.title,
        content: editingEntry.content,
        mood: editingEntry.mood,
        tags: editingEntry.tags,
        relatedVerses: editingEntry.relatedVerses
      });
    } else {
      addEntry({
        title: editingEntry.title!,
        content: editingEntry.content!,
        mood: editingEntry.mood,
        tags: editingEntry.tags,
        relatedVerses: editingEntry.relatedVerses,
        date: new Date().toISOString()
      });
    }
    setIsEditing(false);
    setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta entrada do diário?')) {
      deleteEntry(id);
      setViewingEntry(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 pb-32 h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!isEditing && !viewingEntry ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-lg">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)]">Reflexões Pessoais</span>
                    <h1 className="text-5xl font-black tracking-tighter text-[var(--text)] italic leading-none mt-1">Meu Diário</h1>
                  </div>
                </div>
                <p className="text-[var(--text-muted)] text-sm max-w-md font-medium leading-relaxed">
                  Um espaço sagrado para suas conversas com Deus, reflexões sobre a Palavra e registro de sua jornada espiritual.
                </p>
              </div>

              <button 
                onClick={handleCreate}
                className="flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                Nova Entrada
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-12 group">
              <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar em suas reflexões..."
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-[32px] py-6 pl-16 pr-8 text-lg text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--accent)]/40 focus:bg-[var(--bg-hover)] transition-all shadow-2xl"
              />
            </div>

            {/* Entries List */}
            <div className="space-y-12">
              {Object.keys(groupedEntries).length > 0 ? (
                Object.entries(groupedEntries).map(([monthYear, monthEntries]) => (
                  <div key={monthYear}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-6 ml-4">{monthYear}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {monthEntries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          whileHover={{ y: -4 }}
                          onClick={() => setViewingEntry(entry)}
                          className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[40px] p-8 cursor-pointer hover:border-[var(--accent)]/40 transition-all shadow-xl"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors">
                                {MOODS.find(m => m.id === entry.mood)?.icon || <Meh size={20} />}
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
                                  {new Date(entry.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', weekday: 'short' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {entry.tags?.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-[var(--accent-bg)] text-[var(--accent)] text-[8px] font-black uppercase rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <h4 className="text-xl font-black text-[var(--text)] mb-3 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                            {entry.title}
                          </h4>
                          <p className="text-sm text-[var(--text-muted)] line-clamp-3 leading-relaxed mb-6">
                            {entry.content}
                          </p>
                          <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                            <span className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">
                              {new Date(entry.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <ChevronRight size={16} className="text-[var(--text-dim)] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 text-center">
                  <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] flex items-center justify-center mx-auto mb-8 text-[var(--text-dim)]">
                    <BookOpen size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-[var(--text)] mb-2">Seu diário está em branco</h3>
                  <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">
                    Comece a registrar suas experiências com Deus hoje mesmo.
                  </p>
                  <button 
                    onClick={handleCreate}
                    className="mt-8 text-[var(--accent)] font-black uppercase tracking-widest text-xs hover:underline"
                  >
                    Escrever minha primeira entrada
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : viewingEntry ? (
          <motion.div 
            key="view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
              <button 
                onClick={() => setViewingEntry(null)}
                className="flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors font-black uppercase tracking-widest text-[10px]"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleEdit(viewingEntry)}
                  className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-[var(--text-dim)] hover:text-[var(--accent)] transition-all"
                >
                  <Edit3 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(viewingEntry.id)}
                  className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-[var(--text-dim)] hover:text-red-500 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[48px] p-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-hover)] flex items-center justify-center text-[var(--accent)]">
                  {MOODS.find(m => m.id === viewingEntry.mood)?.icon || <Meh size={28} />}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">
                    {new Date(viewingEntry.createdAt).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h2 className="text-4xl font-black text-[var(--text)] tracking-tighter italic">{viewingEntry.title}</h2>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-xl text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap font-medium italic border-l-4 border-[var(--accent)]/20 pl-8 py-4 mb-12">
                  {viewingEntry.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-12 border-t border-[var(--border)]">
                {viewingEntry.tags?.map(tag => (
                  <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-hover)] rounded-xl text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                    <TagIcon size={14} />
                    {tag}
                  </div>
                ))}
                {viewingEntry.relatedVerses?.map(verse => (
                  <div key={verse} className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-bg)] rounded-xl text-xs font-black text-[var(--accent)] uppercase tracking-widest">
                    <BookOpen size={14} />
                    {verse}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors font-black uppercase tracking-widest text-[10px]"
              >
                <X size={16} />
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={!editingEntry?.title || !editingEntry?.content}
                className="flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Save size={20} />
                Salvar Reflexão
              </button>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[48px] p-12 shadow-2xl flex-1 flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 flex-1">
                <div className="lg:col-span-3 space-y-8 flex flex-col">
                  <input 
                    type="text"
                    value={editingEntry?.title || ''}
                    onChange={(e) => setEditingEntry(prev => ({ ...prev!, title: e.target.value }))}
                    placeholder="Título da sua reflexão..."
                    className="w-full bg-transparent text-5xl font-black tracking-tighter text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none italic"
                  />
                  <textarea 
                    value={editingEntry?.content || ''}
                    onChange={(e) => setEditingEntry(prev => ({ ...prev!, content: e.target.value }))}
                    placeholder="O que Deus tem falado ao seu coração hoje?"
                    className="w-full bg-transparent text-xl text-[var(--text-muted)] leading-relaxed placeholder:text-[var(--text-dim)] outline-none resize-none flex-1 font-medium"
                  />
                </div>

                <div className="space-y-10">
                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-6">Como você se sente?</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {MOODS.map(mood => (
                        <button
                          key={mood.id}
                          onClick={() => setEditingEntry(prev => ({ ...prev!, mood: mood.id }))}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                            editingEntry?.mood === mood.id 
                              ? "bg-[var(--accent-bg)] border-[var(--accent)] text-[var(--accent)]" 
                              : "bg-[var(--bg-hover)] border-transparent text-[var(--text-dim)] hover:border-[var(--border)]"
                          )}
                        >
                          {mood.icon}
                          <span className="text-[8px] font-black uppercase">{mood.label}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-6">Etiquetas</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Oração', 'Estudo', 'Gratidão', 'Luta', 'Promessa', 'Família'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            const tags = editingEntry?.tags || [];
                            const newTags = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag];
                            setEditingEntry(prev => ({ ...prev!, tags: newTags }));
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            editingEntry?.tags?.includes(tag)
                              ? "bg-[var(--accent)] text-white"
                              : "bg-[var(--bg-hover)] text-[var(--text-dim)] hover:text-[var(--text)]"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-6">Versículos Citados</h3>
                    <div className="space-y-3">
                      <div className="relative">
                        <Plus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" />
                        <input 
                          type="text"
                          placeholder="Adicionar versículo..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value;
                              if (val) {
                                setEditingEntry(prev => ({ ...prev!, relatedVerses: [...(prev?.relatedVerses || []), val] }));
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="w-full bg-[var(--bg-hover)] border border-transparent rounded-xl py-3 pl-10 pr-4 text-xs text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--accent)]/40 transition-all"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingEntry?.relatedVerses?.map(verse => (
                          <div key={verse} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-bg)] text-[var(--accent)] text-[10px] font-black uppercase rounded-xl">
                            {verse}
                            <button onClick={() => setEditingEntry(prev => ({ ...prev!, relatedVerses: prev?.relatedVerses?.filter(v => v !== verse) }))}>
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
