'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ChatContainer from '../components/ChatContainer';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, logout } = useAuth();
  const conversationId = searchParams.get('conversation') ? parseInt(searchParams.get('conversation')!) : null;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Chatbot - {user.username}</h1>
        <div className="flex gap-4">
          {user.is_staff && (
            <button
              onClick={() => router.push('/admin-dashboard')}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded transition-colors"
            >
              Admin Dashboard
            </button>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatContainer initialConversationId={conversationId} />
      </div>
    </div>
  );
}
