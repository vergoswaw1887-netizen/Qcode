
import React, { useRef } from 'react';
import { QUICK_KEYS } from '../constants';
import { ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';

interface QuickKeysProps {
  onKeyPress: (value: string, type: 'char' | 'cmd') => void;
  isVisible: boolean;
}

const QuickKeys: React.FC<QuickKeysProps> = ({ onKeyPress, isVisible }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  // Directly return null if not visible. React handles the unmounting/mounting.
  // This avoids CSS transition issues where an element might be present but hidden/collapsed permanently.
  if (!isVisible) return null;

  return (
    <div 
      className="shrink-0 h-12 bg-[var(--bg-panel)] border-t border-[var(--border-color)] flex flex-col shadow-[0_-2px_10px_rgba(0,0,0,0.2)] z-10"
    >
      <div className="flex items-center h-12 w-full">
        <button 
          className="h-full px-2 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-root)]"
          onClick={() => scroll('left')}
        >
            <ChevronLeft size={16} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex-1 flex overflow-x-auto scrollbar-hide items-center px-2 gap-2 h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            <div className="flex items-center justify-center px-2 mr-2 text-[var(--fg-secondary)] border-r border-[var(--border-color)]">
                <Keyboard size={14} />
            </div>
            {QUICK_KEYS.map((key) => (
                <button
                    key={key.label}
                    onClick={(e) => {
                        e.preventDefault();
                        onKeyPress(key.value, key.type as 'char' | 'cmd');
                    }}
                    className={`
                        min-w-[36px] h-8 px-2 rounded 
                        text-sm font-medium font-mono
                        flex items-center justify-center whitespace-nowrap
                        transition-all active:scale-95
                        ${key.type === 'cmd' 
                            ? 'bg-[var(--accent)] text-white shadow-sm hover:brightness-110' 
                            : 'bg-[var(--bg-root)] text-[var(--fg-primary)] border border-[var(--border-color)] hover:border-[var(--accent)]'}
                    `}
                >
                    {key.label}
                </button>
            ))}
        </div>

        <button 
          className="h-full px-2 text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-root)]"
          onClick={() => scroll('right')}
        >
            <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuickKeys;
