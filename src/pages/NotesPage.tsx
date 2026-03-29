/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Search, Filter, ChevronRight, Pin, Trash2, Edit3, X, FileText, Tag as TagIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RichTextEditor from '../components/notes/RichTextEditor';
import { cn } from '../lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
  tags: string[];
}

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Estudo sobre a Graça', content: '<p>A graça de Deus é o favor imerecido...</p>', date: '28 Mar 2026', pinned: true, tags: ['graça', 'salvação'] },
  { id: '2', title: 'Sermão de Domingo', content: '<p>Texto base: Mateus 5:1-12...</p>', date: '25 Mar 2026', pinned: false, tags: ['sermão', 'mateus'] },
  { id: '3', title: 'Oração e Jejum', content: '<p>A importância da disciplina espiritual...</p>', date: '20 Mar 2026', pinned: false, tags: ['oração', 'jejum'] },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  const handleSave = (content: string) => {
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, content } : n));
    }
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Nova Nota',
      content: '',
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      pinned: false,
      tags: []
    };
    setNotes([newNote, ...notes]);
    setEditingNote(newNote);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-8 pb-32 h-full flex flex-col">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3 block">Arquivo Pessoal</span>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">Minhas Notas</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Organize seus estudos e reflexões</p>
        </div>
        <button 
          onClick={createNewNote}
          className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#8B732A] text-black rounded-[24px] shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
        >
          <Plus size={32} className="stroke-[2.5px] group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      <div className="relative mb-12 group">
        <div className="absolute inset-0 bg-[#D4AF37] blur-[60px] opacity-0 group-focus-within:opacity-10 transition-all duration-700" />
        <div className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-[32px] p-2 shadow-2xl group-focus-within:border-[#D4AF37]/30 backdrop-blur-xl transition-all duration-500">
          <div className="w-14 h-14 flex items-center justify-center text-white/20 group-focus-within:text-[#D4AF37] transition-colors">
            <Search size={22} className="stroke-[2.5px]" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O que você escreveu antes?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold text-white placeholder:text-white/10 outline-none px-2"
          />
          <button className="w-14 h-14 flex items-center justify-center bg-white/5 text-white/40 rounded-2xl hover:text-white transition-all">
            <Filter size={20} className="stroke-[2.5px]" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {pinnedNotes.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6 px-4">
                <Pin size={16} className="text-[#D4AF37] rotate-45" />
                <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Fixadas</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pinnedNotes.map(note => (
                  <NoteCard key={note.id} note={note} onEdit={() => setEditingNote(note)} />
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-6 px-4">
              <FileText size={16} className="text-white/20" />
              <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Todas as Notas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherNotes.map(note => (
                <NoteCard key={note.id} note={note} onEdit={() => setEditingNote(note)} />
              ))}
            </div>
          </div>
        </AnimatePresence>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingNote && (
          <motion.div
            key="editor-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl p-4 md:p-10 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="w-full h-full max-w-6xl relative"
            >
              <button 
                onClick={() => setEditingNote(null)}
                className="absolute -top-16 right-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </button>
              <div className="w-full h-full bg-[#080808] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <RichTextEditor 
                  title={editingNote.title}
                  content={editingNote.content}
                  onChange={handleSave}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NoteCard({ note, onEdit }: { note: Note; onEdit: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onEdit}
      className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 hover:border-[#D4AF37]/20 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer group relative overflow-hidden flex flex-col h-64"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-black text-white tracking-tight truncate flex-1 mr-4 group-hover:text-[#D4AF37] transition-colors">{note.title}</h3>
        {note.pinned && <Pin size={16} className="text-[#D4AF37] rotate-45 shrink-0" />}
      </div>
      <div 
        className="text-sm text-white/40 line-clamp-4 flex-1 mb-6 overflow-hidden relative z-10 font-medium leading-relaxed group-hover:text-white/60 transition-colors"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
      <div className="flex items-center justify-between mt-auto relative z-10">
        <div className="flex gap-2 overflow-hidden">
          {note.tags.map((t, i) => (
            <span key={`${t}-${i}`} className="px-3 py-1 bg-white/5 text-white/30 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/5 group-hover:border-[#D4AF37]/20 group-hover:text-[#D4AF37] transition-all">
              {t}
            </span>
          ))}
        </div>
        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">{note.date}</span>
      </div>
    </motion.div>
  );
}
