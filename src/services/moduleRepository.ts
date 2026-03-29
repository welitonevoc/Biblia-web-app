/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RemoteModule {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  languageCode: string;
  description: string;
  size: number; // in bytes
  version: string;
  publisher: string;
  isPremium: boolean;
  downloadUrl: string;
  category: 'Bible' | 'Commentary' | 'Dictionary' | 'Map';
  fullDescription?: string;
  updatedAt?: string;
  reviews?: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  relatedModules?: string[]; // IDs of related modules
}

export interface RepositorySource {
  id: string;
  name: string;
  url: string;
  type: 'official' | 'community' | 'academic';
}

const MOCK_SOURCES: RepositorySource[] = [
  { id: 'verbum-official', name: 'Verbum Official Repository', url: 'https://api.verbum.app/v1/modules', type: 'official' },
  { id: 'crosswire', name: 'CrossWire Bible Society', url: 'https://www.crosswire.org/ftpmirror/pub/sword/packages/rawzip/', type: 'academic' },
  { id: 'mysword-compat', name: 'MySword Community Modules', url: 'https://mysword.info/modules', type: 'community' }
];

const MOCK_REMOTE_MODULES: RemoteModule[] = [
  {
    id: 'nvi-pt',
    name: 'Nova Versão Internacional',
    abbreviation: 'NVI',
    language: 'Português',
    languageCode: 'pt',
    description: 'Tradução contemporânea e fiel aos originais.',
    fullDescription: 'A Nova Versão Internacional (NVI) é uma das mais recentes traduções da Bíblia. Foi publicada pela Sociedade Bíblica Internacional, hoje denominada Biblica, com o objetivo de produzir uma versão em português que fosse fiel aos textos originais, mas que também fosse de fácil compreensão para o leitor contemporâneo.',
    size: 4404019,
    version: '2011.1',
    updatedAt: '2024-01-15',
    publisher: 'Biblica',
    isPremium: false,
    downloadUrl: '/modules/nvi-pt.db',
    category: 'Bible',
    reviews: [
      { user: 'João Silva', rating: 5, comment: 'Excelente tradução, muito clara.', date: '2024-02-10' },
      { user: 'Maria Oliveira', rating: 4, comment: 'Gosto muito da linguagem.', date: '2024-03-05' }
    ],
    relatedModules: ['acf-pt', 'ara-pt']
  },
  {
    id: 'acf-pt',
    name: 'Almeida Corrigida Fiel',
    abbreviation: 'ACF',
    language: 'Português',
    languageCode: 'pt',
    description: 'Baseada no Textus Receptus, linguagem clássica.',
    fullDescription: 'A Almeida Corrigida Fiel (ACF) é uma tradução da Bíblia em língua portuguesa baseada na versão de João Ferreira de Almeida. A tradução ACF utilizou como base o Textus Receptus para o Novo Testamento e o Texto Massorético para o Antigo Testamento.',
    size: 3984588,
    version: '1994.2',
    updatedAt: '2023-11-20',
    publisher: 'SBTB',
    isPremium: false,
    downloadUrl: '/modules/acf-pt.db',
    category: 'Bible',
    reviews: [
      { user: 'Pedro Santos', rating: 5, comment: 'A melhor versão para estudo profundo.', date: '2024-01-12' }
    ],
    relatedModules: ['nvi-pt', 'ara-pt']
  },
  {
    id: 'ara-pt',
    name: 'Almeida Revista e Atualizada',
    abbreviation: 'ARA',
    language: 'Português',
    languageCode: 'pt',
    description: 'Equilíbrio entre fidelidade e fluidez.',
    fullDescription: 'A Almeida Revista e Atualizada (ARA) é uma tradução da Bíblia em língua portuguesa, baseada na tradução de João Ferreira de Almeida. É o resultado de um trabalho de revisão da Almeida Revista e Corrigida.',
    size: 4194304,
    version: '1993.1',
    updatedAt: '2023-05-10',
    publisher: 'SBB',
    isPremium: false,
    downloadUrl: '/modules/ara-pt.db',
    category: 'Bible',
    relatedModules: ['nvi-pt', 'acf-pt']
  },
  {
    id: 'kjv-en',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'English',
    languageCode: 'en',
    description: 'The most influential English translation.',
    fullDescription: 'The King James Version (KJV), also known as the King James Bible (KJB) or simply the Authorized Version (AV), is an English translation of the Christian Bible for the Church of England, begun in 1604 and completed in 1611.',
    size: 4718592,
    version: '1769',
    updatedAt: '2022-12-01',
    publisher: 'Public Domain',
    isPremium: false,
    downloadUrl: '/modules/kjv-en.db',
    category: 'Bible',
    relatedModules: ['esv-en']
  },
  {
    id: 'esv-en',
    name: 'English Standard Version',
    abbreviation: 'ESV',
    language: 'English',
    languageCode: 'en',
    description: 'Essentially literal translation.',
    fullDescription: 'The English Standard Version (ESV) is an English translation of the Bible. It is a revision of the 1971 edition of the Revised Standard Version (RSV).',
    size: 4300000,
    version: '2016',
    updatedAt: '2023-08-15',
    publisher: 'Crossway',
    isPremium: true,
    downloadUrl: '/modules/esv-en.db',
    category: 'Bible',
    relatedModules: ['kjv-en']
  },
  {
    id: 'bhs-he',
    name: 'Biblia Hebraica Stuttgartensia',
    abbreviation: 'BHS',
    language: 'Hebrew',
    languageCode: 'he',
    description: 'Original Old Testament text.',
    fullDescription: 'Biblia Hebraica Stuttgartensia (BHS) is an edition of the Masoretic Text of the Hebrew Bible as preserved in the Leningrad Codex, and supplemented by masoretic and text-critical notes.',
    size: 5452595,
    version: '5th Ed',
    updatedAt: '2021-10-20',
    publisher: 'Deutsche Bibelgesellschaft',
    isPremium: true,
    downloadUrl: '/modules/bhs.db',
    category: 'Bible'
  }
];

