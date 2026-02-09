import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

interface ChatMessageItemProps {
  msg: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ msg }) => {
  return (
    <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center shrink-0
        ${msg.role === 'model' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}
      `}>
        {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
      </div>
      <div className={`
        max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed
        ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}
      `}>
        {msg.role === 'model' ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown components={{
              code({node, inline, className, children, ...props}: any) {
                return !inline ? (
                  <div className="bg-slate-950 p-2 rounded my-2 overflow-x-auto border border-slate-700">
                     <code className={className} {...props}>{children}</code>
                  </div>
                ) : (
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-red-300" {...props}>{children}</code>
                )
              }
            }}>{msg.text}</ReactMarkdown>
          </div>
        ) : (
          msg.text
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;