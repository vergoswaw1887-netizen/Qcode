
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Play, Trash2 } from 'lucide-react';
import { TerminalLog, FileSystemItem, FileType } from '../types';

interface TerminalProps {
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
}

const Terminal: React.FC<TerminalProps> = ({ logs, isOpen, onClose, onClear, onRun, fileSystem }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  // Helper: Resolve a path "src/components" to the ID of the "components" folder
  // If createIfMissing is true, it creates intermediate folders.
  const resolvePathToId = (path: string, createIfMissing: boolean = false): string | null => {
      if (!fileSystem) return null;
      if (!path || path === '.' || path === './') return 'root';

      const parts = path.replace(/^\.\//, '').split('/').filter(p => p.length > 0);
      let currentParentId = 'root';

      for (let i = 0; i < parts.length; i++) {
          const partName = parts[i];
          const existing = fileSystem.files.find(f => 
              f.parentId === currentParentId && 
              f.name === partName && 
              f.type === FileType.FOLDER
          );

          if (existing) {
              currentParentId = existing.id;
          } else {
              if (createIfMissing) {
                  const newName = fileSystem.addFolder(currentParentId, partName);
                  // Since addFolder returns name or null, we need to find the ID of the newly created folder
                  if (!newName) return null; // Failed to create
                  const newFolder = fileSystem.files.find(f => f.parentId === currentParentId && f.name === partName);
                  if (newFolder) {
                      currentParentId = newFolder.id;
                  } else {
                      return null; // Should not happen
                  }
              } else {
                  return null; // Path doesn't exist
              }
          }
      }
      return currentParentId;
  };

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    const param = args[1]; // Path or Name

    if (!fileSystem) return;

    switch (command) {
      case 'help': return 'Available commands: ls, mkdir <path>, touch <path>, clear, help';
      case 'clear': onClear(); return null;
      
      case 'ls':
        // Basic ls, lists root. Enhancing to list current dir is complex without 'cd' state, so defaulting to root.
        const rootFiles = fileSystem.files.filter(f => f.parentId === 'root');
        if (rootFiles.length === 0) return '(empty directory)';
        return rootFiles.map(f => f.type === FileType.FOLDER ? `${f.name}/` : f.name).join('  ');
      
      case 'mkdir': {
        if (!param) return 'usage: mkdir <path/folder_name>';
        // Logic: mkdir src/components -> creates src if missing, then components
        const parts = param.split('/');
        const folderName = parts.pop(); // The final folder to create
        const pathPrefix = parts.join('/'); // The path leading to it
        
        let targetParentId = 'root';
        if (pathPrefix) {
            const resolvedId = resolvePathToId(pathPrefix, true); // Create intermediate folders
            if (!resolvedId) return `Error: Could not resolve path '${pathPrefix}'`;
            targetParentId = resolvedId;
        }

        if (!folderName) return 'Error: Invalid folder name';

        // Check duplicate manually before calling addFolder to give better error message
        const duplicate = fileSystem.files.find(f => f.parentId === targetParentId && f.name === folderName);
        if (duplicate) return `Error: '${folderName}' already exists at this path.`;

        const result = fileSystem.addFolder(targetParentId, folderName);
        if (result) return `Created directory: ${param}`;
        return `Failed to create directory: ${param}`;
      }

      case 'touch': {
        if (!param) return 'usage: touch <path/file_name>';
        const parts = param.split('/');
        const fileName = parts.pop();
        const pathPrefix = parts.join('/');

        let targetParentId = 'root';
        if (pathPrefix) {
            // For touch, we DO NOT create intermediate folders usually, but for user ease let's say no.
            // Parent folder must exist.
            const resolvedId = resolvePathToId(pathPrefix, false);
            if (!resolvedId) return `Error: Path '${pathPrefix}' does not exist.`;
            targetParentId = resolvedId;
        }

        if (!fileName) return 'Error: Invalid file name';

        const duplicate = fileSystem.files.find(f => f.parentId === targetParentId && f.name === fileName);
        if (duplicate) return `Error: File '${fileName}' already exists.`;

        const result = fileSystem.addFile(targetParentId, fileName);
        if (result) return `Created file: ${param}`;
        return `Failed to create file: ${param}`;
      }

      default: return `command not found: ${command}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      if (!cmd) return;
      if (cmd === 'clear') onClear();
      else {
         const output = handleCommand(cmd);
         if (output) {
             const extendedClear = onClear as any;
             if (extendedClear && typeof extendedClear.addLog === 'function') extendedClear.addLog(output, 'info');
             else console.log(output);
         }
      }
      setInput('');
    }
  };
  
  return (
    <div className={`
      bg-[var(--bg-root)] border-t border-[var(--border-color)] flex flex-col transition-all duration-300 ease-in-out
      ${isOpen ? 'h-64' : 'h-0 overflow-hidden'}
    `}>
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-sidebar)] border-b border-[var(--border-color)] shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-[var(--fg-secondary)]" />
          <span className="text-xs font-bold text-[var(--fg-primary)] uppercase tracking-wider">Terminal</span>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={onRun} className="flex items-center gap-1.5 px-2 py-1 hover:bg-[var(--bg-root)] rounded text-green-400 transition-colors text-xs font-medium uppercase border border-transparent hover:border-[var(--border-color)]" title="Run Code">
            <Play size={10} /> Build & Run
          </button>
          <div className="w-px h-4 bg-[var(--border-color)] mx-1"></div>
          <button onClick={onClear} className="p-1 hover:bg-[var(--bg-root)] rounded text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-colors" title="Clear Console">
            <Trash2 size={14} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-[var(--bg-root)] rounded text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-colors" title="Close Terminal">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm" ref={scrollRef}>
        <div className="space-y-1 mb-2">
            {logs.length === 0 && <div className="text-[var(--fg-secondary)] italic text-xs mb-4">Type 'help' for commands. Try 'mkdir src/components' or 'touch README.md'</div>}
            {logs.map((log, idx) => (
            <div key={idx} className={`
                flex gap-2 break-all
                ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-[var(--fg-primary)]'}
            `}>
                <span className="text-[var(--fg-secondary)] select-none text-[10px] pt-1">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                <span>{log.type === 'error' ? 'Error:' : '>'} {log.message}</span>
            </div>
            ))}
        </div>

        <div className="flex items-center gap-2 text-[var(--fg-primary)] pt-1 border-t border-[var(--border-color)] mt-2">
            <span className="text-green-400 font-bold text-xs select-none">user@acode:~$</span>
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-[var(--fg-primary)] placeholder-[var(--fg-secondary)]"
                autoFocus
                spellCheck={false}
                autoComplete="off"
            />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