export class ModuleRepositoryService {
  async getSources(): Promise<RepositorySource[]> {
    // In a real app, this might be fetched from a config file or API
    return MOCK_SOURCES;
  }

  async fetchModules(sourceId: string): Promise<RemoteModule[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, we would fetch from the source.url
    // For now, we return the mock list filtered by some logic if needed
    return MOCK_REMOTE_MODULES;
  }

  async downloadModule(module: RemoteModule, onProgress: (progress: number, status: string) => void): Promise<ArrayBuffer> {
    onProgress(0, 'Iniciando conexão...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onProgress(10, 'Solicitando arquivo...');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate chunked download
    const totalChunks = 10;
    for (let i = 1; i <= totalChunks; i++) {
      const progress = 10 + (i / totalChunks) * 70;
      onProgress(progress, `Baixando: ${Math.round(progress)}%`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    onProgress(85, 'Verificando assinatura digital...');
    await new Promise(resolve => setTimeout(resolve, 600));

    onProgress(95, 'Finalizando instalação...');
    await new Promise(resolve => setTimeout(resolve, 400));

    onProgress(100, 'Módulo instalado com sucesso!');
    
    // Return a dummy ArrayBuffer
    return new ArrayBuffer(module.size);
  }

  async importModuleFromFile(file: File, onProgress?: (progress: number, status: string) => void): Promise<RemoteModule> {
    onProgress?.(10, 'Lendo arquivo...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onProgress?.(40, 'Validando formato...');
    await new Promise(resolve => setTimeout(resolve, 600));

    const fileName = file.name.split('.')[0];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    const newModule: RemoteModule = {
      id: `imported-${Date.now()}`,
      name: `Importado: ${fileName}`,
      abbreviation: fileName.substring(0, 4).toUpperCase(),
      language: 'Desconhecido',
      languageCode: 'unknown',
      description: `Módulo importado manualmente do arquivo .${extension}`,
      size: file.size,
      version: '1.0.0',
      publisher: 'Importação Manual',
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      isPremium: false,
      downloadUrl: '',
      category: 'Bible',
      fullDescription: `Este módulo foi importado manualmente a partir do arquivo ${file.name}. Verifique a procedência do arquivo antes de usar.`
    };

    onProgress?.(80, 'Instalando módulo...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onProgress?.(100, 'Importação concluída');
    
    MOCK_REMOTE_MODULES.push(newModule);
    
    return newModule;
  }

  async downloadFromUrl(url: string, onProgress?: (progress: number, status: string) => void): Promise<RemoteModule> {
    onProgress?.(10, 'Validando URL...');
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!url.startsWith('http')) {
      throw new Error('URL inválida. Certifique-se de que o link começa com http:// ou https://');
    }

    onProgress?.(30, 'Iniciando download remoto...');
    await new Promise(resolve => setTimeout(resolve, 1200));

    onProgress?.(60, 'Baixando dados...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const fileName = url.split('/').pop()?.split('?')[0] || 'modulo_remoto';
    
    const newModule: RemoteModule = {
      id: `url-${Date.now()}`,
      name: `URL: ${fileName}`,
      abbreviation: 'URL',
      language: 'Desconhecido',
      languageCode: 'unknown',
      description: 'Módulo baixado via link direto.',
      size: 15 * 1024 * 1024, // Mock size
      version: '1.0.0',
      publisher: 'Download via URL',
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      isPremium: false,
      downloadUrl: url,
      category: 'Bible',
      fullDescription: `Este módulo foi baixado automaticamente a partir da URL: ${url}`
    };

    onProgress?.(90, 'Finalizando instalação...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onProgress?.(100, 'Download concluído');
    
    MOCK_REMOTE_MODULES.push(newModule);
    
    return newModule;
  }

  async importBookmarks(file: File): Promise<any[]> {
    // Simulação de importação de marcadores
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: crypto.randomUUID(),
            bookId: '1',
            chapter: 1,
            verse: 1,
            text: 'No princípio, criou Deus os céus e a terra.',
            label: 'Criação',
            tags: ['Teologia', 'Início'],
            createdAt: Date.now()
          },
          {
            id: crypto.randomUUID(),
            bookId: '43',
            chapter: 3,
            verse: 16,
            text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...',
            label: 'Amor de Deus',
            tags: ['Evangelho', 'Salvação'],
            createdAt: Date.now()
          }
        ]);
      }, 1500);
    });
  }
}

export const moduleRepository = new ModuleRepositoryService();
