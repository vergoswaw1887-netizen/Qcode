import { useState } from 'react';
import { TerminalLog } from '../types';

export const useTerminal = () => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, { type, message, timestamp: Date.now() }]);
  };

  const clearLogs = () => setLogs([]);
  
  const toggleTerminal = () => setIsOpen(prev => !prev);
  const openTerminal = () => setIsOpen(true);
  const closeTerminal = () => setIsOpen(false);

  return {
    logs,
    isOpen,
    addLog,
    clearLogs,
    toggleTerminal,
    openTerminal,
    closeTerminal
  };
};