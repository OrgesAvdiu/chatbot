'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import RoboticLogo from '../components/RoboticLogo';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password, email);
      }
      router.push('/chat');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden text-slate-100">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 20% 20%, rgba(77,163,255,0.18), transparent 35%), radial-gradient(circle at 80% 0%, rgba(155,107,255,0.16), transparent 30%)"
      }} />

      <div className="relative glass-panel w-full max-w-md p-8 border border-white/10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <RoboticLogo size={80} />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Neural Access</p>
          <h1 className="text-3xl font-semibold text-slate-50 mb-2">AI Console</h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Authenticate to continue' : 'Provision your access'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/40 text-red-100 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4da3ff]"
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#9b6bff]"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4da3ff]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full neon-button rounded-lg py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Syncing…' : (isLogin ? 'Enter Console' : 'Create Access')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-[#7dd3fc] hover:text-white transition-colors"
          >
            {isLogin ? "New here? Create access" : 'Have access? Sign in'}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p className="uppercase tracking-[0.2em] text-slate-400 mb-1">Test Accounts</p>
          <p className="font-mono text-slate-300">Admin: admin / admin123</p>
          <p className="font-mono text-slate-300">User: testuser / test123</p>
        </div>
      </div>
    </div>
  );
}
