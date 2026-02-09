
import React from 'react';
import { User, Settings, Github, LogOut, Shield, Key, CreditCard } from 'lucide-react';

const AccountPane: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-[var(--bg-panel)] text-[var(--fg-primary)] animate-in fade-in duration-300">
      <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-root)] flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px] mb-3">
             <div className="w-full h-full rounded-full bg-[var(--bg-panel)] flex items-center justify-center">
                 <User size={32} className="text-[var(--fg-primary)]" />
             </div>
        </div>
        <h2 className="text-lg font-bold text-[var(--fg-primary)]">Guest User</h2>
        <p className="text-xs text-[var(--fg-secondary)]">Free Tier • Local Storage</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--fg-secondary)] mb-2">Integrations</h3>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-root)] hover:brightness-95 transition-all border border-[var(--border-color)]">
                  <Github size={18} className="text-[var(--fg-primary)]" />
                  <div className="flex-1 text-left">
                      <div className="text-sm font-semibold text-[var(--fg-primary)]">GitHub</div>
                      <div className="text-[10px] text-[var(--fg-secondary)]">Not connected</div>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">Connect</span>
              </button>
          </div>

          <div className="space-y-1">
               <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--fg-secondary)] mb-2">Settings</h3>
               <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-[var(--bg-root)] text-[var(--fg-primary)] text-sm text-left">
                   <Settings size={16} /> Preferences
               </button>
               <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-[var(--bg-root)] text-[var(--fg-primary)] text-sm text-left">
                   <Shield size={16} /> Privacy & Security
               </button>
               <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-[var(--bg-root)] text-[var(--fg-primary)] text-sm text-left">
                   <Key size={16} /> Keyboard Shortcuts
               </button>
               <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-[var(--bg-root)] text-[var(--fg-primary)] text-sm text-left">
                   <CreditCard size={16} /> Billing (Pro)
               </button>
          </div>
      </div>

      <div className="p-4 border-t border-[var(--border-color)]">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors">
              <LogOut size={16} /> Sign Out
          </button>
      </div>
    </div>
  );
};

export default AccountPane;
