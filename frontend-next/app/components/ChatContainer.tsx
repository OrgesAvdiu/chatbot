'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RoboticLogo from './RoboticLogo';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  created: string;
}

interface ChatContainerProps {
  initialConversationId?: number | null;
}

export default function ChatContainer({ initialConversationId }: ChatContainerProps = {}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversationOwnerId, setConversationOwnerId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  // Check if this is read-only mode (admin viewing another user's conversation)
  const isReadOnly = user && conversationOwnerId && user.id !== conversationOwnerId;

  // Load conversation messages if initialConversationId is provided
  useEffect(() => {
    const loadConversation = async () => {
      if (!initialConversationId) {
        // Reset state for new chat
        setMessages([]);
        setConversationId(null);
        setConversationOwnerId(null);
        setError(null);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/conversations/${initialConversationId}/`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to load conversation');
        }
        
        const data = await response.json();
        setConversationId(data.id);
        setConversationOwnerId(data.user?.id || null);
        setMessages(data.messages || []);
      } catch (err: any) {
        setError(err.message || 'Error loading conversation');
      }
    };
    
    loadConversation();
  }, [initialConversationId, API_BASE_URL]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatInput.trim()) return;

    setLoading(true);
    setError(null);
    const userMessage = chatInput;
    setChatInput('');

    // Optimistically add user message to UI
    const optimisticUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: userMessage,
      created: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);

    try {
      const payload: any = { message: userMessage };
      if (conversationId) {
        payload.conversation_id = conversationId;
      }

      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // Set conversation ID if this is the first message
      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      // Add assistant message to UI
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.response,
        created: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Error sending message');
      // Remove the optimistic user message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-black/90 text-slate-100 rounded-xl overflow-hidden">
      {error && (
        <div className="bg-red-900/50 border border-red-500/40 text-red-100 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {isReadOnly && (
        <div className="bg-amber-900/40 border-b border-amber-400/50 text-amber-100 px-4 py-2 text-sm flex items-center gap-2">
          <span className="text-lg">👁️</span>
          <span className="font-medium">Read-Only Mode:</span> Viewing another user's conversation.
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 soft-scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center space-y-4 flex flex-col items-center">
              <RoboticLogo size={64} />
              <p className="text-sm tracking-wide">Start a conversation with your AI assistant</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl px-4 py-3 rounded-2xl shadow-lg transition-transform duration-200 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#4da3ff]/80 via-[#4da3ff]/60 to-[#7c3aed]/60 text-white border border-white/10'
                      : 'glass-panel text-slate-100 border border-white/5'
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <div className={`text-[11px] mt-2 ${message.role === 'user' ? 'text-blue-100/90' : 'text-slate-400'}`}>
                    {formatTime(message.created)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed Input Bar */}
      <div className="border-t border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-4">
          {isReadOnly ? (
            <div className="text-center text-slate-400 py-3 text-sm">
              This conversation is read-only. Only the owner can send messages.
            </div>
          ) : (
            <>
              <form onSubmit={handleSendChat} className="flex gap-3 items-end">
                <div className="flex-1 glass-panel px-3 py-2">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500 resize-none h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChat(e as any);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !chatInput.trim()}
                  className="neon-button rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending…' : 'Send'}
                </button>
              </form>
              <p className="text-[11px] text-slate-500 mt-2">Enter to send · Shift+Enter for new line</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
