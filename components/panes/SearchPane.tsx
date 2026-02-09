
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchPane: React.FC = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="h-full flex flex-col bg-[var(--bg-panel)] text-[var(--fg-primary)]">
      <div className="p-4 border-b border-[var(--border-color)]">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--fg-secondary)] mb-3">Search</h2>
        <div className="relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] pl-8 text-[var(--fg-primary)] placeholder-[var(--fg-secondary)]"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-secondary)]" />
        </div>
      </div>
      <div className="p-4 text-center text-xs text-[var(--fg-secondary)] italic">
        {query ? `No results found for "${query}"` : "Type to search in workspace"}
      </div>
    </div>
  );
};

export default SearchPane;
