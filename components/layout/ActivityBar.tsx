
import React from 'react';
import { Files, Search, Puzzle, Bell, Heart, User, Settings } from 'lucide-react';

export type ActivityTab = 'explorer' | 'search' | 'plugins' | 'favorites' | 'account' | 'notifications' | 'settings';

interface ActivityBarProps {
  activeTab: ActivityTab;
  onTabChange: (tab: ActivityTab) => void;
  notificationCount?: number;
  gitStatus?: 'clean' | 'modified';
}

const ActivityBar: React.FC<ActivityBarProps> = ({ activeTab, onTabChange, notificationCount = 0, gitStatus = 'clean' }) => {
  const getButtonClass = (tab: ActivityTab) => `
    p-2 transition-all duration-200 relative rounded-md mx-2 group
    ${activeTab === tab 
      ? 'text-[var(--fg-primary)] bg-[var(--bg-root)]' 
      : 'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-root)]'}
  `;

  return (
    <div className="w-16 bg-[var(--bg-activity)] border-r border-[var(--border-color)] flex flex-col items-center py-4 gap-4 shrink-0 z-50 transition-colors">
       <button onClick={() => onTabChange('explorer')} className={getButtonClass('explorer')} title="Explorer">
         <div className="relative">
            <Files size={24} strokeWidth={1.5} />
            {/* Git Status Indicator */}
            <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-activity)] ${gitStatus === 'modified' ? 'bg-yellow-500' : 'bg-green-500'}`} />
         </div>
         {activeTab === 'explorer' && <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[var(--accent)] rounded-full" />}
       </button>
       <button onClick={() => onTabChange('search')} className={getButtonClass('search')} title="Search">
         <Search size={24} strokeWidth={1.5} />
         {activeTab === 'search' && <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[var(--accent)] rounded-full" />}
       </button>
       <button onClick={() => onTabChange('plugins')} className={getButtonClass('plugins')} title="Extensions">
         <Puzzle size={24} strokeWidth={1.5} />
         {activeTab === 'plugins' && <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[var(--accent)] rounded-full" />}
       </button>
       
       <button onClick={() => onTabChange('notifications')} className={getButtonClass('notifications')} title="Notifications">
         <div className="relative">
            <Bell size={24} strokeWidth={1.5} />
            {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-[var(--accent)] text-[9px] font-bold flex items-center justify-center text-white rounded-full border-2 border-[var(--bg-activity)]">
                    {notificationCount > 9 ? '9+' : notificationCount}
                </span>
            )}
         </div>
         {activeTab === 'notifications' && <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[var(--accent)] rounded-full" />}
       </button>
       
       <div className="mt-auto flex flex-col gap-4 mb-2 w-full items-center">
        <button onClick={() => onTabChange('favorites')} className={getButtonClass('favorites')} title="Favorites & Snippets">
           <Heart size={24} strokeWidth={1.5} />
           {activeTab === 'favorites' && <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[var(--accent)] rounded-full" />}
         </button>
         <button onClick={() => onTabChange('account')} className={getButtonClass('account')} title="Account">
           <User size={24} strokeWidth={1.5} />
           {activeTab === 'account' && <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[var(--accent)] rounded-full" />}
         </button>
         <button onClick={() => onTabChange('settings')} className={getButtonClass('settings')} title="Settings">
           <Settings size={24} strokeWidth={1.5} />
           {activeTab === 'settings' && <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-[var(--accent)] rounded-full" />}
         </button>
       </div>
    </div>
  );
};

export default ActivityBar;
