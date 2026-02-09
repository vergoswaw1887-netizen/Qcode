import React from 'react';
import { BookOpen, Layers } from 'lucide-react';

interface AIChatContextActionsProps {
  fileName: string;
  onExplain: () => void;
  onRefactor: () => void;
  isLoading: boolean;
}

const AIChatContextActions: React.FC<AIChatContextActionsProps> = ({ fileName, onExplain, onRefactor, isLoading }) => {
  return (
    <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-800 flex gap-2 overflow-x-auto scrollbar-hide">
       <button 
         onClick={onExplain}
         disabled={isLoading}
         className="flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1.5 rounded transition-colors whitespace-nowrap"
       >
         <BookOpen size={12} />
         Explain {fileName}
       </button>
       <button 
         onClick={onRefactor}
         disabled={isLoading}
         className="flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1.5 rounded transition-colors whitespace-nowrap"
       >
         <Layers size={12} />
         Refactor
       </button>
    </div>
  );
};

export default AIChatContextActions;