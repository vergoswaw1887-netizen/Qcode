
import React from 'react';
import { Send, Sparkles } from 'lucide-react';

interface AIChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onEnhance?: () => void;
  isLoading: boolean;
}

const AIChatInput: React.FC<AIChatInputProps> = ({ value, onChange, onSend, onEnhance, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 bg-slate-800 border-t border-slate-700">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Build a React app, Explain code..."
          className="w-full bg-slate-900 text-slate-200 text-sm rounded-lg pl-3 pr-20 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-14"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {onEnhance && value.trim().length > 3 && (
                <button
                    onClick={onEnhance}
                    disabled={isLoading}
                    title="Enhance Prompt with AI"
                    className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-full transition-colors"
                >
                    <Sparkles size={16} />
                </button>
            )}
            
            <button
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            className="p-1.5 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInput;
