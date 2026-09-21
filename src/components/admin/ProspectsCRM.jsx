import React, { useState } from 'react';
import initialProspects from '../../data/prospects.json';
import { 
  Send, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Plus, 
  Building2, 
  Sparkles,
  Mail,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

export default function ProspectsCRM() {
  const [prospects, setProspects] = useState(() => {
    try {
      const saved = localStorage.getItem('7bhil_prospects');
      return saved ? JSON.parse(saved) : initialProspects;
    } catch {
      return initialProspects;
    }
  });

  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProspect, setNewProspect] = useState({
    name: '',
    website: '',
    country: '',
    recipient: '',
    description: '',
    techStack: '',
    whyFit: '',
    notes: ''
  });

  const saveProspects = (updated) => {
    setProspects(updated);
    try {
      localStorage.setItem('7bhil_prospects', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = prospects.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          sentDate: newStatus === 'SENT' && !p.sentDate ? new Date().toISOString() : p.sentDate
        };
      }
      return p;
    });
    saveProspects(updated);
  };

  const handleAddProspect = (e) => {
    e.preventDefault();
    if (!newProspect.name) return;

    const created = {
      id: newProspect.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      ...newProspect,
      flag: '🌐',
      status: 'READY',
      sentDate: null
    };

    saveProspects([created, ...prospects]);
    setShowAddModal(false);
    setNewProspect({
      name: '', website: '', country: '', recipient: '', description: '', techStack: '', whyFit: '', notes: ''
    });
  };

  const filteredProspects = prospects.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.techStack.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: prospects.length,
    sent: prospects.filter(p => p.status === 'SENT').length,
    replied: prospects.filter(p => p.status === 'REPLIED' || p.status === 'INTERVIEW').length,
    ready: prospects.filter(p => p.status === 'READY').length
  };

  return (
    <div className="prospects-crm-container">
      {/* KPI CARDS */}
      <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Building2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Entreprises ciblées</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Send size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Candidatures envoyées</span>
            <span className="stat-value">{stats.sent}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Prêtes à l'envoi</span>
            <span className="stat-value">{stats.ready}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Sparkles size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Réponses & Entretiens</span>
            <span className="stat-value">{stats.replied}</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        background: 'var(--color-surface, #1e293b)',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'Toutes' },
            { id: 'SENT', label: 'Envoyées' },
            { id: 'READY', label: 'À envoyer' },
            { id: 'INTERVIEW', label: 'Entretiens' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '13px',
                background: filter === f.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                color: filter === f.id ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Rechercher (tech, pays, nom)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px 8px 32px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                minWidth: '220px'
              }}
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Ajouter une cible
          </button>
        </div>
      </div>

      {/* PROSPECTS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredProspects.map(prospect => {
          const isExpanded = expandedId === prospect.id;
          return (
            <div
              key={prospect.id}
              style={{
                background: 'var(--color-surface, #1e293b)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                transition: 'border-color 0.2s'
              }}
            >
              {/* CARD HEADER */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : prospect.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '24px' }}>{prospect.flag || '🏢'}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>
                        {prospect.name}
                      </h3>
                      {prospect.website && (
                        <a 
                          href={prospect.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                      {prospect.country} • {prospect.recipient}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 
                        prospect.status === 'SENT' ? 'rgba(16, 185, 129, 0.15)' :
                        prospect.status === 'READY' ? 'rgba(245, 158, 11, 0.15)' :
                        prospect.status === 'INTERVIEW' ? 'rgba(168, 85, 247, 0.15)' :
                        'rgba(148, 163, 184, 0.15)',
                      color:
                        prospect.status === 'SENT' ? '#34d399' :
                        prospect.status === 'READY' ? '#fbbf24' :
                        prospect.status === 'INTERVIEW' ? '#c084fc' :
                        '#94a3b8'
                    }}
                  >
                    {prospect.status === 'SENT' && '✓ Envoyé'}
                    {prospect.status === 'READY' && '⏳ Prêt'}
                    {prospect.status === 'PREPARING' && '⚙️ En préparation'}
                    {prospect.status === 'INTERVIEW' && '🎉 Entretien'}
                  </span>

                  {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {isExpanded && (
                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div>
                    <strong style={{ color: '#cbd5e1' }}>À propos de l'entreprise :</strong>
                    <p style={{ margin: '4px 0 0', color: '#94a3b8', lineHeight: '1.5' }}>
                      {prospect.description}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Stack technique :</strong>
                      <div style={{ marginTop: '4px', color: '#38bdf8', fontSize: '13px' }}>
                        {prospect.techStack}
                      </div>
                    </div>

                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Pourquoi ce match ?</strong>
                      <div style={{ marginTop: '4px', color: '#94a3b8', fontSize: '13px' }}>
                        {prospect.whyFit}
                      </div>
                    </div>
                  </div>

                  {prospect.notes && (
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                      <strong style={{ color: '#cbd5e1', fontSize: '13px' }}>Notes de candidature :</strong>
                      <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>
                        {prospect.notes}
                      </p>
                    </div>
                  )}

                  {prospect.sentDate && (
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Candidature transmise le {new Date(prospect.sentDate).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleStatusChange(prospect.id, 'SENT')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Marquer comme Envoyé
                    </button>
                    <button
                      onClick={() => handleStatusChange(prospect.id, 'INTERVIEW')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#c084fc',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      🎉 Marquer en Entretien !
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD PROSPECT MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#1e293b',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#fff', fontSize: '18px' }}>
              Ajouter une nouvelle entreprise cible
            </h3>
            
            <form onSubmit={handleAddProspect} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nom de l'entreprise *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Supabase, Pezesha..."
                  value={newProspect.name}
                  onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Site web</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProspect.website}
                    onChange={(e) => setNewProspect({ ...newProspect, website: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Localisation</label>
                  <input
                    type="text"
                    placeholder="Ex: Kenya, Remote, France"
                    value={newProspect.country}
                    onChange={(e) => setNewProspect({ ...newProspect, country: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email ou contact de recrutement</label>
                <input
                  type="text"
                  placeholder="jobs@entreprise.com ou LinkedIn"
                  value={newProspect.recipient}
                  onChange={(e) => setNewProspect({ ...newProspect, recipient: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Stack technique</label>
                <input
                  type="text"
                  placeholder="Ex: React, Node, Laravel, Postgres..."
                  value={newProspect.techStack}
                  onChange={(e) => setNewProspect({ ...newProspect, techStack: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description du produit / activité</label>
                <textarea
                  rows={2}
                  placeholder="Ce qu'ils construisent..."
                  value={newProspect.description}
                  onChange={(e) => setNewProspect({ ...newProspect, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Pourquoi ce profil correspond ?</label>
                <textarea
                  rows={2}
                  placeholder="Points de connexion avec mon profil..."
                  value={newProspect.whyFit}
                  onChange={(e) => setNewProspect({ ...newProspect, whyFit: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
