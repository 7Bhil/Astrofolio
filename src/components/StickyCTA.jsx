import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const whatsappNumber = '2290144242964';

export default function StickyCTA({ lang = 'fr' }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const content = {
    fr: {
      text: '🟢 Disponible maintenant — 2 créneaux projets libres',
      cta: 'Démarrer sur WhatsApp',
      dismiss: 'Fermer'
    },
    en: {
      text: '🟢 Available now — 2 project slots open this month',
      cta: 'Start on WhatsApp',
      dismiss: 'Dismiss'
    }
  }[lang] || {};

  const waText = lang === 'en'
    ? 'Hello Bhilal, I saw you are available and would like to discuss a project.'
    : 'Bonjour Bhilal, j\'ai vu que vous êtes disponible et je souhaite discuter d\'un projet.';
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) {
        setVisible(window.scrollY > 400);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '90px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 998,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(10, 16, 32, 0.95)',
        border: '1px solid rgba(34, 197, 94, 0.35)',
        borderRadius: '9999px',
        padding: '0.6rem 0.75rem 0.6rem 1.25rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
        animation: 'stickyCTAIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) both',
        whiteSpace: 'nowrap',
        maxWidth: '90vw'
      }}
    >
      <span style={{ fontSize: '0.88rem', color: '#86efac', fontWeight: 600 }}>
        {content.text}
      </span>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: '#fff',
          padding: '0.45rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'opacity 0.2s'
        }}
      >
        <MessageCircle size={15} />
        {content.cta}
      </a>
      <button
        onClick={handleDismiss}
        aria-label={content.dismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          padding: '0.2rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes stickyCTAIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
