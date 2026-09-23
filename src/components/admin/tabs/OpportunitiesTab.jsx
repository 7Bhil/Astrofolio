import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Send, 
  XCircle, 
  Edit3, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles,
  Search,
  ExternalLink,
  Mail
} from 'lucide-react';

export default function OpportunitiesTab({
  opportunities = [],
  loading = false,
  onApprove,
  onReject,
  onSend,
  onReconcile,
  onUpdateMessage,
  onRefresh
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const filtered = opportunities.filter(opp => {
    const matchesStatus = filterStatus === 'ALL' || opp.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      opp.role.toLowerCase().includes(query) ||
      (opp.company?.name || '').toLowerCase().includes(query) ||
      (opp.country || '').toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'READY':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Prêt à valider</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">Approuvé</span>;
      case 'SENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">En cours d'envoi...</span>;
      case 'SEND_UNKNOWN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse">Envoi ambigu</span>;
      case 'SENT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Envoyé</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">Ignoré</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-300">{status}</span>;
    }
  };

  const handleStartEdit = (opp) => {
    const msg = opp.messages?.[0]?.content || '';
    setEditingMessageId(opp.id);
    setMessageDraft(msg);
  };

  const handleSaveMessage = async (oppId) => {
    setActionLoadingId(oppId);
    try {
      await onUpdateMessage(oppId, messageDraft);
      setEditingMessageId(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-400" />
            <span>Opportunity Engine</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {opportunities.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Collecte automatisée, qualification par IA et envoi contrôlé
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher par rôle, entreprise, pays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 focus:border-cyan-500/80 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['ALL', 'READY', 'APPROVED', 'SEND_UNKNOWN', 'SENT', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {st === 'ALL' ? 'Toutes' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-white/10 rounded-3xl text-slate-400 text-xs">
            Aucune opportunité trouvée avec ces filtres.
          </div>
        ) : (
          filtered.map((opp) => {
            const contact = opp.contacts?.[0];
            const message = opp.messages?.[0];
            const isEditing = editingMessageId === opp.id;
            const isUnknown = opp.status === 'SEND_UNKNOWN';

            return (
              <div 
                key={opp.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isUnknown 
                    ? 'border-rose-500/40 bg-rose-950/10' 
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/30'
                }`}
              >
                {/* Top: Role, Company, Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-bold text-white font-['Outfit'] truncate">
                        {opp.role}
                      </h3>
                      {getStatusBadge(opp.status)}
                      {opp.remote && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Remote
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-300 font-semibold">
                        <Building2 size={13} className="text-cyan-400" />
                        {opp.company?.name || 'Entreprise'}
                      </span>
                      {opp.country && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} />
                          {opp.country}
                        </span>
                      )}
                      {opp.jobUrl && (
                        <a 
                          href={opp.jobUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
                        >
                          <span>Voir l'offre</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Score Bento */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-medium block">Match Score</span>
                      <span className="text-xl font-black font-['Outfit'] text-cyan-400">
                        {opp.score || 0}<span className="text-xs text-slate-500 font-normal">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Contact Info & Stack Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-b border-white/5 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1.5">Contact ciblé</span>
                    {contact ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold">
                          {contact.fullName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <span className="text-white font-semibold block">
                            {contact.fullName} {contact.role ? `• ${contact.role}` : ''}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                            <Mail size={11} />
                            {contact.email || 'Email non détecté'}
                            {contact.verified && (
                              <span className="text-emerald-400 font-bold ml-1">✓ Vérifié</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Aucun contact nominatif trouvé (utilisation email public)</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1.5">Technologies requises</span>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.stackRequired?.length > 0 ? (
                        opp.stackRequired.map((st, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 text-[11px] border border-white/10">
                            {st}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">Non spécifié</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message preview / Editor */}
                <div className="pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                      <span>Message préparé par IA ({message?.generatedBy || 'template'})</span>
                      {message?.editedByUser && (
                        <span className="text-[10px] text-cyan-400 font-medium">(modifié manuellement)</span>
                      )}
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(opp)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                      >
                        <Edit3 size={12} />
                        <span>Modifier le texte</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        rows={6}
                        value={messageDraft}
                        onChange={(e) => setMessageDraft(e.target.value)}
                        className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl p-3 text-xs text-white outline-none font-mono"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleSaveMessage(opp.id)}
                          disabled={actionLoadingId === opp.id}
                          className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="p-3.5 bg-slate-950/70 border border-white/5 rounded-xl text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                      {message?.content || 'Aucun message généré.'}
                    </p>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-white/5">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock size={12} />
                    <span>Détecté le {new Date(opp.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Alerte SEND_UNKNOWN */}
                    {isUnknown && (
                      <button
                        onClick={() => onReconcile(opp.id)}
                        className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <AlertTriangle size={14} />
                        <span>Vérifier auprès de Resend</span>
                      </button>
                    )}

                    {/* Actions normales */}
                    {opp.status !== 'SENT' && opp.status !== 'REJECTED' && !isUnknown && (
                      <>
                        <button
                          onClick={() => onReject(opp.id)}
                          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                        >
                          <XCircle size={14} />
                          <span>Ignorer</span>
                        </button>

                        <button
                          onClick={() => onSend(opp.id)}
                          disabled={actionLoadingId === opp.id || opp.status === 'SENDING'}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <Send size={14} />
                          <span>Valider & Envoyer</span>
                        </button>
                      </>
                    )}

                    {opp.status === 'SENT' && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 size={16} />
                        <span>Candidature transmise</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
