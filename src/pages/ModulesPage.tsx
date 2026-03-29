/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Download, 
  Check, 
  Trash2, 
  Globe, 
  Info, 
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Layers,
  ChevronDown,
  Filter,
  Languages,
  X,
  Star,
  Calendar,
  User,
  History,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBibleStore } from '../store/bibleStore';
import { cn } from '../lib/utils';
import { moduleRepository, RemoteModule, RepositorySource } from '../services/moduleRepository';

interface DownloadState {
  progress: number;
  status: string;
}

export default function ModulesPage() {
  const { currentModuleId, setModule, downloadedModuleIds, addDownloadedModule, removeDownloadedModule } = useBibleStore();
  const [sources, setSources] = useState<RepositorySource[]>([]);
  const [activeSourceId, setActiveSourceId] = useState<string>('');
  const [modules, setModules] = useState<RemoteModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'downloaded'>('all');
  const [downloading, setDownloading] = useState<Record<string, DownloadState>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<RemoteModule | null>(null);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<DownloadState | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const availableSources = await moduleRepository.getSources();
      setSources(availableSources);
      if (availableSources.length > 0) {
        setActiveSourceId(availableSources[0].id);
        loadModules(availableSources[0].id);
      }
    };
    init();
  }, []);

  const loadModules = async (sourceId: string) => {
    setIsLoading(true);
    try {
      const fetchedModules = await moduleRepository.fetchModules(sourceId);
      setModules(fetchedModules);
    } catch (error) {
      console.error('Failed to load modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (module: RemoteModule) => {
    if (downloading[module.id]) return;

    setDownloading(prev => ({ 
      ...prev, 
      [module.id]: { progress: 0, status: 'Conectando...' } 
    }));

    try {
      await moduleRepository.downloadModule(module, (progress, status) => {
        setDownloading(prev => ({
          ...prev,
          [module.id]: { progress, status }
        }));
      });

      addDownloadedModule(module.id);
      
      // Auto-switch if it's the first one or if user wants
      // setModule(module.id);

      setTimeout(() => {
        setDownloading(prev => {
          const next = { ...prev };
          delete next[module.id];
          return next;
        });
      }, 1000);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloading(prev => {
        const next = { ...prev };
        delete next[module.id];
        return next;
      });
    }
  };

  const handleRemove = (moduleId: string) => {
    removeDownloadedModule(moduleId);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);
    setImportProgress({ progress: 0, status: 'Iniciando importação...' });

    try {
      const newModule = await moduleRepository.importModuleFromFile(file, (progress, status) => {
        setImportProgress({ progress, status });
      });
      
      addDownloadedModule(newModule.id);
      loadModules(activeSourceId); // Refresh list
      
      setTimeout(() => {
        setImportProgress(null);
        setIsImporting(false);
      }, 1500);
    } catch (error) {
      setImportError('Falha ao importar arquivo. Verifique se o formato é compatível.');
      setIsImporting(false);
    }
  };

  const handleUrlDownload = async () => {
    if (!importUrl) return;

    setIsImporting(true);
    setImportError(null);
    setImportProgress({ progress: 0, status: 'Validando link...' });

    try {
      const newModule = await moduleRepository.downloadFromUrl(importUrl, (progress, status) => {
        setImportProgress({ progress, status });
      });
      
      addDownloadedModule(newModule.id);
      loadModules(activeSourceId); // Refresh list
      setImportUrl('');
      
      setTimeout(() => {
        setImportProgress(null);
        setIsImporting(false);
      }, 1500);
    } catch (error: any) {
      setImportError(error.message || 'Falha ao baixar da URL.');
      setIsImporting(false);
    }
  };

  const languages = useMemo(() => {
    const langs = new Set(modules.map(m => m.language));
    return ['all', ...Array.from(langs)];
  }, [modules]);

  const filteredModules = modules.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.language.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || downloadedModuleIds.includes(m.id);
    const matchesLang = selectedLanguage === 'all' || m.language === selectedLanguage;
    return matchesSearch && matchesTab && matchesLang;
  });

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-8 pb-32 h-full flex flex-col">
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Database size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Biblioteca Global</span>
              <h1 className="text-5xl font-black tracking-tighter text-white italic leading-none mt-1">Módulos Bíblicos</h1>
            </div>
          </div>
          <p className="text-white/40 text-sm max-w-2xl font-medium leading-relaxed">
            Acesse repositórios oficiais e comunitários para expandir sua biblioteca. Baixe traduções, comentários e dicionários para estudo offline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <select 
              value={activeSourceId}
              onChange={(e) => {
                setActiveSourceId(e.target.value);
                loadModules(e.target.value);
              }}
              className="relative bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-[#D4AF37]/40 appearance-none pr-12 cursor-pointer transition-all"
            >
              {sources.map(s => (
                <option key={s.id} value={s.id} className="bg-[#0A0A0A]">{s.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>

          <button 
            onClick={() => loadModules(activeSourceId)}
            className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
            title="Atualizar Repositório"
          >
            <RefreshCw size={20} className={cn(isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-3 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tradução, sigla ou idioma..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] py-5 pl-14 pr-6 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.05] transition-all shadow-2xl"
            />
          </div>
          
          <div className="flex bg-white/[0.03] border border-white/5 rounded-[24px] p-1.5 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('all')}
              className={cn(
                "flex-1 md:flex-none px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'all' ? "bg-[#D4AF37] text-black shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              Repositório
            </button>
            <button 
              onClick={() => setActiveTab('downloaded')}
              className={cn(
                "flex-1 md:flex-none px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === 'downloaded' ? "bg-[#D4AF37] text-black shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              Meus Módulos
            </button>
          </div>

          <div className="relative group w-full md:w-auto">
            <Languages size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#D4AF37]" />
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] py-3.5 pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#D4AF37]/40 appearance-none cursor-pointer transition-all"
            >
              {languages.map(lang => (
                <option key={lang} value={lang} className="bg-[#0A0A0A]">{lang === 'all' ? 'Todos Idiomas' : lang}</option>
              ))}
            </select>
            <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-[32px] p-6 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]/60">Biblioteca</p>
              <p className="text-xl font-black text-white">{downloadedModuleIds.length} <span className="text-xs text-white/30 font-bold ml-1">instalados</span></p>
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40"
          >
            <Info size={16} />
          </motion.div>
        </div>
      </div>

      {/* Import Tools */}
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Upload size={28} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Importação Manual</h3>
            <p className="text-xs text-white/30 font-medium mb-4">Arraste ou selecione arquivos .sqlite, .db, .json ou .bbl.mysword</p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white cursor-pointer transition-all">
              <Upload size={14} />
              Selecionar Arquivo
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".sqlite,.db,.json,.bbl.mysword" />
            </label>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <LinkIcon size={28} />
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Download via URL</h3>
            <p className="text-xs text-white/30 font-medium mb-4">Cole o link direto do arquivo para baixar e instalar</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://exemplo.com/biblia.db"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 outline-none focus:border-purple-500/40 transition-all"
              />
              <button 
                onClick={handleUrlDownload}
                disabled={!importUrl || isImporting}
                className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/20 text-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                Baixar
              </button>
            </div>
          </div>
        </div>

        {/* Global Import Progress */}
        <AnimatePresence>
          {(isImporting || importProgress || importError) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="col-span-full"
            >
              <div className={cn(
                "p-6 rounded-[32px] border flex items-center justify-between gap-6",
                importError ? "bg-red-500/10 border-red-500/20" : "bg-[#D4AF37]/10 border-[#D4AF37]/20"
              )}>
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    importError ? "bg-red-500/20 text-red-500" : "bg-[#D4AF37]/20 text-[#D4AF37]"
                  )}>
                    {importError ? <AlertCircle size={24} /> : <RefreshCw size={24} className="animate-spin" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-widest text-white/80">
                      {importError ? 'Erro na Operação' : importProgress?.status || 'Processando...'}
                    </p>
                    {importError ? (
                      <p className="text-[10px] text-red-500/60 font-medium">{importError}</p>
                    ) : (
                      <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${importProgress?.progress || 0}%` }}
                          className="h-full bg-[#D4AF37]"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {importError && (
                  <button 
                    onClick={() => { setImportError(null); setIsImporting(false); }}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[320px] bg-white/[0.02] border border-white/5 rounded-[40px] animate-pulse" />
            ))
          ) : filteredModules.length > 0 ? (
            filteredModules.map((module, i) => {
              const downloadInfo = downloading[module.id];
              const isDownloaded = downloadedModuleIds.includes(module.id);
              
              return (
                <motion.div
                  layout
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedModule(module)}
                  className={cn(
                    "group relative bg-white/[0.02] border rounded-[40px] p-8 transition-all duration-700 hover:bg-white/[0.05] overflow-hidden flex flex-col justify-between cursor-pointer",
                    currentModuleId === module.id 
                      ? "border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(212,175,55,0.1)]" 
                      : "border-white/5 hover:border-white/20"
                  )}
                >
                  {/* Background Glow */}
                  <div className={cn(
                    "absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full transition-opacity duration-1000",
                    currentModuleId === module.id ? "bg-[#D4AF37]/10 opacity-100" : "bg-white/5 opacity-0 group-hover:opacity-100"
                  )} />

                  <div className="relative z-10 flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#D4AF37] transition-colors">
                          <Globe size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{module.language}</span>
                      </div>
                      {module.isPremium && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
                          <Sparkles size={10} className="text-[#D4AF37]" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Premium</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#D4AF37] transition-colors">{module.name}</h3>
                        <span className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-black text-white/40">{module.abbreviation}</span>
                      </div>
                      <p className="text-xs text-white/40 font-medium line-clamp-2 leading-relaxed">{module.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-6 mt-auto">
                    {downloadInfo && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-[#D4AF37] animate-pulse">{downloadInfo.status}</span>
                          <span className="text-white/60">{Math.round(downloadInfo.progress)}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${downloadInfo.progress}%` }}
                            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F5D17E] to-[#D4AF37] bg-[length:200%_100%] shadow-[0_0_15px_rgba(212,175,55,0.6)] relative"
                          >
                            <motion.div 
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                          </motion.div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Tamanho</span>
                        <span className="text-xs font-black text-white/60">{formatSize(module.size)}</span>
                      </div>

                      {isDownloaded ? (
                        <div className="flex items-center gap-2">
                          {currentModuleId === module.id ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                              <Check size={14} />
                              Ativo
                            </div>
                          ) : (
                            <button 
                              onClick={() => setModule(module.id)}
                              className="px-4 py-2 bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-white/60 hover:text-[#D4AF37] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Usar
                            </button>
                          )}
                          <button 
                            onClick={() => handleRemove(module.id)}
                            className="p-2.5 hover:bg-red-500/10 text-white/20 hover:text-red-500 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          disabled={!!downloadInfo}
                          onClick={() => handleDownload(module)}
                          className={cn(
                            "flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group/btn",
                            downloadInfo && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {downloadInfo ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform" />
                          )}
                          {downloadInfo ? 'Baixando' : 'Baixar'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-32 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-white/20">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Nenhum módulo encontrado</h3>
              <p className="text-white/40 text-sm">Tente ajustar sua busca ou mudar o repositório.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-20 p-10 bg-white/[0.02] border border-white/5 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck size={32} />
          </div>
          <div className="text-left">
            <h4 className="text-lg font-black text-white uppercase tracking-tight">Segurança Verbum</h4>
            <p className="text-xs text-white/30 font-medium max-w-md">Todos os módulos são verificados e otimizados para leitura offline. Suas notas e destaques são preservados ao trocar de tradução.</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all group">
          Ver Documentação Técnica
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Module Detail Modal */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModule(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0A0A] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 md:p-12 border-b border-white/5 flex items-start justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                    <Database size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40">{selectedModule.language}</span>
                      <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">{selectedModule.abbreviation}</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter italic">{selectedModule.name}</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedModule(null)}
                  className="p-4 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-10">
                    <section>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">Sobre este módulo</h3>
                      <p className="text-white/60 leading-relaxed font-medium">
                        {selectedModule.fullDescription || selectedModule.description}
                      </p>
                    </section>

                    {selectedModule.reviews && selectedModule.reviews.length > 0 && (
                      <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-6">Avaliações da Comunidade</h3>
                        <div className="space-y-6">
                          {selectedModule.reviews.map((review, idx) => (
                            <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                                    <User size={14} />
                                  </div>
                                  <span className="text-xs font-black text-white/80">{review.user}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={10} className={cn(i < review.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-white/10")} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-white/40 leading-relaxed italic">"{review.comment}"</p>
                              <p className="text-[9px] font-black uppercase tracking-widest text-white/10 mt-4">{review.date}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {selectedModule.relatedModules && selectedModule.relatedModules.length > 0 && (
                      <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-6">Módulos Relacionados</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedModule.relatedModules.map(relId => {
                            const relModule = modules.find(m => m.id === relId);
                            if (!relModule) return null;
                            return (
                              <button 
                                key={relId}
                                onClick={() => setSelectedModule(relModule)}
                                className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/5 hover:border-[#D4AF37]/20 transition-all"
                              >
                                <div className="text-left">
                                  <p className="text-[10px] font-black text-white/80 group-hover:text-[#D4AF37] transition-colors">{relModule.abbreviation}</p>
                                  <p className="text-[9px] font-medium text-white/30">{relModule.name}</p>
                                </div>
                                <ArrowRight size={14} className="text-white/10 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Editor</p>
                            <p className="text-xs font-black text-white">{selectedModule.publisher}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                            <History size={18} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Versão</p>
                            <p className="text-xs font-black text-white">{selectedModule.version}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Atualizado em</p>
                            <p className="text-xs font-black text-white">{selectedModule.updatedAt || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                            <Zap size={18} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Tamanho</p>
                            <p className="text-xs font-black text-white">{formatSize(selectedModule.size)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        {downloadedModuleIds.includes(selectedModule.id) ? (
                          <div className="space-y-3">
                            {currentModuleId === selectedModule.id ? (
                              <div className="w-full py-4 bg-[#D4AF37] text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg">
                                <Check size={16} />
                                Módulo Ativo
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setModule(selectedModule.id);
                                  setSelectedModule(null);
                                }}
                                className="w-full py-4 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-transparent rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                              >
                                Ativar Módulo
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                handleRemove(selectedModule.id);
                                setSelectedModule(null);
                              }}
                              className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors"
                            >
                              Remover da Biblioteca
                            </button>
                          </div>
                        ) : (
                          <button 
                            disabled={!!downloading[selectedModule.id]}
                            onClick={() => handleDownload(selectedModule)}
                            className="w-full py-4 bg-[#D4AF37] hover:bg-[#F5D17E] text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {downloading[selectedModule.id] ? (
                              <>
                                <RefreshCw size={16} className="animate-spin" />
                                Baixando...
                              </>
                            ) : (
                              <>
                                <Download size={16} />
                                Baixar Agora
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-3xl">
                      <div className="flex items-center gap-3 mb-3 text-[#D4AF37]">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verificado</span>
                      </div>
                      <p className="text-[10px] text-white/40 font-medium leading-relaxed">Este módulo foi verificado pela equipe Verbum e é compatível com todas as funcionalidades de estudo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
