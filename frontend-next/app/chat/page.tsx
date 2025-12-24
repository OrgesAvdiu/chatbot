'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ChatContainer from '../components/ChatContainer';
import RoboticLogo from '../components/RoboticLogo';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-slate-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4da3ff] mx-auto"></div>
          <p className="mt-4 text-sm text-slate-400">Booting systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="relative border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4 flex justify-between items-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-4">
          <RoboticLogo size={48} />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Neon Core</p>
            <h1 className="text-xl font-semibold leading-tight">AI Chatbot <span className="text-[#7dd3fc]">/</span> {user.username}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          {user.is_staff && (
            <button
              onClick={() => router.push('/admin-dashboard')}
              className="neon-button rounded-lg px-4 py-2 text-sm"
            >
              Admin Dashboard
            </button>
          )}
          <button
            onClick={logout}
            className="rounded-lg px-4 py-2 text-sm border border-white/10 hover:border-red-400/60 hover:text-red-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="glass-panel glow-border h-full">
          <ChatContainer initialConversationId={conversationId} />
        </div>
      </div>
    </div>
  );
}
