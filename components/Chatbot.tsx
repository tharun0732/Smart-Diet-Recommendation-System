import React, { useEffect, useRef } from 'react';
import type { Content } from '../types';

interface ChatbotComponentProps {
  messages: Content[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  onClose: () => void;
}

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  // A simple parser for **bold** text.
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
      <span>
          {parts.map((part, i) =>
              part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={i}>{part.slice(2, -2)}</strong>
              ) : (
                  part
              )
          )}
      </span>
  );
};

const ChatbotComponent: React.FC<ChatbotComponentProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading,
  onClose,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="max-w-2xl w-full mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 flex flex-col h-[90vh] max-h-[700px]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-cyan-600">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-14.304 0c-1.978-.292-3.348-2.024-3.348-3.97V6.74c0-1.946 1.37-3.678 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
              </svg>
            <h2 className="text-2xl font-bold text-gray-700">Smart Fitness Chat</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-white/50 hover:text-gray-800 transition-colors" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-14.304 0c-1.978-.292-3.348-2.024-3.348-3.97V6.74c0-1.946 1.37-3.678 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-sm md:max-w-md rounded-2xl px-4 py-2 text-sm md:text-base break-words whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-br-none'
                    : 'bg-white/90 text-gray-700 rounded-bl-none shadow-sm'
                }`}
              >
                <FormattedMessage text={msg.parts.map((part) => part.text).join('')} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-14.304 0c-1.978-.292-3.348-2.024-3.348-3.97V6.74c0-1.946 1.37-3.678 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                  </svg>
                </div>
               <div className="max-w-sm md:max-w-md rounded-2xl px-4 py-3 bg-white/90 text-gray-700 rounded-bl-none shadow-sm">
                  <div className="flex items-center justify-center space-x-1">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                  </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={onSendMessage} className="flex items-center gap-4 pt-4 border-t border-white/30">
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            placeholder="Ask about nutrition..."
            className="flex-grow bg-transparent border-b-2 py-2 px-1 text-gray-800 focus:outline-none transition-colors duration-300 border-gray-300/70 hover:border-gray-500/80 focus:border-emerald-500 disabled:opacity-50"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold p-2.5 rounded-full focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotComponent;