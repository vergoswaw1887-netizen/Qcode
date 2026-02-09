
import React from 'react';
import { CheckCircle2, Loader2, FileCode, Folder, Circle, Clock } from 'lucide-react';

export interface BuildStep {
  path: string;
  status: 'pending' | 'running' | 'success';
}

interface AIChatBuildProgressProps {
  steps: BuildStep[];
  isVisible: boolean;
}

const AIChatBuildProgress: React.FC<AIChatBuildProgressProps> = ({ steps, isVisible }) => {
  if (!isVisible || steps.length === 0) return null;

  const successCount = steps.filter(s => s.status === 'success').length;
  const progressPercent = Math.round((successCount / steps.length) * 100);

  return (
    <div className="mx-4 mb-4 bg-[var(--bg-root)] border border-[var(--border-color)] rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-md">
      <div className="bg-[var(--bg-activity)] px-3 py-2 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Loader2 size={14} className={`text-[var(--accent)] ${progressPercent < 100 ? 'animate-spin' : ''}`} />
            <span className="text-xs font-bold text-[var(--fg-primary)] uppercase tracking-wider">Scaffolding Project</span>
        </div>
        <span className="text-[10px] text-[var(--fg-secondary)] font-mono">{progressPercent}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 w-full bg-[var(--bg-root)]">
          <div 
            className="h-full bg-[var(--accent)] transition-all duration-300 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
      </div>

      <div className="max-h-48 overflow-y-auto p-2 space-y-1">
        {steps.map((step, idx) => {
            const isFolder = !step.path.includes('.'); // Simple heuristic
            
            return (
              <div key={idx} className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[var(--bg-panel)] transition-colors group">
                <div className="w-4 flex items-center justify-center shrink-0">
                  {step.status === 'running' && <Loader2 size={14} className="text-[var(--accent)] animate-spin" />}
                  {step.status === 'success' && <CheckCircle2 size={14} className="text-green-500" />}
                  {step.status === 'pending' && <Clock size={14} className="text-[var(--fg-secondary)]" />}
                </div>
                
                <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className={`${step.status === 'pending' ? 'text-[var(--fg-secondary)]' : 'text-[var(--fg-primary)]'}`}>
                        {isFolder ? <Folder size={14} fill="currentColor" className="opacity-50" /> : <FileCode size={14} />}
                    </span>
                    <span className={`text-xs truncate font-mono ${
                        step.status === 'success' ? 'text-[var(--fg-primary)]' : 
                        step.status === 'running' ? 'text-[var(--accent)] font-bold' : 
                        'text-[var(--fg-secondary)]'
                    }`}>
                    {step.path}
                    </span>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default AIChatBuildProgress;
