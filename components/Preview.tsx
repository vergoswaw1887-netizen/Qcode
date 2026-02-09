
import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal as TerminalIcon, MoreVertical, Globe, ExternalLink, RefreshCw, Lock } from 'lucide-react';
import Terminal from './Terminal';
import { TerminalLog, FileSystemItem } from '../types';

interface PreviewProps {
  isOpen: boolean;
  srcDoc: string;
  onClose: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
  terminalProps: {
      logs: TerminalLog[];
      isOpen: boolean;
      onClose: () => void;
      onClear: () => void;
      onRun: () => void;
      fileSystem?: {
        files: FileSystemItem[];
        addFile: (parentId?: string, name?: string) => string | undefined;
        addFolder: (parentId?: string, name?: string) => string | undefined;
      };
  };
}

const Preview: React.FC<PreviewProps> = ({ isOpen, srcDoc, onClose, onToggleTerminal, isTerminalOpen, terminalProps }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [fakeUrl, setFakeUrl] = useState('http://localhost:3000/preview');

  // Generate a random "public" URL for the UI
  useEffect(() => {
    if (isOpen) {
      const randomId = Math.random().toString(36).substring(2, 8);
      setFakeUrl(`https://acode-deploy.app/v/${randomId}/live`);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenInBrowser = () => {
    // Create a Blob from the content and open it in a new tab
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setShowMenu(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fakeUrl);
    alert('Public URL copied to clipboard! (Simulation)');
    setShowMenu(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
      
      {/* Browser Address Bar / Header */}
      <div className="h-14 bg-slate-900 border-b border-slate-700 flex items-center px-2 gap-2 shrink-0 shadow-lg">
        {/* Window Controls */}
        <div className="flex items-center gap-1.5 px-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onClick={onClose}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 text-slate-400 px-2">
            <button className="hover:text-white"><RefreshCw size={16} /></button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 bg-slate-950 rounded-md h-9 flex items-center px-3 border border-slate-700 mx-2 overflow-hidden">
            <Lock size={12} className="text-green-500 mr-2 shrink-0" />
            <span className="text-slate-400 text-xs font-mono truncate select-all">{fakeUrl}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
             <button 
                onClick={onToggleTerminal}
                className={`p-2 rounded hover:bg-slate-800 transition-colors ${isTerminalOpen ? 'text-blue-400 bg-slate-800' : 'text-slate-400'}`}
                title="Toggle Console"
            >
                <TerminalIcon size={18} />
            </button>
            
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className={`p-2 rounded hover:bg-slate-800 text-slate-400 transition-colors ${showMenu ? 'bg-slate-800 text-white' : ''}`}
                >
                    <MoreVertical size={18} />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                        <div className="px-3 py-2 border-b border-slate-700 mb-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Share & Export</p>
                        </div>
                        <button onClick={handleOpenInBrowser} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-3">
                            <ExternalLink size={14} className="text-blue-400" /> Open in Real Browser
                        </button>
                        <button onClick={handleCopyUrl} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-3">
                            <Globe size={14} className="text-green-400" /> Copy Public URL
                        </button>
                        <div className="h-px bg-slate-700 my-1"></div>
                         <button onClick={onClose} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center gap-3">
                            <X size={14} /> Close Preview
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-1 bg-white relative">
        <iframe
          srcDoc={srcDoc}
          title="Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-popups allow-modals allow-forms allow-same-origin"
        />
      </div>

      {/* Integrated Terminal */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
          <Terminal {...terminalProps} />
      </div>
    </div>
  );
};

export default Preview;
