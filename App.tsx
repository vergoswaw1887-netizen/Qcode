
import React, { useState, useCallback, useEffect } from 'react';
import { AppSettings, GeneratedFile, FileType } from './types';
import CodeEditor from './components/CodeEditor';
import AIChat from './components/AIChat';
import Preview from './components/Preview';
import { Files, X } from 'lucide-react';
import { initializeChat } from './services/geminiService';
import { useFileSystem } from './hooks/useFileSystem';
import { useTerminal } from './hooks/useTerminal';
import { THEMES } from './constants';

// Modular Components
import Header from './components/layout/Header';
import { ActivityTab } from './components/layout/ActivityBar';
import Sidebar from './components/layout/Sidebar';
import CommitModal from './components/modals/CommitModal';
import InputModal from './components/modals/InputModal';

const App: React.FC = () => {
  const fileSystem = useFileSystem();
  const terminal = useTerminal();

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<ActivityTab>('explorer');
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(2); 
  
  // Settings with Theme ID and QuickKeys
  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 14,
    wordWrap: 'on',
    themeId: 'acode-dark',
    tabSize: 2,
    language: 'en',
    showQuickKeys: true
  });

  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'file' | 'folder' | 'rename';
    parentId: string | null;
    targetId?: string;
    initialValue?: string;
  }>({
    isOpen: false,
    mode: 'file',
    parentId: null
  });

  // Derived state for current theme object
  const currentTheme = THEMES.find(t => t.id === settings.themeId) || THEMES[0];
  
  // Calculate Git Status - with safe array check
  const hasUncommittedChanges = Array.isArray(fileSystem.files) && fileSystem.files.some(f => f.isModified);
  const gitStatus = hasUncommittedChanges ? 'modified' : 'clean';

  useEffect(() => {
    initializeChat();
  }, []);

  // Close sidebar automatically on mobile when file is active
  useEffect(() => {
     if (fileSystem.activeFile && window.innerWidth < 768) {
         setIsSidebarOpen(false);
     }
  }, [fileSystem.activeFile]);

  const resolveParentId = (parentId?: string): string => {
      if (parentId) return parentId;
      if (fileSystem.activeFile) {
          return fileSystem.activeFile.type === FileType.FOLDER 
            ? fileSystem.activeFile.id 
            : (fileSystem.activeFile.parentId || 'root');
      }
      return 'root';
  };

  const openCreateFileModal = (parentId?: string) => {
    setModalState({ isOpen: true, mode: 'file', parentId: resolveParentId(parentId) });
  };

  const openCreateFolderModal = (parentId?: string) => {
    setModalState({ isOpen: true, mode: 'folder', parentId: resolveParentId(parentId) });
  };

  const handleRenameRequest = (id: string, currentName: string, type: FileType) => {
      setModalState({ isOpen: true, mode: 'rename', parentId: null, targetId: id, initialValue: currentName });
  };

  const handleModalSubmit = (value: string) => {
    if (modalState.mode === 'file') {
        const result = fileSystem.addFile(modalState.parentId, value);
        if (result) terminal.addLog(`Created file: ${value}`, 'success');
        else terminal.addLog(`Failed to create file "${value}". Check duplicates.`, 'error');
    } else if (modalState.mode === 'folder') {
        const result = fileSystem.addFolder(modalState.parentId, value);
        if (result) terminal.addLog(`Created folder: ${value}`, 'success');
        else terminal.addLog(`Failed to create folder "${value}". Check duplicates.`, 'error');
    } else if (modalState.mode === 'rename' && modalState.targetId) {
        const success = fileSystem.renameItem(modalState.targetId, value);
        if (success) terminal.addLog(`Renamed to: ${value}`, 'success');
        else terminal.addLog(`Failed to rename to "${value}".`, 'error');
    }
  };

  const handleResetWorkspace = () => {
    fileSystem.resetWorkspace();
    terminal.addLog('Workspace reset.', 'info');
  };

  const handleFilesGenerated = (generatedFiles: GeneratedFile[]) => {
    terminal.addLog('AI updating workspace...', 'info');
    fileSystem.mergeGeneratedFiles(generatedFiles);
    terminal.addLog('AI build complete.', 'success');
  };

  const runCode = useCallback(() => {
    terminal.addLog('Building project...', 'info');
    if (!Array.isArray(fileSystem.files)) return;

    const htmlFile = fileSystem.files.find(f => f.name.endsWith('.html'));
    const cssFiles = fileSystem.files.filter(f => f.name.endsWith('.css'));
    const jsFiles = fileSystem.files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.ts'));
    let finalHtml = htmlFile?.content || `<!DOCTYPE html><html><head><title>Preview</title></head><body><div id="root"></div></body></html>`;
    const cssStyles = cssFiles.map(f => `<style>${f.content}</style>`).join('\n');
    const jsScripts = jsFiles.map(f => `<script>${f.content}</script>`).join('\n');
    finalHtml = finalHtml.replace('</head>', `${cssStyles}</head>`).replace('</body>', `${jsScripts}</body>`);
    setPreviewContent(finalHtml);
    terminal.addLog('Build successful. Launching preview.', 'success');
    setIsPreviewOpen(true);
  }, [fileSystem.files, terminal]);

  const handleCommit = () => {
    fileSystem.setAllFilesUnmodified();
    setIsCommitModalOpen(false);
    terminal.addLog(`Committed: "${commitMessage}"`, 'success');
    setCommitMessage('');
  };

  // Toggle handlers for Header Menu
  const toggleQuickKeys = () => setSettings(prev => ({ ...prev, showQuickKeys: !prev.showQuickKeys }));
  const changeTheme = (themeId: string) => setSettings(prev => ({ ...prev, themeId }));
  
  const handleSidebarTabChange = (tab: ActivityTab) => {
    if (activeSidebarTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveSidebarTab(tab);
      setIsSidebarOpen(true);
      if (tab === 'notifications') {
        setUnreadNotificationCount(0);
      }
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg-root: ${currentTheme.colors.bgRoot};
          --bg-sidebar: ${currentTheme.colors.bgSidebar};
          --bg-activity: ${currentTheme.colors.bgActivity};
          --bg-panel: ${currentTheme.colors.bgPanel};
          --fg-primary: ${currentTheme.colors.fgPrimary};
          --fg-secondary: ${currentTheme.colors.fgSecondary};
          --border-color: ${currentTheme.colors.border};
          --accent: ${currentTheme.colors.accent};
          --selection: ${currentTheme.colors.selection};
        }
        body { background-color: var(--bg-root); color: var(--fg-primary); }
      `}</style>

      {/* Main Container - uses 100dvh for mobile browsers */}
      <div className="flex flex-col h-screen h-[100dvh] bg-[var(--bg-root)] text-[var(--fg-primary)] font-sans overflow-hidden transition-colors duration-300">
        
        <Header 
          onToggleSidebar={() => { setIsSidebarOpen(!isSidebarOpen); setIsAiChatOpen(false); }}
          onToggleAiChat={() => { setIsAiChatOpen(!isAiChatOpen); setIsSidebarOpen(false); }}
          isAiChatOpen={isAiChatOpen}
          onRun={runCode}
          onAddFile={() => openCreateFileModal()}
          onAddFolder={() => openCreateFolderModal()}
          onResetWorkspace={handleResetWorkspace}
          showQuickKeys={settings.showQuickKeys}
          onToggleQuickKeys={toggleQuickKeys}
          currentThemeId={settings.themeId}
          onThemeChange={changeTheme}
        />

        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Overlay for Mobile Sidebar/Chat */}
          {(isSidebarOpen || isAiChatOpen) && (
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity animate-in fade-in duration-200" 
              onClick={() => { setIsSidebarOpen(false); setIsAiChatOpen(false); }} 
            />
          )}

          <Sidebar 
            isOpen={isSidebarOpen}
            activeTab={activeSidebarTab}
            fileSystem={{
                ...fileSystem,
                renameItem: handleRenameRequest,
                deleteItem: (id) => { fileSystem.deleteItem(id); terminal.addLog('Item deleted.', 'info'); }
            }}
            onAddFile={openCreateFileModal}
            onAddFolder={openCreateFolderModal}
            onOpenCommitModal={() => setIsCommitModalOpen(true)}
            onTabChange={handleSidebarTabChange}
            settings={settings}
            setSettings={setSettings}
            notificationCount={unreadNotificationCount}
            gitStatus={gitStatus}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-root)] relative z-20">
            {/* Tab Bar */}
            <div className="flex bg-[var(--bg-sidebar)] border-b border-[var(--border-color)] overflow-x-auto shrink-0 h-10 no-scrollbar">
              {fileSystem.activeFile && (
                  <div className="flex items-center justify-between gap-2 px-4 bg-[var(--bg-root)] border-r border-[var(--border-color)] border-t-2 border-t-[var(--accent)] min-w-fit h-full">
                      <span className="text-xs font-medium text-[var(--fg-primary)] max-w-[150px] truncate">{fileSystem.activeFile.name}</span>
                      <button onClick={() => fileSystem.setActiveFileId(null)} className="text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] p-1 rounded"><X size={14} /></button>
                  </div>
              )}
            </div>
            
            {/* Editor Area */}
            <div className="flex-1 relative">
              {fileSystem.activeFile ? (
                  <CodeEditor 
                    code={fileSystem.activeFile.content || ''} 
                    language={fileSystem.activeFile.language || 'text'} 
                    onChange={fileSystem.updateFileContent} 
                    currentTheme={currentTheme}
                    showQuickKeys={settings.showQuickKeys}
                  />
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--fg-secondary)] space-y-4 p-6 text-center">
                      <div className="w-20 h-20 bg-[var(--bg-panel)] rounded-2xl flex items-center justify-center shadow-lg">
                          <Files size={40} className="opacity-50 text-[var(--accent)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[var(--fg-primary)] mb-1">No File Open</h3>
                        <p className="text-sm opacity-70">Tap the menu to create a file or ask AI to generate a project.</p>
                      </div>
                  </div>
              )}
            </div>
          </div>

          {/* AI Chat - Mobile Friendly Slide Over */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className={`
              absolute right-0 top-0 bottom-0 z-40 bg-[var(--bg-sidebar)] border-l border-[var(--border-color)] shadow-2xl transition-transform duration-300 ease-in-out
              w-[90vw] md:w-96
              ${isAiChatOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            <AIChat 
              isOpen={isAiChatOpen} 
              onClose={() => setIsAiChatOpen(false)} 
              activeFileContext={fileSystem.activeFile ? { name: fileSystem.activeFile.name, content: fileSystem.activeFile.content || '' } : undefined} 
              onFilesGenerated={handleFilesGenerated} 
            />
          </div>
        </div>

        <Preview 
          isOpen={isPreviewOpen} 
          srcDoc={previewContent} 
          onClose={() => setIsPreviewOpen(false)} 
          onToggleTerminal={terminal.toggleTerminal} 
          isTerminalOpen={terminal.isOpen}
          terminalProps={{
              logs: terminal.logs,
              isOpen: terminal.isOpen,
              onClose: terminal.closeTerminal,
              onClear: Object.assign(terminal.clearLogs, { addLog: terminal.addLog }),
              onRun: runCode,
              fileSystem: fileSystem
          }}
        />

        <CommitModal 
          isOpen={isCommitModalOpen} 
          onClose={() => setIsCommitModalOpen(false)} 
          onCommit={handleCommit} 
          message={commitMessage} 
          onMessageChange={setCommitMessage} 
        />

        <InputModal 
          isOpen={modalState.isOpen}
          onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
          onSubmit={handleModalSubmit}
          type={modalState.mode}
          defaultValue={modalState.initialValue}
        />
      </div>
    </>
  );
};

export default App;
