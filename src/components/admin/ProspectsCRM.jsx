import React, { useState } from 'react';
import initialProspects from '../../data/prospects.json';
import { 
  Send, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Search, 
  Plus, 
  Building2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Copy,
  Briefcase,
  MapPin,
  Globe,
  Check
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

  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, STAGE_REMOTE, PROJET_CLIENT
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, READY, SENT, INTERVIEW
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProspect, setNewProspect] = useState({
    name: '',
    type: 'PROJET_CLIENT',
    website: '',
    country: 'Bénin',
    city: 'Cotonou',
    recipient: '',
    phone: '',
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
      id: `custom-${Date.now()}`,
      ...newProspect,
      flag: newProspect.country.toLowerCase().includes('bénin') ? '🇧🇯' : '🌍',
      status: 'READY',
      sentDate: null
    };

    saveProspects([created, ...prospects]);
    setShowAddModal(false);
    setNewProspect({
      name: '', type: 'PROJET_CLIENT', website: '', country: 'Bénin', city: 'Cotonou', recipient: '', phone: '', description: '', techStack: '', whyFit: '', notes: ''
    });
  };

  const getPitchForProspect = (p) => {
    if (p.type === 'PROJET_CLIENT') {
      return `Bonjour l'équipe ${p.name},

Je suis Bhilal CHITOU, développeur web & mobile basé au Bénin (diplômé en informatique de gestion à l'IUT de Parakou).

J'ai remarqué que votre établissement n'a pas encore de site web ou de solution numérique pour présenter vos services et permettre aux clients de vous commander ou réserver directement sur smartphone.

Je conçois des solutions rapides et légères, adaptées à la réalité locale :
• Site vitrine moderne et rapide (visible sur Google)
• Catalogue de produits/services interactif
• Bouton de commande ou réservation directe par WhatsApp

Portfolio : https://7bhil.vercel.app

Seriez-vous ouverts à un court échange de 5 minutes pour voir comment vous apporter plus de clients ?

Bhilal CHITOU
Tél / WhatsApp : +229 91 55 17 07 (ou par ce canal)`;
    }

    return `Bonjour l'équipe ${p.name},

Je viens d'obtenir ma Licence en Informatique de Gestion à l'IUT de Parakou (juillet 2026). J'ai réalisé plusieurs projets en autodidacte (React, Next.js, Node, Laravel, Go) et je recherche un stage pour monter en compétences réelles en équipe.

Votre activité m'intéresse : ${p.whyFit || 'vos défis techniques.'}

Portfolio : https://7bhil.vercel.app
GitHub : https://github.com/7Bhil
Email : 7bhilal.chitou7@gmail.com`;
  };

  const handleCopyPitch = (p, e) => {
    e.stopPropagation();
    const text = getPitchForProspect(p);
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const filteredProspects = prospects.filter(p => {
    const isClientProject = p.type === 'PROJET_CLIENT';
    const isStage = !p.type || p.type === 'STAGE_REMOTE';

    const matchesType = 
      typeFilter === 'ALL' ||
      (typeFilter === 'PROJET_CLIENT' && isClientProject) ||
      (typeFilter === 'STAGE_REMOTE' && isStage);

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(query) ||
      (p.city && p.city.toLowerCase().includes(query)) ||
      (p.techStack && p.techStack.toLowerCase().includes(query)) ||
      (p.country && p.country.toLowerCase().includes(query));

    return matchesType && matchesStatus && matchesSearch;
  });

  const stats = {
    total: prospects.length,
    localProjects: prospects.filter(p => p.type === 'PROJET_CLIENT').length,
    remoteStages: prospects.filter(p => !p.type || p.type === 'STAGE_REMOTE').length,
    sent: prospects.filter(p => p.status === 'SENT').length,
    replied: prospects.filter(p => p.status === 'REPLIED' || p.status === 'INTERVIEW').length
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
            <span className="stat-label">Total Opportunités</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Clients Locaux (Bénin sans site)</span>
            <span className="stat-value">{stats.localProjects}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Globe size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Stages Remote (Tech)</span>
            <span className="stat-value">{stats.remoteStages}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Send size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Candidatures Envoyées</span>
            <span className="stat-value">{stats.sent}</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: '20px',
        background: 'var(--color-surface, #1e293b)',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* ROW 1: TYPE FILTERS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', marginRight: '4px' }}>Objectif :</span>
            {[
              { id: 'ALL', label: 'Toutes les cibles' },
              { id: 'PROJET_CLIENT', label: '🇧🇯 Projets Clients Locaux' },
              { id: 'STAGE_REMOTE', label: '🌍 Stages Remote Tech' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  background: typeFilter === t.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                  color: typeFilter === t.id ? '#ffffff' : '#94a3b8'
                }}
              >
                {t.label}
              </button>
            ))}
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

        {/* ROW 2: STATUS & SEARCH */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Tous statuts' },
              { id: 'READY', label: 'À contacter' },
              { id: 'SENT', label: 'Contacté / Envoyé' },
              { id: 'INTERVIEW', label: 'En discussion' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  background: statusFilter === s.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: statusFilter === s.id ? '#fff' : '#64748b'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Filtrer (ville, nom, activité)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 12px 7px 32px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                minWidth: '240px'
              }}
            />
          </div>
        </div>
      </div>

      {/* PROSPECTS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredProspects.map(prospect => {
          const isExpanded = expandedId === prospect.id;
          const isClientProject = prospect.type === 'PROJET_CLIENT';

          return (
            <div
              key={prospect.id}
              style={{
                background: 'var(--color-surface, #1e293b)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden'
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
                  <span style={{ fontSize: '24px' }}>{prospect.flag || (isClientProject ? '🇧🇯' : '🌍')}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#f8fafc' }}>
                        {prospect.name}
                      </h3>
                      
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '600',
                        background: isClientProject ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: isClientProject ? '#34d399' : '#60a5fa'
                      }}>
                        {isClientProject ? 'Projet Client' : 'Stage Remote'}
                      </span>

                      {prospect.city && (
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          📍 {prospect.city}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                      {prospect.phone || prospect.recipient || 'À contacter'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* BOUTON COPIER PITCH */}
                  <button
                    onClick={(e) => handleCopyPitch(prospect, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      background: copiedId === prospect.id ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title="Copier le message prêt à envoyer sur WhatsApp ou email"
                  >
                    {copiedId === prospect.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === prospect.id ? 'Copié !' : 'Copier Message'}
                  </button>

                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: 
                        prospect.status === 'SENT' ? 'rgba(16, 185, 129, 0.15)' :
                        prospect.status === 'READY' ? 'rgba(245, 158, 11, 0.15)' :
                        'rgba(148, 163, 184, 0.15)',
                      color:
                        prospect.status === 'SENT' ? '#34d399' :
                        prospect.status === 'READY' ? '#fbbf24' :
                        '#94a3b8'
                    }}
                  >
                    {prospect.status === 'SENT' ? '✓ Contacté' : '⏳ À contacter'}
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
                  fontSize: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div>
                    <strong style={{ color: '#cbd5e1' }}>Activité de l'établissement :</strong>
                    <p style={{ margin: '4px 0 0', color: '#94a3b8', lineHeight: '1.5' }}>
                      {prospect.description}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Solution technique proposée :</strong>
                      <div style={{ marginTop: '4px', color: '#38bdf8' }}>
                        {prospect.techStack}
                      </div>
                    </div>

                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Angle d'attaque commercial :</strong>
                      <div style={{ marginTop: '4px', color: '#94a3b8' }}>
                        {prospect.whyFit}
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW DU MESSAGE */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ color: '#a78bfa', fontSize: '12px' }}>Aperçu du message à envoyer :</strong>
                      <button
                        onClick={(e) => handleCopyPitch(prospect, e)}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px' }}
                      >
                        {copiedId === prospect.id ? '✓ Copié !' : '📋 Copier'}
                      </button>
                    </div>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#cbd5e1', fontSize: '12px', fontFamily: 'inherit' }}>
                      {getPitchForProspect(prospect)}
                    </pre>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
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
                      Marquer comme Contacté
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
                      🎉 En discussion / Devis
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
              Ajouter une nouvelle cible
            </h3>
            
            <form onSubmit={handleAddProspect} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Type d'opportunité *</label>
                <select
                  value={newProspect.type}
                  onChange={(e) => setNewProspect({ ...newProspect, type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                >
                  <option value="PROJET_CLIENT">🇧🇯 Projet Client Local (Création de site / App)</option>
                  <option value="STAGE_REMOTE">🌍 Stage Remote (Développeur)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nom de l'établissement *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Clinique Ste Marie, Hôtel du Lac..."
                  value={newProspect.name}
                  onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Ville</label>
                  <input
                    type="text"
                    placeholder="Cotonou, Parakou..."
                    value={newProspect.city}
                    onChange={(e) => setNewProspect({ ...newProspect, city: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Téléphone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+229 97 00 00 00"
                    value={newProspect.phone}
                    onChange={(e) => setNewProspect({ ...newProspect, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Activité de l'établissement</label>
                <textarea
                  rows={2}
                  placeholder="Hôtel, restaurant, quincaillerie, cabinet..."
                  value={newProspect.description}
                  onChange={(e) => setNewProspect({ ...newProspect, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Solution suggérée</label>
                <input
                  type="text"
                  placeholder="Ex: Site vitrine Astro + commandes WhatsApp"
                  value={newProspect.techStack}
                  onChange={(e) => setNewProspect({ ...newProspect, techStack: e.target.value })}
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
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
