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
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Globe,
  MapPin,
  X
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
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-white tracking-tight flex items-center gap-2.5">
            <span>Pipeline Prospection & Stages</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {prospects.length} Cibles
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Suivi des candidatures spontanées, contacts RH et relances
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30 active:scale-[0.98] transition-all"
        >
          <Plus size={16} />
          <span>Nouvelle Entreprise</span>
        </button>
      </div>

      {/* KPI BENTO CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cibles</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Building2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">{stats.total}</div>
            <span className="text-xs text-slate-500">Entreprises répertoriées</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Envoyées</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Send size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-emerald-400">{stats.sent}</div>
            <span className="text-xs text-slate-500">Candidatures transmises</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">À envoyer</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-amber-400">{stats.ready}</div>
            <span className="text-xs text-slate-500">Prêtes pour expédition</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Entretiens</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-purple-400">{stats.replied}</div>
            <span className="text-xs text-slate-500">Opportunités actives</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH TOOLBAR */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-3 sm:p-4 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Toutes', count: stats.total },
            { id: 'SENT', label: 'Envoyées', count: stats.sent },
            { id: 'READY', label: 'À envoyer', count: stats.ready },
            { id: 'INTERVIEW', label: 'Entretiens', count: stats.replied }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filter === f.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === f.id ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher (tech, pays, nom)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-500/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* PROSPECTS LIST */}
      <div className="flex flex-col gap-3">
        {filteredProspects.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-10 text-center text-slate-500 text-sm">
            Aucune entreprise trouvée avec ces critères.
          </div>
        ) : (
          filteredProspects.map(prospect => {
            const isExpanded = expandedId === prospect.id;
            return (
              <div
                key={prospect.id}
                className="bg-slate-900/60 hover:bg-slate-900/90 border border-white/10 hover:border-cyan-500/30 rounded-2xl overflow-hidden transition-all"
              >
                {/* CARD HEADER */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : prospect.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="text-2xl flex-shrink-0">{prospect.flag || '🏢'}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-white truncate">
                          {prospect.name}
                        </h3>
                        {prospect.website && (
                          <a
                            href={prospect.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="Visiter le site web"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {prospect.country}</span>
                        <span>•</span>
                        <span className="truncate">{prospect.recipient}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        prospect.status === 'SENT' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                        prospect.status === 'READY' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                        prospect.status === 'INTERVIEW' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' :
                        'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {prospect.status === 'SENT' && '✓ Envoyé'}
                      {prospect.status === 'READY' && '⏳ Prêt'}
                      {prospect.status === 'PREPARING' && '⚙️ Préparation'}
                      {prospect.status === 'INTERVIEW' && '🎉 Entretien'}
                    </span>

                    <div className="text-slate-500 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* EXPANDED ACCORDION BODY */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-2 border-t border-white/5 bg-black/20 text-xs sm:text-sm flex flex-col gap-3">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">À propos de l'entreprise</span>
                      <p className="text-slate-300 leading-relaxed mt-1">{prospect.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">Stack Technique</span>
                        <div className="text-slate-200 mt-1 font-medium">{prospect.techStack}</div>
                      </div>

                      <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">Pourquoi ce profil ?</span>
                        <div className="text-slate-300 mt-1">{prospect.whyFit}</div>
                      </div>
                    </div>

                    {prospect.notes && (
                      <div className="bg-blue-500/5 border-l-2 border-blue-500 p-3 rounded-r-xl">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">Notes & Angle d'approche</span>
                        <p className="text-slate-300 mt-1">{prospect.notes}</p>
                      </div>
                    )}

                    {prospect.sentDate && (
                      <div className="text-[11px] text-slate-500">
                        Candidature expédiée le {new Date(prospect.sentDate).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    )}

                    {/* STATUS SWITCHER BUTTONS */}
                    <div className="flex items-center gap-2 pt-2 flex-wrap">
                      <button
                        onClick={() => handleStatusChange(prospect.id, 'SENT')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all active:scale-95"
                      >
                        ✓ Marquer comme Envoyé
                      </button>
                      <button
                        onClick={() => handleStatusChange(prospect.id, 'INTERVIEW')}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all active:scale-95"
                      >
                        🎉 Décroché Entretien
                      </button>
                      <button
                        onClick={() => handleStatusChange(prospect.id, 'READY')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all active:scale-95"
                      >
                        ⏳ Revenir à "À envoyer"
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD TARGET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-lg font-bold font-['Outfit'] text-white">Ajouter une entreprise cible</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProspect} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Nom de l'entreprise *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Paystack, Moniepoint"
                  value={newProspect.name}
                  onChange={e => setNewProspect({...newProspect, name: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Site Web</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProspect.website}
                    onChange={e => setNewProspect({...newProspect, website: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Localisation</label>
                  <input
                    type="text"
                    placeholder="Ex: Bénin, Remote"
                    value={newProspect.country}
                    onChange={e => setNewProspect({...newProspect, country: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Contact de recrutement</label>
                <input
                  type="text"
                  placeholder="jobs@entreprise.com ou profil LinkedIn"
                  value={newProspect.recipient}
                  onChange={e => setNewProspect({...newProspect, recipient: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Stack technique</label>
                <input
                  type="text"
                  placeholder="Ex: React, Node.js, PostgreSQL"
                  value={newProspect.techStack}
                  onChange={e => setNewProspect({...newProspect, techStack: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Description du produit</label>
                <textarea
                  rows={2}
                  placeholder="Activité principale..."
                  value={newProspect.description}
                  onChange={e => setNewProspect({...newProspect, description: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold"
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
