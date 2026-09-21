import React, { useState } from 'react';
import { authApi, setAuthToken } from '../../services/api';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import '../../styles/Admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@7bhil.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password);
      setAuthToken(response.token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030712',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#f8fafc',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '320px',
        height: '320px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(40px)',
        zIndex: 0
      }} />

      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#0a0f1d',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '2.25rem 1.75rem',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.15rem',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 900,
            fontSize: '1.25rem',
            color: '#fff'
          }}>
            7B
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#fff', letterSpacing: '-0.02em' }}>
            Studio Admin
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', color: '#94a3b8', fontSize: '0.86rem' }}>
            Accès sécurisé • PostgreSQL Neon
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#94a3b8' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="admin-input"
                style={{ paddingLeft: '2.75rem', height: '46px' }}
                placeholder="admin@7bhil.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#94a3b8' }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="admin-input"
                style={{ paddingLeft: '2.75rem', height: '46px' }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-admin-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.85rem',
              fontSize: '0.96rem',
              marginTop: '0.5rem',
              borderRadius: '12px'
            }}
          >
            {loading ? 'Connexion en cours...' : (
              <>
                Déverrouiller l'espace
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      <a 
        href="/" 
        style={{
          marginTop: '1.75rem',
          color: '#64748b',
          fontSize: '0.85rem',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          transition: 'color 0.2s ease',
          zIndex: 1
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
      >
        ← Retourner au portfolio public
      </a>
    </div>
  );
}
