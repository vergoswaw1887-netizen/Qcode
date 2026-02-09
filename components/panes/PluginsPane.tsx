
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Star, Search, XCircle, ArrowLeft, Globe, ShieldCheck, Tag } from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: string;
  iconColor: string;
  initial: string;
  version: string;
  readme: string;
}

const POPULAR_PLUGINS: Plugin[] = [
  { 
      id: 'python', name: 'Python', description: 'IntelliSense, Linting, Debugging (multi-threaded), Jupyter Notebooks.', author: 'Microsoft', downloads: '110M', iconColor: 'bg-blue-600', initial: 'P', version: '2024.2.1',
      readme: '### Python Extension for VS Code\n\nA Visual Studio Code extension with rich support for the Python language (for all actively supported versions of the language: >=3.7), including features such as IntelliSense (Pylance), linting, debugging, code navigation, code formatting, refactoring, variable explorer, test explorer, and more.'
  },
  { 
      id: 'prettier', name: 'Prettier', description: 'Code formatter using prettier', author: 'Prettier', downloads: '48M', iconColor: 'bg-pink-600', initial: 'Pr', version: '10.1.0',
      readme: '### Prettier - Code Formatter\n\nPrettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.'
  },
  { 
      id: 'cpp', name: 'C/C++', description: 'C/C++ IntelliSense, debugging, and code browsing.', author: 'Microsoft', downloads: '68M', iconColor: 'bg-blue-800', initial: 'C++', version: '1.19.9',
      readme: '### C/C++ for Visual Studio Code\n\nThe C/C++ extension adds language support for C/C++ to Visual Studio Code, including features such as IntelliSense and debugging.'
  },
  { 
      id: 'vscode-icons', name: 'vscode-icons', description: 'Icons for Visual Studio Code', author: 'VSCode Icons Team', downloads: '16M', iconColor: 'bg-yellow-600', initial: 'Vs', version: '12.0.1',
      readme: '### vscode-icons\n\nBring icons to your Visual Studio Code. The most popular icon theme for VS Code.'
  },
  { 
      id: 'gitlens', name: 'GitLens', description: 'Supercharge Git within VS Code.', author: 'GitKraken', downloads: '28M', iconColor: 'bg-purple-700', initial: 'GL', version: '14.0.0',
      readme: '### GitLens — Git supercharged\n\nGitLens helps you to visualize code authorship at a glance via Git blame annotations and code lens, seamlessly navigate and explore Git repositories, gain valuable insights via powerful comparison commands, and so much more.'
  },
  { 
      id: 'terminal-pro', name: 'Advanced Terminal Pro', description: 'Integrated terminal with xterm.js, themes, and multiple shell support.', author: 'ACode Corp', downloads: '5M', iconColor: 'bg-slate-700', initial: 'T_', version: '2.0.0',
      readme: '### Advanced Terminal Pro\n\nA powerful terminal emulator for the web. Supports multiple sessions, theming, and robust shell integration.'
  },
  {
      id: 'tailwind', name: 'Tailwind CSS IntelliSense', description: 'Intelligent Tailwind CSS tooling for VS Code', author: 'Tailwind Labs', downloads: '10M', iconColor: 'bg-cyan-500', initial: 'Tw', version: '0.9.1',
      readme: '### Tailwind CSS IntelliSense\n\nTailwind CSS IntelliSense enhances the Tailwind development experience by providing Visual Studio Code users with advanced features such as autocomplete, syntax highlighting, and linting.'
  }
];

