/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Search, 
  Filter, 
  ChevronRight, 
  MapPin, 
  Compass, 
  Layers, 
  Maximize2, 
  Navigation,
  Info,
  History,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface BiblicalPlace {
  id: string;
  name: string;
  category: 'city' | 'region' | 'mountain' | 'river';
  description: string;
  reference: string;
  coordinates: { x: number; y: number };
}

const MOCK_PLACES: BiblicalPlace[] = [
  { id: '1', name: 'Jerusalém', category: 'city', description: 'A cidade santa, centro do culto judaico e local da crucificação de Jesus.', reference: 'Salmos 122:3', coordinates: { x: 45, y: 60 } },
  { id: '2', name: 'Belém', category: 'city', description: 'Local de nascimento de Davi e de Jesus Cristo.', reference: 'Miquéias 5:2', coordinates: { x: 48, y: 65 } },
  { id: '3', name: 'Monte Sinai', category: 'mountain', description: 'Onde Moisés recebeu os Dez Mandamentos.', reference: 'Êxodo 19:20', coordinates: { x: 30, y: 85 } },
  { id: '4', name: 'Rio Jordão', category: 'river', description: 'Onde Jesus foi batizado por João Batista.', reference: 'Mateus 3:13', coordinates: { x: 55, y: 40 } },
  { id: '5', name: 'Nazaré', category: 'city', description: 'Onde Jesus cresceu e viveu a maior parte de sua vida.', reference: 'Lucas 2:39', coordinates: { x: 50, y: 30 } },
];

export default function MapsPage() {
  const [selectedPlace, setSelectedPlace] = useState<BiblicalPlace | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = MOCK_PLACES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-32">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-bg)] flex items-center justify-center text-[var(--accent)] shadow-gold">
            <MapIcon size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-[var(--text)] italic">MAPAS BÍBLICOS</h1>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--accent)]">Geografia da Redenção</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[700px]">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full overflow-hidden">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar local..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all outline-none shadow-premium"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-[24px] border transition-all duration-500 text-left group",
                  selectedPlace?.id === place.id 
                    ? "bg-[var(--accent-bg)] border-[var(--accent)]/30 text-[var(--accent)] shadow-gold" 
                    : "bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)]/30 hover:bg-[var(--bg-hover)]"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  selectedPlace?.id === place.id ? "bg-[var(--accent)] text-[var(--bg)]" : "bg-[var(--bg-card)] text-[var(--text-dim)] group-hover:bg-[var(--accent)] group-hover:text-[var(--bg)]"
                )}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">{place.name}</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{place.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[48px] relative overflow-hidden shadow-premium group">
          {/* Map Background (Mock) */}
          <div className="absolute inset-0 bg-[#1a1a1a] opacity-50">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--accent) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--accent)]/5 to-transparent pointer-events-none" />
          </div>

          {/* Map Pins */}
          {MOCK_PLACES.map((place) => (
            <motion.button
              key={`pin-${place.id}`}
              onClick={() => setSelectedPlace(place)}
              className="absolute z-10 group/pin"
              style={{ left: `${place.coordinates.x}%`, top: `${place.coordinates.y}%` }}
              whileHover={{ scale: 1.2 }}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-gold",
                selectedPlace?.id === place.id ? "bg-[var(--accent)] text-[var(--bg)] scale-125" : "bg-[var(--bg-card)] text-[var(--accent)] border border-[var(--accent)]/30"
              )}>
                <MapPin size={16} />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[8px] font-black uppercase tracking-widest text-[var(--text)] opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap shadow-premium">
                {place.name}
              </div>
            </motion.button>
          ))}

          {/* Map Controls */}
          <div className="absolute top-8 right-8 flex flex-col gap-3 z-20">
            {[Compass, Layers, Maximize2, Navigation].map((Icon, i) => (
              <button key={i} className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all shadow-premium">
                <Icon size={20} />
              </button>
            ))}
          </div>

          {/* Place Info Overlay */}
          <AnimatePresence>
            {selectedPlace && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute bottom-8 left-8 right-8 bg-[var(--bg-surface)]/90 backdrop-blur-2xl border border-[var(--border)] rounded-[40px] p-10 z-30 shadow-premium"
              >
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dim)] flex items-center justify-center text-[var(--bg)] shadow-gold shrink-0">
                    <MapPin size={48} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <h2 className="text-3xl font-black text-[var(--text)] uppercase tracking-tighter italic">{selectedPlace.name}</h2>
                      <span className="px-3 py-1 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-[9px] font-black uppercase tracking-widest border border-[var(--accent)]/10">
                        {selectedPlace.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-dim)] italic leading-relaxed mb-6">
                      {selectedPlace.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">
                        <BookOpen size={14} />
                        <span>{selectedPlace.reference}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">
                        <History size={14} />
                        <span>Mencionado 12 vezes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button className="px-8 py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-black uppercase tracking-widest shadow-gold hover:scale-105 transition-all">
                      Ir para o Leitor
                    </button>
                    <button 
                      onClick={() => setSelectedPlace(null)}
                      className="px-8 py-4 bg-[var(--bg-card)] text-[var(--text-dim)] border border-[var(--border)] rounded-2xl font-black uppercase tracking-widest hover:text-[var(--text)] transition-all"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
