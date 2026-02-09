
import React from 'react';
import ActivityBar, { ActivityTab } from './ActivityBar';
import FileExplorer from '../FileExplorer';
import SearchPane from '../panes/SearchPane';
import PluginsPane from '../panes/PluginsPane';
import AccountPane from '../panes/AccountPane';
import FavoritesPane from '../panes/FavoritesPane';
import NotificationsPane from '../panes/NotificationsPane';
import SettingsPane from '../panes/SettingsPane';
import { FileSystemItem, FileType, AppSettings } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  activeTab: ActivityTab;
  fileSystem: {
    files: FileSystemItem[];
    activeFileId: string | null;
    setActiveFileId: (id: string) => void;
    toggleFolder: (id: string) => void;
    addFile: (parentId: string | null, name: string) => string | null;
    addFolder: (parentId: string | null, name: string) => string | null;
    renameItem: (id: string, currentName: string, type: FileType) => void;
    deleteItem: (id: string) => void;
  };
  onAddFile: (parentId?: string) => void;
  onAddFolder: (parentId?: string) => void;
  onOpenCommitModal: () => void;
  onTabChange: (tab: ActivityTab) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  notificationCount: number;
  gitStatus: 'clean' | 'modified';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, activeTab, fileSystem, onAddFile, onAddFolder, onOpenCommitModal, onTabChange,
  settings, setSettings, notificationCount, gitStatus
}) => {
  
  // Wrapper to auto-close sidebar on mobile when a file is selected
  const handleFileClick = (id: string) => {
    fileSystem.setActiveFileId(id);
    // Determine if mobile (simple check)
    if (window.innerWidth < 768) {
       // We can't close it directly here without prop drilling 'setIsOpen', 
       // but typically users tap the file then close manually or we depend on parent.
       // For now, let's leave it manual or add a specific prop if strictly needed.
    }
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
      className={`
        fixed inset-y-0 left-0 z-40 flex flex-row h-full bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] shadow-2xl transition-transform duration-300 ease-in-out
        w-[85vw] md:w-80 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Activity Bar (Icons) */}
      <ActivityBar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        notificationCount={notificationCount}
        gitStatus={gitStatus}
      />

      {/* Pane Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-sidebar)] h-full overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col min-w-0 relative">
          {activeTab === 'explorer' && (
            <FileExplorer 
              files={fileSystem.files} 
              activeFileId={fileSystem.activeFileId} 
              onFileClick={handleFileClick} 
              onFolderToggle={fileSystem.toggleFolder} 
              onAddFile={onAddFile} 
              onAddFolder={onAddFolder} 
              onRename={fileSystem.renameItem}
              onDelete={fileSystem.deleteItem}
            />
          )}
          {activeTab === 'search' && <SearchPane />}
          {activeTab === 'plugins' && <PluginsPane />}
          {activeTab === 'favorites' && <FavoritesPane />}
          {activeTab === 'account' && <AccountPane />}
          {activeTab === 'notifications' && <NotificationsPane />}
          {activeTab === 'settings' && <SettingsPane settings={settings} setSettings={setSettings} />}
        </div>

        {activeTab === 'explorer' && (
          <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-sidebar)] shrink-0 safe-area-pb">
             <button onClick={onOpenCommitModal} className="w-full py-3 bg-blue-600/20 active:bg-blue-600/40 text-blue-400 text-xs font-bold uppercase rounded border border-blue-600/30 transition-colors touch-manipulation">
               Git Commit
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
