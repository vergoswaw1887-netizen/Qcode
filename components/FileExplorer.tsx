
import React, { useState, useEffect, useRef } from 'react';
import { FileSystemItem, FileType } from '../types';
import { 
  Folder, FolderOpen, File, FileCode, ChevronRight, 
  ChevronDown, FilePlus, FolderPlus, MoreVertical, 
  Trash2, Edit2, Image as ImageIcon, Code2, 
  Coffee, Terminal, FileJson, Boxes, Hexagon
} from 'lucide-react';

interface FileExplorerProps {
  files: FileSystemItem[];
  activeFileId: string | null;
  onFileClick: (fileId: string) => void;
  onFolderToggle: (folderId: string) => void;
  onAddFile: (parentId?: string) => void;
  onAddFolder: (parentId?: string) => void;
  onRename: (id: string, currentName: string, type: FileType) => void;
  onDelete: (id: string) => void;
  projectName?: string;
}

interface FileNodeProps {
  item: FileSystemItem;
  allFiles: FileSystemItem[];
  level: number;
  activeFileId: string | null;
  onFileClick: (fileId: string) => void;
  onFolderToggle: (folderId: string) => void;
  onAddFile: (parentId?: string) => void;
  onAddFolder: (parentId?: string) => void;
  onRename: (id: string, currentName: string, type: FileType) => void;
  onDelete: (id: string) => void;
}

