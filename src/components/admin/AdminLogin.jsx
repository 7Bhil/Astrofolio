import React, { useState, useEffect } from 'react';
import { authApi, setAuthToken, getAuthToken, removeAuthToken } from '../../services/api';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, CheckCircle, Globe, Zap, Database } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('7bhilal.chitou7@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authApi.getMe().then(res => {
        if (res && res.user) window.location.replace('/admin/dashboard');
      }).catch(() => removeAuthToken());
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
    <div
      className="min-h-screen flex font-sans"
      style={{ background: '#03070f' }}
    >
      {/* ── Ambient blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-80px] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.12]" style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
        <div className="absolute top-[40%] right-[-80px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.08]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-[-60px] left-[35%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.07]" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
      </div>

      {/* ── LEFT — Branding panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.08) 50%, rgba(6,182,212,0.06) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black font-['Outfit'] text-white text-lg"
            style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 0 28px rgba(6,182,212,0.4)' }}
          >
            7B
          </div>
          <div>
            <p className="text-sm font-bold text-white font-['Outfit']">Studio Admin</p>
            <a href="/" className="text-[11px] text-cyan-400/60 hover:text-cyan-300 flex items-center gap-1 transition-colors">
              <Globe size={10} /> 7bhil.vercel.app
            </a>
          </div>
        </div>

        {/* Center content */}
        <div>
          <h1 className="text-4xl xl:text-5xl font-extrabold font-['Outfit'] text-white leading-tight mb-3">
            Bhilal<br />
            <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CHITOU
            </span>
          </h1>
          <p className="text-slate-400 text-sm mb-8 font-medium">Développeur Full-Stack & Mobile</p>

          <div className="flex flex-col gap-3">
            {[
              { icon: Zap,      label: 'Pipeline IA',         desc: 'Opportunités automatiques' },
              { icon: Database, label: 'CRM Prospects',        desc: 'Gestion des contacts' },
              { icon: Globe,    label: 'Portfolio en ligne',   desc: '7bhil.vercel.app' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}
                >
                  <Icon size={15} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-[11px] text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom status */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl self-start"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          <span className="text-[11px] font-semibold text-emerald-400">Neon PostgreSQL · Live</span>
        </div>
      </div>

      {/* ── RIGHT — Login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black font-['Outfit'] text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
          >
            7B
          </div>
          <span className="text-base font-bold text-white font-['Outfit']">Studio Admin</span>
        </div>

        {/* Form card */}
        <div
          className="w-full max-w-sm"
          style={{
            background: 'rgba(10,15,35,0.8)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '32px',
          }}
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-full" />

          <div className="mb-7">
            <h2 className="text-2xl font-extrabold font-['Outfit'] text-white">Bienvenue 👋</h2>
            <p className="text-sm text-slate-400 mt-1">Accès sécurisé à l'espace admin</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2.5 p-3 rounded-xl mb-5 text-sm font-semibold"
              style={{
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.3)',
                color: '#fb7185',
                animation: 'shake 0.4s ease',
              }}
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Adresse Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="7bhilal.chitou7@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(6,182,212,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(6,182,212,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                background: loading ? 'rgba(37,99,235,0.6)' : 'linear-gradient(90deg, #2563eb, #06b6d4)',
                boxShadow: '0 0 24px rgba(6,182,212,0.3)',
              }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Connexion...</>
              ) : (
                <>Accéder au Studio <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <a href="/" className="mt-6 text-xs text-slate-600 hover:text-cyan-400 transition-colors z-10">
          ← Retourner au portfolio public
        </a>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
