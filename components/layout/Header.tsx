
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Play, Sparkles, MoreVertical, FilePlus, FolderPlus, RotateCcw, Keyboard, Palette, Check } from 'lucide-react';
import { THEMES } from '../../constants';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
  onRun: () => void;
  onAddFile: () => void;
  onAddFolder: () => void;
  onResetWorkspace: () => void;
  showQuickKeys: boolean;
  onToggleQuickKeys: () => void;
  currentThemeId: string;
  onThemeChange: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, onToggleAiChat, isAiChatOpen, onRun, 
  onAddFile, onAddFolder, onResetWorkspace,
  showQuickKeys, onToggleQuickKeys,
  currentThemeId, onThemeChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsThemeSubmenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 md:h-12 bg-[var(--bg-sidebar)] border-b border-[var(--border-color)] flex items-center justify-between px-3 shrink-0 z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleSidebar(); }} 
          className="p-2 -ml-2 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] active:bg-[var(--bg-root)] rounded-lg transition-colors touch-manipulation"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
        <div className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 select-none">
          ACode
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button onClick={onRun} className="flex items-center gap-2 bg-green-600 active:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors touch-manipulation shadow-sm">
          <Play size={16} fill="currentColor" /><span className="hidden md:inline">Run</span>
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleAiChat(); }} 
          className={`p-2.5 rounded-lg transition-colors touch-manipulation ${isAiChatOpen ? 'text-[var(--accent)] bg-[var(--bg-panel)]' : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] active:bg-[var(--bg-root)]'}`}
          aria-label="AI Chat"
        >
          <Sparkles size={20} />
        </button>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => { setIsMenuOpen(!isMenuOpen); setIsThemeSubmenuOpen(false); }} 
            className={`p-2.5 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] active:bg-[var(--bg-root)] rounded-lg touch-manipulation ${isMenuOpen ? 'bg-[var(--bg-panel)]' : ''}`}
          >
            <MoreVertical size={20} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl shadow-2xl z-50 py-2 max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
              {!isThemeSubmenuOpen ? (
                  <>
                    <button onClick={() => { setIsMenuOpen(false); onAddFile(); }} className="w-full text-left px-4 py-3 text-sm text-[var(--fg-primary)] active:bg-[var(--bg-root)] flex items-center gap-3">
                        <FilePlus size={16} /> New File
                    </button>
                    <button onClick={() => { setIsMenuOpen(false); onAddFolder(); }} className="w-full text-left px-4 py-3 text-sm text-[var(--fg-primary)] active:bg-[var(--bg-root)] flex items-center gap-3">
                        <FolderPlus size={16} /> New Folder
                    </button>
                    <div className="h-px bg-[var(--border-color)] my-1"></div>
                    <button onClick={() => { onToggleQuickKeys(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-[var(--fg-primary)] active:bg-[var(--bg-root)] flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3"><Keyboard size={16} /> Quick Keys</div>
                        {showQuickKeys && <Check size={16} className="text-[var(--accent)]" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsThemeSubmenuOpen(true); }} className="w-full text-left px-4 py-3 text-sm text-[var(--fg-primary)] active:bg-[var(--bg-root)] flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3"><Palette size={16} /> Theme</div>
                        <span className="text-[10px] text-[var(--fg-secondary)] uppercase">{THEMES.find(t => t.id === currentThemeId)?.name}</span>
                    </button>
                    <div className="h-px bg-[var(--border-color)] my-1"></div>
                    <button onClick={() => { setIsMenuOpen(false); onResetWorkspace(); }} className="w-full text-left px-4 py-3 text-sm text-red-400 active:bg-[var(--bg-root)] flex items-center gap-3">
                        <RotateCcw size={16} /> Reset Workspace
                    </button>
                  </>
              ) : (
                  <>
                    <div className="px-4 py-3 text-xs font-bold text-[var(--fg-secondary)] uppercase flex items-center gap-2 cursor-pointer active:text-[var(--fg-primary)]" onClick={() => setIsThemeSubmenuOpen(false)}>
                        ← Back to Menu
                    </div>
                    <div className="h-px bg-[var(--border-color)] my-1"></div>
                    {THEMES.map(theme => (
                        <button 
                            key={theme.id}
                            onClick={() => { onThemeChange(theme.id); setIsMenuOpen(false); }} 
                            className="w-full text-left px-4 py-3 text-sm text-[var(--fg-primary)] active:bg-[var(--bg-root)] flex items-center gap-3 justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-[var(--border-color)]" style={{ background: theme.colors.bgRoot }}></div>
                                {theme.name}
                            </div>
                            {currentThemeId === theme.id && <Check size={16} className="text-[var(--accent)]" />}
                        </button>
                    ))}
                  </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