const FileNode: React.FC<FileNodeProps> = ({ 
  item, allFiles, level, activeFileId, 
  onFileClick, onFolderToggle, onAddFile, onAddFolder, onRename, onDelete 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isFolder = item.type === FileType.FOLDER;
  const isActive = item.id === activeFileId;
  const paddingLeft = `${level * 16 + 12}px`;

  // Safely filter children
  const children = Array.isArray(allFiles) ? allFiles.filter(f => f.parentId === item.id) : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      onFolderToggle(item.id);
    } else {
      onFileClick(item.id);
    }
  };

  const getIcon = () => {
    if (isFolder) {
      return item.isOpen ? 
        <FolderOpen size={18} className="text-[var(--accent)] opacity-90" strokeWidth={1.5} /> : 
        <Folder size={18} className="text-[var(--accent)] opacity-70" strokeWidth={1.5} />;
    }
    
    const name = item.name.toLowerCase();
    
    // Web
    if (name.endsWith('.html')) return <Code2 size={18} className="text-orange-500" strokeWidth={1.5} />;
    if (name.endsWith('.css')) return <Code2 size={18} className="text-blue-300" strokeWidth={1.5} />;
    if (name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode size={18} className="text-yellow-400" strokeWidth={1.5} />;
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return <FileCode size={18} className="text-blue-500" strokeWidth={1.5} />;
    if (name.endsWith('.json')) return <FileJson size={18} className="text-yellow-200" strokeWidth={1.5} />;
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.svg')) return <ImageIcon size={18} className="text-purple-400" strokeWidth={1.5} />;
    
    // Backend / Systems
    if (name.endsWith('.py')) return <Terminal size={18} className="text-green-400" strokeWidth={1.5} />; // Python
    if (name.endsWith('.go')) return <Boxes size={18} className="text-cyan-400" strokeWidth={1.5} />; // Go
    if (name.endsWith('.rs')) return <Hexagon size={18} className="text-orange-600" strokeWidth={1.5} />; // Rust
    if (name.endsWith('.java') || name.endsWith('.jar')) return <Coffee size={18} className="text-red-500" strokeWidth={1.5} />; // Java
    if (name.endsWith('.cpp') || name.endsWith('.c') || name.endsWith('.h')) return <Code2 size={18} className="text-blue-600" strokeWidth={1.5} />; // C/C++
    if (name.endsWith('.php')) return <FileCode size={18} className="text-indigo-400" strokeWidth={1.5} />; // PHP
    if (name.endsWith('.dart')) return <FileCode size={18} className="text-teal-400" strokeWidth={1.5} />; // Dart/Flutter

    return <File size={18} className="text-[var(--fg-secondary)]" strokeWidth={1.5} />;
  };

  const containerClasses = `
    flex items-center gap-2.5 py-1.5 pr-2 cursor-pointer select-none transition-all duration-150 text-sm border-l-2 relative
    ${isActive 
      ? 'bg-[var(--selection)] text-[var(--fg-primary)] border-[var(--accent)] shadow-sm' 
      : 'border-transparent text-[var(--fg-secondary)] hover:bg-[var(--bg-root)] hover:text-[var(--fg-primary)] hover:border-[var(--border-color)]'}
  `;

  return (
    <div className="group">
      <div
        onClick={handleClick}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(true); }}
        className={containerClasses}
        style={{ paddingLeft }}
      >
        <div className="w-4 flex items-center justify-center shrink-0">
           {isFolder && (
             <span className="opacity-70">
               {item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
             </span>
           )}
        </div>
        
        {getIcon()}
        
        <span className={`truncate flex-1 ${isFolder ? 'font-medium text-[var(--fg-primary)]' : ''} ${isActive ? 'font-medium' : ''}`}>
          {item.name}
        </span>
        
        {/* Item Actions */}
        <div className={`flex items-center gap-1 transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className={`p-1 rounded ${showMenu ? 'text-[var(--fg-primary)] bg-[var(--bg-root)]' : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-root)]'}`}
            >
              <MoreVertical size={14} />
            </button>
        </div>
        
        {/* Context Menu */}
        {showMenu && (
            <div 
            ref={menuRef}
            className="absolute right-8 top-6 z-[999] bg-[var(--bg-panel)] border border-[var(--border-color)] rounded shadow-2xl py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-100 origin-top-right"
            onClick={(e) => e.stopPropagation()}
            >
                {isFolder && (
                <>
                    <button 
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onAddFile(item.id); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-root)] flex items-center gap-2 transition-colors"
                    >
                    <FilePlus size={14} /> New File
                    </button>
                    <button 
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onAddFolder(item.id); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-root)] flex items-center gap-2 transition-colors"
                    >
                    <FolderPlus size={14} /> New Folder
                    </button>
                    <div className="h-px bg-[var(--border-color)] my-1 mx-2 opacity-50" />
                </>
                )}
                <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onRename(item.id, item.name, item.type); }}
                className="w-full text-left px-3 py-1.5 text-xs text-[var(--fg-primary)] hover:bg-[var(--bg-root)] flex items-center gap-2 transition-colors"
                >
                <Edit2 size={14} /> Rename
                </button>
                <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowMenu(false); 
                    setTimeout(() => onDelete(item.id), 50);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-[var(--bg-root)] flex items-center gap-2 transition-colors"
                >
                <Trash2 size={14} /> Delete
                </button>
            </div>
        )}
      </div>

      {isFolder && item.isOpen && (
        <div className="ml-3 border-l border-[var(--border-color)]">
          {children.map(child => (
            <FileNode
              key={child.id}
              item={child}
              allFiles={allFiles}
              level={level + 1}
              activeFileId={activeFileId}
              onFileClick={onFileClick}
              onFolderToggle={onFolderToggle}
              onAddFile={onAddFile}
              onAddFolder={onAddFolder}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, activeFileId, onFileClick, onFolderToggle, 
  onAddFile, onAddFolder, onRename, onDelete,
  projectName = "TERMINAL HOME" 
}) => {
  // Guard against undefined files during initial mount
  if (!files || !Array.isArray(files)) return null;

  // Correctly filter for root items only (parentId is null).
  const rootFiles = files.filter(f => f.parentId === null);

  return (
    <div className="h-full flex flex-col bg-[var(--bg-sidebar)] select-none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-sidebar)] shrink-0">
        <div className="flex items-center gap-2">
           <Folder size={16} className="text-[var(--accent)]" />
           <span className="text-xs font-bold text-[var(--fg-primary)] uppercase tracking-widest truncate">{projectName}</span>
        </div>
        <div className="flex items-center gap-1">
           <button onClick={() => onAddFile()} className="p-1.5 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-root)] rounded transition-colors" title="New File (Root)">
             <FilePlus size={16} />
           </button>
           <button onClick={() => onAddFolder()} className="p-1.5 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-root)] rounded transition-colors" title="New Folder (Root)">
             <FolderPlus size={16} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 relative" onContextMenu={(e) => e.preventDefault()}>
        {rootFiles.length === 0 ? (
          <div className="px-6 py-10 text-center flex flex-col items-center">
             <div className="w-12 h-12 bg-[var(--bg-root)] rounded-full flex items-center justify-center mb-3">
                <FolderPlus size={24} className="text-[var(--fg-secondary)]" />
             </div>
            <p className="text-[var(--fg-secondary)] text-xs font-medium">Workspace is empty</p>
          </div>
        ) : (
          rootFiles.map(file => (
            <FileNode
              key={file.id}
              item={file}
              allFiles={files}
              level={0}
              activeFileId={activeFileId}
              onFileClick={onFileClick}
              onFolderToggle={onFolderToggle}
              onAddFile={onAddFile}
              onAddFolder={onAddFolder}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
