import React, { useState } from 'react';
import { authApi, setAuthToken } from '../../services/api';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
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
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, #0b1329 0%, #060b18 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#f8fafc',
      padding: '1.25rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0b1329',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            marginBottom: '1rem',
            boxShadow: '0 8px 20px rgba(6, 182, 212, 0.35)'
          }}>
            <ShieldCheck size={32} color="#fff" />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Espace Administrateur</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
            Gestion du Portfolio 7Bhil • Neon PostgreSQL
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.85rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="admin-form-group">
            <label>Adresse Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="admin-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="admin@7bhil.com"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="admin-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-admin-primary"
            style={{
              width: '100%',
              justify: 'center',
              padding: '0.85rem',
              fontSize: '1rem',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Connexion...' : (
              <>
                Se connecter
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
