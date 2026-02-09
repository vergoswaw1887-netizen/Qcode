
import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import ChatMessageItem from './ChatMessageItem';

interface AIChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const AIChatMessageList: React.FC<AIChatMessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => (
        <ChatMessageItem key={idx} msg={msg} />
      ))}
      {isLoading && (
        <div className="flex gap-3">
           <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
             <Bot size={16} className="text-white animate-pulse" />
           </div>
           <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
             <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
             <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
           </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default AIChatMessageList;
