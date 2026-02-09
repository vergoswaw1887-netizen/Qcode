
import React, { useState, useEffect, useRef } from 'react';
import { X, FilePlus, FolderPlus, Edit2 } from 'lucide-react';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  type: 'file' | 'folder' | 'rename';
  title?: string;
  placeholder?: string;
  defaultValue?: string;
}

const InputModal: React.FC<InputModalProps> = ({ isOpen, onClose, onSubmit, type, title, placeholder, defaultValue }) => {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue || '');
      setIsSubmitting(false); // Reset submitting state
      // Slight delay to ensure focus works after render
      setTimeout(() => {
          if (inputRef.current) {
              inputRef.current.focus();
              if (defaultValue) {
                  inputRef.current.select();
              }
          }
      }, 100);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    onSubmit(value.trim());
    onClose();
  };

  const getIcon = () => {
      switch(type) {
          case 'file': return <FilePlus size={18} className="text-blue-400" />;
          case 'folder': return <FolderPlus size={18} className="text-yellow-400" />;
          case 'rename': return <Edit2 size={18} className="text-purple-400" />;
      }
  };

  const getDefaultTitle = () => {
       switch(type) {
          case 'file': return 'New File';
          case 'folder': return 'New Folder';
          case 'rename': return 'Rename Item';
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[#1e2227] border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm p-0 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[#161b22] px-4 py-3 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            {getIcon()}
            <span>{title || getDefaultTitle()}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
              Name
            </label>
            <input 
              ref={inputRef}
              type="text" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder || (type === 'file' ? 'e.g., index.html' : 'e.g., components')}
              className="w-full bg-[#0d1117] border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm placeholder-slate-600"
              autoComplete="off"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!value.trim() || isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              {type === 'rename' ? 'Save' : (isSubmitting ? 'Creating...' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputModal;
