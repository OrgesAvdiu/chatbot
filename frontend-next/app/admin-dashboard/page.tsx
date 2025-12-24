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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => router.push("/chat")}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors"
        >
          Back to Chat
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">All Conversations</h2>
            <p className="text-sm text-gray-500">Total: {conversations.length}</p>
          </div>

          {isLoadingData ? (
            <div className="p-6">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-gray-600">No conversations yet.</div>
          ) : (
            <ul className="divide-y">
              {conversations.map((c) => (
                <li key={c.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.title || "Untitled"}</span>
                        <span className="text-xs text-gray-500">by {c.user.username}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {c.last_message ? c.last_message : "No messages"}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        <span>Messages: {c.message_count}</span>
                        <span className="mx-2">•</span>
                        <span>Updated: {new Date(c.updated).toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/chat?conversation=${c.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
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
