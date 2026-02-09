
import React, { useState } from 'react';
import { X, Settings2, Package, MessageSquare, Bug, Play, ClipboardCheck, FileText, Zap } from 'lucide-react';
import { ChatMessage, GeneratedFile } from '../types';
import { sendMessageToGemini, explainCode, generateProjectStructure, enhancePrompt, analyzeCodeForErrors, reviewCode } from '../services/geminiService';
import AIChatMessageList from './AIChatMessageList';
import AIChatInput from './AIChatInput';
import AIChatContextActions from './AIChatContextActions';
import AIChatBuildProgress, { BuildStep } from './AIChatBuildProgress';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  activeFileContext?: { name: string; content: string };
  onFilesGenerated?: (files: GeneratedFile[]) => void;
}

type ChatTab = 'chat' | 'debugger' | 'review';

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, activeFileContext, onFilesGenerated }) => {
  const [activeTab, setActiveTab] = useState<ChatTab>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'I am your Polyglot AI Architect.\n\nI can build React apps, Python scripts, Go backends, C++ systems, and more.\n\nTry: "Create a UserProfileCard component" or "Write a Python script to scrape data".', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  // Debug & Review State
  const [debugOutput, setDebugOutput] = useState<string | null>(null);
  const [reviewOutput, setReviewOutput] = useState<string | null>(null);
  const [snippetInput, setSnippetInput] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectConfig, setShowProjectConfig] = useState(true);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');

  const handleEnhancePrompt = async () => {
      if (!inputValue.trim()) return;
      setIsLoading(true);
      try {
          const enhanced = await enhancePrompt(inputValue);
          setInputValue(enhanced);
          setMessages(prev => [...prev, { role: 'model', text: '✨ Prompt optimized for professional code generation.', timestamp: Date.now() }]);
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || isBuilding) return;
    const userText = inputValue;
    const userMsg: ChatMessage = { role: 'user', text: userText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const lowerText = userText.toLowerCase();
      
      // TRIGGER LOGIC: 
      // Captures creation, updates, fixes, and refactoring requests to trigger the File Generator.
      const isCodeGenerationRequest = 
         lowerText.includes('create') || lowerText.includes('build') || lowerText.includes('generate') || 
         lowerText.includes('update') || lowerText.includes('fix') || lowerText.includes('change') || 
         lowerText.includes('refactor') || lowerText.includes('write code') || lowerText.includes('add');

      if (isCodeGenerationRequest) {
         
         const prompt = projName ? `Project: ${projName}. Description: ${projDesc}. Task: ${userText}` : userText;
         
         // Use the "Universal Code Generator" function
         const result = await generateProjectStructure(prompt, activeFileContext);
         
         setIsLoading(false);
         setShowProjectConfig(false);

         const steps: BuildStep[] = result.files.map(f => ({ path: f.path, status: 'pending' }));
         setBuildSteps(steps);
         setIsBuilding(true);

         setMessages(prev => [...prev, { role: 'model', text: `**Action Plan:** ${result.description}\n\nExecuting file operations...`, timestamp: Date.now() }]);

         // Simulate streaming build for effect
         for (let i = 0; i < result.files.length; i++) {
             const file = result.files[i];
             setBuildSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
             await new Promise(r => setTimeout(r, 400)); // Visual delay
             
             // CRITICAL: This callback updates the FileSystem in App.tsx -> useFileSystem hook
             if (onFilesGenerated) {
                onFilesGenerated([file]); 
             }
             
             setBuildSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success' } : s));
         }
         setIsBuilding(false);
         setMessages(prev => [...prev, { role: 'model', text: `✅ **Operation Successful!** Files have been created/updated in your workspace.`, timestamp: Date.now() }]);
      } else {
        // Standard conversational fallback
        const responseText = await sendMessageToGemini(userText, activeFileContext);
        setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
        setIsLoading(false);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${(error as Error).message}`, timestamp: Date.now() }]);
      setIsLoading(false);
      setIsBuilding(false);
    }
  };

  const handleRunDiagnostics = async () => {
    if (!activeFileContext) return;
    setIsLoading(true);
    setDebugOutput(null);
    try {
        const result = await analyzeCodeForErrors(activeFileContext.content);
        setDebugOutput(result);
    } catch (e) { setDebugOutput("Failed to run diagnostics."); } finally { setIsLoading(false); }
  };

  const handleRunReview = async (useSnippet: boolean) => {
    setIsLoading(true);
    setReviewOutput(null);
    try {
        const code = useSnippet ? snippetInput : activeFileContext?.content;
        const name = useSnippet ? "Snippet" : activeFileContext?.name;
        if (!code) return;
        
        const result = await reviewCode(code, name);
        setReviewOutput(result);
    } catch (e) { setReviewOutput("Failed to complete code review."); } finally { setIsLoading(false); }
  };

  const handleExplain = async () => {
    setActiveTab('chat');
    if (!activeFileContext || isLoading) return;
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: `Explain ${activeFileContext.name}`, timestamp: Date.now() }]);
    try {
      const explanation = await explainCode(activeFileContext.content);
      setMessages(prev => [...prev, { role: 'model', text: explanation, timestamp: Date.now() }]);
    } catch (e) { setMessages(prev => [...prev, { role: 'model', text: "Failed to explain code.", timestamp: Date.now() }]); } finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="flex flex-col h-full bg-[var(--bg-sidebar)] border-l border-[var(--border-color)] w-80 md:w-96 shadow-2xl relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]">
        <div className="flex gap-1 p-1 bg-[var(--bg-root)] rounded-lg overflow-x-auto scrollbar-hide w-full max-w-[240px]">
            <button onClick={() => setActiveTab('chat')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors shrink-0 ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow' : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'}`}>
                <MessageSquare size={14} /> AI Architect
            </button>
            <button onClick={() => setActiveTab('debugger')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors shrink-0 ${activeTab === 'debugger' ? 'bg-red-600 text-white shadow' : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'}`}>
                <Bug size={14} /> Debug
            </button>
            <button onClick={() => setActiveTab('review')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors shrink-0 ${activeTab === 'review' ? 'bg-purple-600 text-white shadow' : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'}`}>
                <ClipboardCheck size={14} /> Review
            </button>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {activeTab === 'chat' && (
            <button onClick={() => setShowProjectConfig(!showProjectConfig)} className={`p-1.5 rounded transition-colors ${showProjectConfig ? 'bg-[var(--bg-panel)] text-[var(--accent)]' : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]'}`}>
                <Settings2 size={16} />
            </button>
          )}
          <button onClick={onClose} className="text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-colors p-1">
            <X size={18} />
          </button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <>
            {showProjectConfig && (
                <div className="bg-[var(--bg-panel)] backdrop-blur-md p-4 border-b border-[var(--border-color)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--fg-secondary)] uppercase mb-1">
                    <Zap size={14} className="text-yellow-400" /> Multi-Language Generator
                </div>
                <input 
                    type="text" placeholder="Project Name (Optional)" value={projName} onChange={(e) => setProjName(e.target.value)}
                    className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded px-3 py-2 text-sm text-[var(--fg-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <textarea 
                    placeholder="Context: React, Python, Go, Unity, etc..." value={projDesc} onChange={(e) => setProjDesc(e.target.value)}
                    className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded px-3 py-2 text-sm text-[var(--fg-primary)] focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none"
                />
                </div>
            )}
            <AIChatMessageList messages={messages} isLoading={isLoading} />
            <AIChatBuildProgress steps={buildSteps} isVisible={isBuilding || buildSteps.length > 0} />
            {activeFileContext && (
                <AIChatContextActions 
                fileName={activeFileContext.name} onExplain={handleExplain} onRefactor={() => setInputValue(`Refactor ${activeFileContext.name} to improve performance and code style.`)} isLoading={isLoading} 
                />
            )}
            <AIChatInput 
                value={inputValue} onChange={setInputValue} onSend={handleSend} onEnhance={handleEnhancePrompt} isLoading={isLoading || isBuilding} 
            />
        </>
      )}

      {activeTab === 'debugger' && (
          <div className="flex-1 flex flex-col bg-[var(--bg-sidebar)] overflow-hidden">
             {!activeFileContext ? (
                 <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[var(--fg-secondary)]">
                     <Bug size={32} className="mb-2 opacity-50" />
                     <p className="text-sm">Open a file to run diagnostics.</p>
                 </div>
             ) : (
                 <div className="flex flex-col h-full">
                     <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-panel)]">
                         <h3 className="font-semibold text-[var(--fg-primary)] mb-1">{activeFileContext.name}</h3>
                         <p className="text-xs text-[var(--fg-secondary)] mb-3">AI Static Analysis & Error Detection</p>
                         <button onClick={handleRunDiagnostics} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg">
                            {isLoading ? <span className="animate-spin">⟳</span> : <Play size={14} fill="currentColor" />} Run Deep Scan
                         </button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-4">
                         {debugOutput ? (
                             <div className="prose prose-invert prose-sm max-w-none">
                                 <pre className="whitespace-pre-wrap bg-[var(--bg-root)] p-3 rounded-lg border border-[var(--border-color)] text-[var(--fg-primary)] font-mono text-xs">
                                     {debugOutput}
                                 </pre>
                             </div>
                         ) : (
                            <div className="text-center mt-10 text-[var(--fg-secondary)] text-xs italic">
                                {isLoading ? "Scanning code..." : "No scan results yet."}
                            </div>
                         )}
                     </div>
                 </div>
             )}
          </div>
      )}

      {activeTab === 'review' && (
          <div className="flex-1 flex flex-col bg-[var(--bg-sidebar)] overflow-hidden">
             <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-panel)] flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                     <h3 className="font-semibold text-[var(--fg-primary)]">Code Review</h3>
                     <span className="text-[10px] text-[var(--fg-secondary)] uppercase font-bold tracking-wider">AI Powered</span>
                 </div>
                 
                 {/* Option 1: Review Active File */}
                 {activeFileContext && (
                    <button 
                        onClick={() => handleRunReview(false)} 
                        disabled={isLoading} 
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                        {isLoading ? <span className="animate-spin">⟳</span> : <FileText size={14} />} Review Active File ({activeFileContext.name})
                    </button>
                 )}

                 {/* Option 2: Snippet */}
                 <div className="relative">
                    <textarea 
                        value={snippetInput}
                        onChange={(e) => setSnippetInput(e.target.value)}
                        placeholder="Or paste a code snippet here to review..."
                        className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded-lg p-3 text-xs font-mono text-[var(--fg-primary)] focus:outline-none focus:ring-1 focus:ring-purple-500 h-24 resize-none"
                    />
                    {snippetInput.trim() && (
                        <button 
                            onClick={() => handleRunReview(true)}
                            disabled={isLoading}
                            className="absolute bottom-2 right-2 bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white p-1.5 rounded-md transition-all"
                        >
                            <Play size={12} fill="currentColor" />
                        </button>
                    )}
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4">
                 {reviewOutput ? (
                     <div className="prose prose-invert prose-sm max-w-none">
                         <div className="whitespace-pre-wrap bg-[var(--bg-root)] p-3 rounded-lg border border-[var(--border-color)] text-[var(--fg-primary)] text-sm">
                             {reviewOutput}
                         </div>
                     </div>
                 ) : (
                    <div className="text-center mt-10 text-[var(--fg-secondary)] text-xs italic px-6">
                        {isLoading ? "Analyzing code structure, logic, and security..." : "Select the active file or paste a snippet to generate a professional code review."}
                    </div>
                 )}
             </div>
          </div>
      )}
    </div>
  );
};

export default AIChat;