const PluginsPane: React.FC = () => {
  const [query, setQuery] = useState('');
  const [installedPlugins, setInstalledPlugins] = useState<Set<string>>(new Set());
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInstall = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (installedPlugins.has(id)) {
        const newSet = new Set(installedPlugins);
        newSet.delete(id);
        setInstalledPlugins(newSet);
    } else {
        setInstalledPlugins(prev => new Set(prev).add(id));
    }
  };

  const filteredPlugins = POPULAR_PLUGINS.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  // -- DETAIL VIEW (FULL SCREEN PORTAL) --
  // Guard clause: only render portal if mounted and body exists
  if (selectedPlugin && mounted && typeof document !== 'undefined' && document.body) {
      const isInstalled = installedPlugins.has(selectedPlugin.id);
      
      return createPortal(
          <div className="fixed inset-0 z-[99999] w-screen h-screen flex flex-col bg-[var(--bg-root)] text-[var(--fg-primary)] animate-in slide-in-from-bottom-10 duration-200">
              {/* Header with Back Button */}
              <div className="h-14 border-b border-[var(--border-color)] flex items-center px-4 bg-[var(--bg-sidebar)] shrink-0 gap-4 shadow-sm">
                  <button 
                    onClick={() => setSelectedPlugin(null)} 
                    className="p-2 -ml-2 hover:bg-[var(--bg-root)] rounded-full text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-colors"
                  >
                      <ArrowLeft size={24} />
                  </button>
                  <span className="text-base font-bold uppercase tracking-wide">Extension Details</span>
              </div>
              
              <div className="flex-1 overflow-y-auto w-full">
                  <div className="max-w-4xl mx-auto p-6 md:p-10 pb-20">
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className={`w-32 h-32 ${selectedPlugin.iconColor} rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-2xl shrink-0`}>
                            {selectedPlugin.initial}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2 text-[var(--fg-primary)]">{selectedPlugin.name}</h1>
                            <p className="text-[var(--fg-secondary)] text-lg mb-4">{selectedPlugin.description}</p>
                            <div className="flex items-center gap-6 text-sm text-[var(--fg-secondary)] mb-6">
                                <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-blue-400" /> {selectedPlugin.author}</span>
                                <span className="flex items-center gap-1.5"><Download size={16} /> {selectedPlugin.downloads}</span>
                                <span className="flex items-center gap-1.5"><Tag size={16} /> v{selectedPlugin.version}</span>
                            </div>
                            <button 
                                onClick={() => handleInstall(selectedPlugin.id)}
                                className={`
                                    px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all w-full md:w-auto shadow-lg
                                    ${isInstalled 
                                        ? 'bg-[var(--bg-panel)] text-[var(--fg-primary)] border border-[var(--border-color)] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' 
                                        : 'bg-[var(--accent)] text-white hover:brightness-110 hover:-translate-y-0.5'}
                                `}
                            >
                                {isInstalled ? 'Uninstall' : 'Install'}
                            </button>
                        </div>
                    </div>

                    {/* Tabs simulation */}
                    <div className="flex gap-8 border-b border-[var(--border-color)] mb-6 text-sm font-medium">
                        <div className="border-b-2 border-[var(--accent)] pb-3 text-[var(--fg-primary)]">Details</div>
                        <div className="pb-3 text-[var(--fg-secondary)] cursor-pointer hover:text-[var(--fg-primary)] transition-colors">Changelog</div>
                        <div className="pb-3 text-[var(--fg-secondary)] cursor-pointer hover:text-[var(--fg-primary)] transition-colors">Feature Contributions</div>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="whitespace-pre-wrap text-[var(--fg-secondary)] leading-relaxed">
                            {selectedPlugin.readme}
                        </p>
                        <h3 className="text-[var(--fg-primary)] mt-8 mb-4 font-bold text-xl">Usage</h3>
                        <div className="bg-[var(--bg-panel)] p-4 rounded-lg border border-[var(--border-color)] font-mono text-sm shadow-inner">
                            {`> Ctrl+Shift+P\n> ${selectedPlugin.name}: Start`}
                        </div>
                    </div>
                  </div>
              </div>
          </div>,
          document.body
      );
  }

  // -- LIST VIEW --
  return (
    <div className="h-full flex flex-col bg-[var(--bg-panel)] text-[var(--fg-primary)]">
      <div className="p-4 border-b border-[var(--border-color)] shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--fg-secondary)] mb-3">Extensions</h2>
        <div className="relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Extensions"
            className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] pl-8 text-[var(--fg-primary)] placeholder-[var(--fg-secondary)]"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-secondary)]" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]">
                <XCircle size={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredPlugins.length === 0 ? (
           <div className="p-6 text-center text-[var(--fg-secondary)] text-xs italic">
               No extensions found.
           </div>
        ) : (
            <div className="flex flex-col">
                {filteredPlugins.map((plugin) => {
                    const isInstalled = installedPlugins.has(plugin.id);

                    return (
                        <div 
                            key={plugin.id} 
                            onClick={() => setSelectedPlugin(plugin)}
                            className="flex gap-3 p-3 hover:bg-[var(--bg-root)] cursor-pointer border-b border-transparent hover:border-[var(--border-color)] transition-colors group"
                        >
                            <div className={`w-10 h-10 ${plugin.iconColor} rounded flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm`}>
                                {plugin.initial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h3 className="font-bold text-sm text-[var(--fg-primary)] truncate pr-2">{plugin.name}</h3>
                                    {isInstalled && <span className="text-[10px] bg-[var(--bg-activity)] text-[var(--fg-secondary)] px-1.5 rounded border border-[var(--border-color)]">Installed</span>}
                                </div>
                                <p className="text-xs text-[var(--fg-secondary)] truncate mb-1.5">{plugin.description}</p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-[10px] text-[var(--fg-secondary)]">
                                        <span className="font-medium opacity-80">{plugin.author}</span>
                                        <span className="flex items-center gap-0.5"><Download size={10} /> {plugin.downloads}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => handleInstall(plugin.id, e)}
                                        className={`
                                            px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide transition-all
                                            ${isInstalled
                                                ? 'bg-[var(--bg-activity)] text-[var(--fg-secondary)] hover:bg-red-500/20 hover:text-red-400 border border-[var(--border-color)]' 
                                                : 'bg-[var(--accent)] text-white hover:brightness-110 shadow-sm'}
                                        `}
                                    >
                                        {isInstalled ? 'Uninstall' : 'Install'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default PluginsPane;
