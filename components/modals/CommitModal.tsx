
import React from 'react';
import { X } from 'lucide-react';

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: () => void;
  message: string;
  onMessageChange: (msg: string) => void;
}

const CommitModal: React.FC<CommitModalProps> = ({ isOpen, onClose, onCommit, message, onMessageChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#161b22] border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">Commit Changes</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <textarea 
          value={message} 
          onChange={(e) => onMessageChange(e.target.value)} 
          placeholder="Commit message..." 
          className="w-full h-24 bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none mb-4" 
          autoFocus 
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white">
            Cancel
          </button>
          <button 
            onClick={onCommit} 
            disabled={!message.trim()} 
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-bold uppercase"
          >
            Commit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommitModal;
