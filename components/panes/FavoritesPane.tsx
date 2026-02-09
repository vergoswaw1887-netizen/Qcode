
import React from 'react';
import { Heart, Star, Code, Plus } from 'lucide-react';

const FavoritesPane: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-[var(--bg-panel)] text-[var(--fg-primary)] animate-in fade-in duration-300">
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
         <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--fg-secondary)]">Favorites</h2>
         <button className="p-1 hover:bg-[var(--bg-root)] rounded text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]">
             <Plus size={14} />
         </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
              <h3 className="px-2 py-1 text-[10px] text-[var(--fg-secondary)] uppercase font-bold">Snippets</h3>
              <div className="space-y-0.5">
                  <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[var(--bg-root)] cursor-pointer group">
                      <Code size={14} className="text-pink-500" />
                      <div className="flex-1 text-xs truncate text-[var(--fg-primary)]">React Component Boilerplate</div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[var(--bg-root)] cursor-pointer group">
                      <Code size={14} className="text-yellow-500" />
                      <div className="flex-1 text-xs truncate text-[var(--fg-primary)]">Fetch API Wrapper</div>
                  </div>
              </div>
          </div>

          <div>
              <h3 className="px-2 py-1 text-[10px] text-[var(--fg-secondary)] uppercase font-bold">Starred Files</h3>
              <div className="space-y-0.5">
                  <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[var(--bg-root)] cursor-pointer group">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 text-xs truncate text-[var(--fg-primary)]">config/settings.json</div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[var(--bg-root)] cursor-pointer group">
                      <Heart size={14} className="text-red-500 fill-red-500" />
                      <div className="flex-1 text-xs truncate text-[var(--fg-primary)]">src/App.tsx</div>
                  </div>
              </div>
          </div>
          
          <div className="mt-8 px-4 text-center">
              <p className="text-xs text-[var(--fg-secondary)]">Drag and drop files here to add them to favorites.</p>
          </div>
      </div>
    </div>
  );
};

export default FavoritesPane;
