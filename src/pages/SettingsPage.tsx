/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Eye, 
  Globe, 
  Database, 
  MessageSquare,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Check,
  Sparkles
} from 'lucide-react';
import { useSettingsStore, ThemeMode } from '../store/settingsStore';
import { cn } from '../lib/utils';

const THEMES: { id: ThemeMode; label: string; color: string }[] = [
  { id: 'dark', label: 'Classic', color: '#0B0A09' },
  { id: 'minimalist', label: 'Minimal', color: '#FFFFFF' },
  { id: 'velvet', label: 'Velvet', color: '#1A0B2E' },
  { id: 'ocean', label: 'Ocean', color: '#050B1A' },
  { id: 'forest', label: 'Forest', color: '#0B1A0F' },
  { id: 'royal', label: 'Royal', color: '#1A0505' },
  { id: 'midnight', label: 'Midnight', color: '#050A1A' },
  { id: 'sepia', label: 'Sépia', color: '#F3EBDD' },
  { id: 'amoled', label: 'AMOLED', color: '#000000' },
  { id: 'light', label: 'Light', color: '#F6F2EB' },
];

const FONTS = [
  'Literata',
  'Crimson Pro',
  'Playfair Display',
  'Inter',
  'Monospace',
];

export default function SettingsPage() {
  const { theme, settings, setThemeMode, setFontSize, setLineHeight, setFontFamily, updateSettings } = useSettingsStore();

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 px-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)]">
          <Icon size={18} />
        </div>
        <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-widest">{title}</h2>
      </div>
      <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border)] overflow-hidden">
        {children}
      </div>
    </div>
  );

  const SettingRow = ({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) => (
    <div className="p-4 border-b border-[var(--border)] last:border-none flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--text)]">{label}</p>
        {description && <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-1">{description}</p>}
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-8 pb-32 h-full flex flex-col">
      <div className="mb-16 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-4 block">Preferências de Sistema</span>
        <h1 className="text-6xl font-black tracking-tighter text-white mb-3 italic">Configurações</h1>
        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Personalize sua jornada espiritual</p>
      </div>

      <Section title="Aparência" icon={Palette}>
        <div className="p-8 border-b border-white/5">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8">Paleta de Cores</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-6">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeMode(t.id)}
                className={cn(
                  "flex flex-col items-center gap-3 group transition-all duration-500",
                  theme.mode === t.id ? "scale-110" : "opacity-40 hover:opacity-100"
                )}
              >
                <div 
                  className={cn(
                    "w-14 h-14 rounded-[20px] border-2 transition-all duration-500 flex items-center justify-center relative overflow-hidden shadow-2xl",
                    theme.mode === t.id ? "border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]" : "border-white/10 group-hover:border-white/30"
                  )}
                  style={{ backgroundColor: t.color }}
                >
                  {theme.mode === t.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  )}
                  {theme.mode === t.id && <Check size={20} className="text-white drop-shadow-lg relative z-10 stroke-[3px]" />}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest transition-colors",
                  theme.mode === t.id ? "text-[#D4AF37]" : "text-white/40"
                )}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <SettingRow label="Modo Escuro Automático" description="Sincronizar com o sistema operacional">
          <div className="w-14 h-7 bg-white/5 rounded-full border border-white/10 relative cursor-pointer group">
            <div className="absolute left-1 top-1 w-5 h-5 bg-white/20 rounded-full group-hover:bg-[#D4AF37] transition-all" />
          </div>
        </SettingRow>
      </Section>

      <Section title="Tipografia" icon={Type}>
        <SettingRow label="Fonte da Bíblia" description="Escolha o estilo visual do texto sagrado">
          <select 
            value={theme.fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-xs font-black text-white outline-none focus:border-[#D4AF37]/50 transition-all appearance-none cursor-pointer hover:bg-white/10"
          >
            {FONTS.map(f => <option key={f} value={f} className="bg-[#080808]">{f}</option>)}
          </select>
        </SettingRow>
        
        <SettingRow label="Tamanho do Texto" description={`${theme.fontSize}px`}>
          <input 
            type="range" 
            min="12" 
            max="32" 
            value={theme.fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-40 accent-[#D4AF37] cursor-pointer"
          />
        </SettingRow>

        <SettingRow label="Espaçamento entre Linhas" description={`${theme.lineHeight}`}>
          <div className="flex gap-2">
            {[1.4, 1.6, 1.9, 2.2].map(lh => (
              <button
                key={lh}
                onClick={() => setLineHeight(lh)}
                className={cn(
                  "w-12 h-12 rounded-2xl border flex items-center justify-center text-[10px] font-black transition-all duration-500",
                  theme.lineHeight === lh 
                    ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                    : "bg-white/5 border-white/10 text-white/30 hover:border-white/30 hover:text-white"
                )}
              >
                {lh}
              </button>
            ))}
          </div>
        </SettingRow>
      </Section>

      <Section title="Exibição" icon={Eye}>
        <SettingRow label="Modo Parágrafo" description="Texto corrido sem quebras de versículos">
          <input 
            type="checkbox" 
            checked={settings.textDisplay.paragraphMode}
            onChange={(e) => updateSettings({ textDisplay: { ...settings.textDisplay, paragraphMode: e.target.checked } })}
            className="w-6 h-6 accent-[#D4AF37] rounded-lg cursor-pointer"
          />
        </SettingRow>
        <SettingRow label="Palavras de Jesus em Vermelho" description="Destaque cromático para as falas de Cristo">
          <input 
            type="checkbox" 
            checked={settings.textDisplay.jesusWordsRed}
            onChange={(e) => updateSettings({ textDisplay: { ...settings.textDisplay, jesusWordsRed: e.target.checked } })}
            className="w-6 h-6 accent-[#D4AF37] rounded-lg cursor-pointer"
          />
        </SettingRow>
      </Section>

      <Section title="Inteligência Artificial" icon={Sparkles}>
        <SettingRow label="Auto-Sugestão Teológica" description="Sugestões dinâmicas baseadas no contexto de leitura">
          <input 
            type="checkbox" 
            checked={settings.ai.autoSuggest}
            onChange={(e) => updateSettings({ ai: { ...settings.ai, autoSuggest: e.target.checked } })}
            className="w-6 h-6 accent-[#D4AF37] rounded-lg cursor-pointer"
          />
        </SettingRow>
        <SettingRow label="Modelo de IA" description="Potência computacional do assistente Verbum">
          <select 
            value={settings.ai.model}
            onChange={(e) => updateSettings({ ai: { ...settings.ai, model: e.target.value as any } })}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-xs font-black text-white outline-none focus:border-[#D4AF37]/50 transition-all appearance-none cursor-pointer hover:bg-white/10"
          >
            <option value="gemini-2.0-flash" className="bg-[#080808]">Gemini 2.0 Flash</option>
            <option value="gemini-pro" className="bg-[#080808]">Gemini Pro</option>
          </select>
        </SettingRow>
      </Section>

      <div className="mt-24 p-12 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-[48px] border border-[#D4AF37]/20 text-center relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#D4AF37]/10 blur-[80px] rounded-full pointer-events-none" />
        <p className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-4 relative z-10">Verbum Bíblia Platform</p>
        <p className="text-sm text-white/40 font-bold mb-8 relative z-10">Versão 3.0.0-Academic Build 2026.03.29</p>
        <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto mb-8 relative z-10" />
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] relative z-10 italic">Desenvolvido com excelência por José Menezes da Silva</p>
      </div>
    </div>
  );
}
