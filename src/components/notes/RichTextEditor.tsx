/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Highlighter,
  Link as LinkIcon,
  Table as TableIcon,
  CheckSquare,
  AlertCircle,
  EyeOff,
  Save,
  FileText,
  Type
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface RichTextEditorProps {
  title: string;
  content: string;
  onChange: (content: string) => void;
  onStatsChange?: (stats: { words: number; chars: number; lines: number }) => void;
}

export default function RichTextEditor({ title, content, onChange, onStatsChange }: RichTextEditorProps) {
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [stats, setStats] = useState({ words: 0, chars: 0, lines: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: 'Comece a digitar sua nota...',
      }),
      Typography,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setSaveState('unsaved');
      
      // Update stats
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const lines = text.split('\n').length;
      const newStats = { words, chars, lines };
      setStats(newStats);
      onStatsChange?.(newStats);
    },
  });

  useEffect(() => {
    if (saveState === 'unsaved') {
      const timer = setTimeout(() => {
        setSaveState('saving');
        setTimeout(() => setSaveState('saved'), 500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);

  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, 
    active = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        active 
          ? "bg-[var(--accent-bg)] text-[var(--accent)]" 
          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-xl">
      {/* Editor Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-card)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
            <FileText size={20} />
          </div>
          <div>
            <input 
              type="text" 
              value={title}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Título da nota"
              className="bg-transparent border-none focus:ring-0 text-lg font-bold text-[var(--text)] placeholder:text-[var(--text-dim)] w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Subtle save indicator moved to toolbar or kept here but made more minimal */}
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-2 border-b border-[var(--border)] bg-[var(--bg-surface)] flex flex-wrap items-center gap-1">
        <div className="flex flex-wrap gap-1 flex-1">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
            <Strikethrough size={18} />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-[var(--border)] mx-1 self-center" />
          
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Título 1">
            <Heading1 size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título 2">
            <Heading2 size={18} />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-[var(--border)] mx-1 self-center" />
          
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista Numerada">
            <ListOrdered size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citação">
            <Quote size={18} />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-[var(--border)] mx-1 self-center" />
          
          <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffcc00' }).run()} active={editor.isActive('highlight')} title="Destaque">
            <Highlighter size={18} />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-[var(--border)] mx-1 self-center" />
          
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
            <Undo size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
            <Redo size={18} />
          </ToolbarButton>
        </div>

        {/* Minimalist Save Indicator */}
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-500",
          saveState === 'saved' ? "text-green-500/60" :
          saveState === 'saving' ? "text-[var(--accent)] animate-pulse" :
          "text-amber-500/60"
        )}>
          {saveState === 'saved' ? (
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span>Salvo</span>
            </div>
          ) : saveState === 'saving' ? (
            <div className="flex items-center gap-2">
              <Save size={12} className="animate-bounce" />
              <span>Salvando</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              <span>Alterado</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-6 prose prose-invert max-w-none">
        <EditorContent editor={editor} className="min-h-full focus:outline-none" />
      </div>

      {/* Status Bar */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>📄 {stats.words} palavras</span>
          <span>✒️ {stats.chars} caracteres</span>
          <span>📑 {stats.lines} linhas</span>
        </div>
        <div className="flex items-center gap-2">
          <Type size={12} />
          <span>Editor TipTap v2.0</span>
        </div>
      </div>
    </div>
  );
}
