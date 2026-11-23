import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

// ── Context ──────────────────────────────────────────────────
const ToastContext = createContext(null);

// ── Individual Toast ─────────────────────────────────────────
const CONFIGS = {
  success: { icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  error:   { icon: XCircle,      color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.3)' },
  info:    { icon: Info,          color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
};

function Toast({ id, type = 'info', message, onRemove }) {
  const [visible, setVisible] = useState(false);
  const cfg = CONFIGS[type] || CONFIGS.info;
  const Icon = cfg.icon;

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const d = setTimeout(() => handleClose(), 4000);
    return () => { clearTimeout(t); clearTimeout(d); };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 14px',
        borderRadius: '14px',
        background: cfg.bg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.border}`,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.85)',
        maxWidth: '360px',
        width: '100%',
        pointerEvents: 'auto',
      }}
    >
      <Icon size={18} style={{ color: cfg.color, flexShrink: 0, marginTop: '1px' }} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', flex: 1, lineHeight: 1.4 }}>
        {message}
      </span>
      <button
        onClick={e => { e.stopPropagation(); handleClose(); }}
        style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Container (rendered by provider) ─────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
        maxWidth: '360px',
        width: 'calc(100vw - 32px)',
      }}
    >
      {toasts.slice(-5).map(t => (
        <Toast key={t.id} {...t} onRemove={removeToast} />
      ))}
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const toast = {
    success: (msg) => addToast('success', msg),
    error:   (msg) => addToast('error',   msg),
    info:    (msg) => addToast('info',    msg),
    warning: (msg) => addToast('warning', msg),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
