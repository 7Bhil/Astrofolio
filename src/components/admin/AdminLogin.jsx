import React, { useState, useEffect } from 'react';
import { authApi, setAuthToken, getAuthToken, removeAuthToken } from '../../services/api';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@7bhil.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authApi.getMe().then(res => {
        if (res && res.user) {
          window.location.replace('/admin/dashboard');
        }
      }).catch(() => {
        removeAuthToken();
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);
      setAuthToken(response.token);
      window.location.replace('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4 relative overflow-hidden font-sans">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Box */}
      <div className="w-full max-w-md bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 inline-flex items-center justify-center font-black font-['Outfit'] text-white text-xl shadow-lg shadow-blue-500/30 mb-4">
            7B
          </div>
          <h1 className="text-2xl font-extrabold font-['Outfit'] text-white tracking-tight">
            Studio Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Accès sécurisé • PostgreSQL Neon
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 mb-5 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Adresse Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                placeholder="admin@7bhil.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : (
              <>
                <span>Déverrouiller l'espace</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      <a 
        href="/" 
        className="mt-6 text-xs text-slate-500 hover:text-cyan-400 transition-colors z-10"
      >
        ← Retourner au portfolio public
      </a>
    </div>
  );
}
