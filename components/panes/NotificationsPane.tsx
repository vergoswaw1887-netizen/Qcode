
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Info, AlertTriangle, CheckCircle, X, Trash2, ArrowLeft } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  source: 'System' | 'Git' | 'Extension';
  time: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'info', title: 'Welcome to ACode AI', message: 'Your workspace is ready. Start by creating a file. Use the + button in the file explorer or the menu in the top left.', source: 'System', time: 'Just now' },
  { id: '2', type: 'warning', title: 'Git not configured', message: 'Please configure your username and email in settings to commit changes. You can access settings via the gear icon in the sidebar.', source: 'Git', time: '2m ago' },
];

const NotificationsPane: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearAll = () => setNotifications([]);
  const removeOne = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (selectedNotification?.id === id) {
          setSelectedNotification(null);
      }
  };

  const getIcon = (type: string, size: number = 16) => {
      switch(type) {
          case 'error': return <AlertTriangle size={size} className="text-red-500" />;
          case 'warning': return <AlertTriangle size={size} className="text-yellow-500" />;
          case 'success': return <CheckCircle size={size} className="text-green-500" />;
          default: return <Info size={size} className="text-blue-500" />;
      }
  };

  // -- DETAIL VIEW (FULL SCREEN PORTAL) --
  if (selectedNotification && mounted && typeof document !== 'undefined' && document.body) {
      return createPortal(
          <div className="fixed inset-0 z-[99999] w-screen h-screen flex flex-col bg-[var(--bg-root)] text-[var(--fg-primary)] animate-in slide-in-from-bottom-10 duration-200">
              <div className="h-14 border-b border-[var(--border-color)] flex items-center px-4 bg-[var(--bg-sidebar)] shrink-0 gap-4 shadow-sm">
                  <button 
                    onClick={() => setSelectedNotification(null)} 
                    className="p-2 -ml-2 hover:bg-[var(--bg-root)] rounded-full text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-colors"
                  >
                      <ArrowLeft size={24} />
                  </button>
                  <span className="text-base font-bold uppercase tracking-wide">Notification Details</span>
              </div>
              
              <div className="flex-1 overflow-y-auto w-full">
                  <div className="max-w-3xl mx-auto p-6 md:p-10 pb-20">
                      <div className="flex items-center gap-3 mb-6">
                           <div className="p-3 bg-[var(--bg-panel)] rounded-full border border-[var(--border-color)]">
                                {getIcon(selectedNotification.type, 32)}
                           </div>
                           <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase text-[var(--fg-secondary)] tracking-widest">{selectedNotification.source}</span>
                                <span className="text-sm text-[var(--fg-secondary)] opacity-60">{selectedNotification.time}</span>
                           </div>
                      </div>
                      
                      <h1 className="text-3xl font-bold mb-6 text-[var(--fg-primary)] leading-tight">{selectedNotification.title}</h1>
                      
                      <div className="prose prose-invert prose-lg max-w-none p-6 bg-[var(--bg-panel)] rounded-xl border border-[var(--border-color)] shadow-md">
                          <p className="whitespace-pre-wrap leading-relaxed text-[var(--fg-secondary)]">
                            {selectedNotification.message}
                          </p>
                      </div>

                      <div className="flex justify-end gap-4 pt-8">
                          <button 
                            onClick={() => { removeOne(selectedNotification.id); }} 
                            className="px-5 py-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2 font-medium"
                          >
                              <Trash2 size={18} /> Delete Notification
                          </button>
                      </div>
                  </div>
              </div>
          </div>,
          document.body
      );
  }

  // -- LIST VIEW --
  return (
    <div className="h-full flex flex-col bg-[var(--bg-panel)] text-[var(--fg-primary)] animate-in fade-in duration-300">
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
         <div className="flex items-center gap-2">
            <Bell size={16} className="text-[var(--fg-secondary)]" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--fg-secondary)]">Notifications</h2>
         </div>
         {notifications.length > 0 && (
            <button onClick={clearAll} className="p-1.5 hover:bg-[var(--bg-root)] rounded text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]" title="Clear All">
                <Trash2 size={14} />
            </button>
         )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--fg-secondary)]">
                <Bell size={32} className="mb-2 opacity-20" />
                <p className="text-xs">No new notifications</p>
            </div>
        ) : (
            notifications.map(notif => (
                <div 
                    key={notif.id} 
                    onClick={() => setSelectedNotification(notif)}
                    className="bg-[var(--bg-root)] border border-[var(--border-color)] rounded-lg p-3 relative group hover:border-[var(--accent)] transition-all cursor-pointer hover:shadow-md"
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); removeOne(notif.id); }}
                        className="absolute right-2 top-2 text-[var(--fg-secondary)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                        <X size={14} />
                    </button>
                    <div className="flex gap-3">
                        <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-bold text-[var(--fg-secondary)] uppercase">{notif.source}</span>
                                <span className="text-[10px] text-[var(--fg-secondary)] opacity-80">• {notif.time}</span>
                            </div>
                            <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-1 leading-tight truncate">{notif.title}</h3>
                            <p className="text-xs text-[var(--fg-secondary)] leading-relaxed line-clamp-2">{notif.message}</p>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPane;
