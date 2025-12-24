"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface ConversationUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

interface ConversationItem {
  id: number;
  user: ConversationUser;
  title: string | null;
  created: string;
  updated: string;
  message_count: number;
  last_message: string | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.is_staff) {
        router.push("/chat");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !user.is_staff) return;
      setIsLoadingData(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/admin/dashboard/`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data.detail as string) || "Failed to load conversations");
        }
        const data: ConversationItem[] = await res.json();
        setConversations(data);
      } catch (e: any) {
        setError(e.message || "Unexpected error");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchConversations();
  }, [API_BASE_URL, user]);

  if (loading || !user || !user.is_staff) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4da3ff] mx-auto"></div>
          <p className="mt-4 text-sm text-slate-400">Syncing admin console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 py-4 flex justify-between items-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Admin Console</p>
          <h1 className="text-xl font-semibold leading-tight">Global Conversations</h1>
        </div>
        <button
          onClick={() => router.push("/chat")}
          className="neon-button rounded-lg px-4 py-2 text-sm"
        >
          Back to Chat
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-900/40 text-red-100 border border-red-500/40 rounded-lg">
            {error}
          </div>
        )}

        <div className="glass-panel border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">All Conversations</h2>
              <p className="text-xs text-slate-400">Total: {conversations.length}</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_4px_rgba(52,211,153,0.4)]" aria-label="live" />
          </div>

          {isLoadingData ? (
            <div className="p-6 text-slate-400">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-slate-400">No conversations yet.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {conversations.map((c) => (
                <li key={c.id} className="px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-50">{c.title || "Untitled"}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">by {c.user.username}</span>
                      </div>
                      <p className="text-sm text-slate-300/90 line-clamp-2">
                        {c.last_message ? c.last_message : "No messages"}
                      </p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>Messages: {c.message_count}</span>
                        <span>•</span>
                        <span>Updated: {new Date(c.updated).toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/chat?conversation=${c.id}`)}
                      className="neon-button rounded-lg px-3 py-2 text-xs"
                    >
                      Open
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
