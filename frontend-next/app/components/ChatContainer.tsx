'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
      if (!initialConversationId) return;
      
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
    <div className="flex flex-col h-full bg-gray-50">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {isReadOnly && (
        <div className="bg-yellow-100 border-b border-yellow-400 text-yellow-800 px-4 py-2">
          <span className="font-semibold">👁️ Read-Only Mode:</span> You are viewing another user's conversation. You cannot send messages.
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-center">
              <div className="text-4xl mb-4">💬</div>
              Start a conversation with your AI assistant
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap">{message.text}</p>
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-600'}`}>
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
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-4">
          {isReadOnly ? (
            <div className="text-center text-gray-500 py-3">
              This conversation is read-only. Only the owner can send messages.
            </div>
          ) : (
            <>
              <form onSubmit={handleSendChat} className="flex gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat(e as any);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !chatInput.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
