import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Globe, MapPin, CheckCircle2, Clock, Send, XCircle, Edit3, AlertTriangle, RefreshCw, Sparkles,
  Search, ExternalLink, Mail, Activity, Server, Database, Terminal, ShieldCheck, CheckCircle,
  HelpCircle, Trash2, Calendar, RotateCcw, MessageSquare
} from 'lucide-react';
import { opportunitiesApi } from '../../../services/api';

export default function OpportunitiesTab({ onAlert }) {
  const [subTab, setSubTab] = useState('opportunities');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [runs, setRuns] = useState([]);
  const [logFilter, setLogFilter] = useState('ALL');
  const [diagLoading, setDiagLoading] = useState(false);

  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await opportunitiesApi.getAll({ limit: 200 });
      setOpportunities(data?.opportunities || []);
    } catch (err) {
      if (onAlert) onAlert('danger', 'Impossible de charger les opportunités.');
    } finally {
      setLoading(false);
    }
  }, [onAlert]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => loadOpportunities(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadOpportunities]);

  useEffect(() => {
    if (subTab === 'diagnostics') loadDiagnostics();
  }, [subTab, logFilter]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadOpportunities();
    setTimeout(() => setIsRefreshing(false), 1000);
    if (onAlert) onAlert('success', 'Données mises à jour !');
  };

  const handleDelete = async (oppId) => {
    if (!window.confirm('Es-tu sûr de vouloir supprimer définitivement cette opportunité ?')) return;
    setActionLoadingId(oppId);
    try {
      await opportunitiesApi.delete(oppId);
      setOpportunities(prev => prev.filter(o => o.id !== oppId));
      if (onAlert) onAlert('success', 'Opportunité supprimée définitivement.');
    } catch (err) {
      if (onAlert) onAlert('danger', 'Erreur lors de la suppression.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSetReplyStatus = async (oppId, newStatus) => {
    setActionLoadingId(oppId);
    try {
      await opportunitiesApi.update(oppId, { status: newStatus });
      setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, status: newStatus } : o));
      const labels = { REPLIED: '💬 Réponse marquée', FOLLOW_UP: '📤 Relance notée', CLOSED: '✓ Fermé' };
      if (onAlert) onAlert('success', labels[newStatus] || 'Statut mis à jour.');
    } catch (err) {
      if (onAlert) onAlert('danger', 'Erreur lors de la mise à jour du statut.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const loadDiagnostics = async () => {
    setDiagLoading(true);
    try {
      const logParams = logFilter !== 'ALL' ? { status: logFilter, limit: 50 } : { limit: 50 };
      const [hRes, lRes, rRes] = await Promise.all([
        opportunitiesApi.getSystemHealth().catch(() => null),
        opportunitiesApi.getLogs(logParams).catch(() => []),
        opportunitiesApi.getRuns().catch(() => [])
      ]);
      setHealthData(hRes);
      setLogs(lRes || []);
      setRuns(rRes || []);
    } catch (err) {
      if (onAlert) onAlert('danger', 'Erreur de chargement des diagnostics.');
    } finally {
      setDiagLoading(false);
    }
  };

  const handleUpdateMessage = async (oppId) => {
    setActionLoadingId(oppId);
    try {
      await opportunitiesApi.updateMessage(oppId, messageDraft);
      setOpportunities(prev => prev.map(o => {
        if (o.id !== oppId) return o;
        const msgs = [...(o.messages || [])];
        if (msgs[0]) msgs[0] = { ...msgs[0], content: messageDraft };
        return { ...o, messages: msgs };
      }));
      setEditingMessageId(null);
      if (onAlert) onAlert('success', 'Message mis à jour avec succès.');
    } catch (err) {
      if (onAlert) onAlert('danger', 'Erreur de mise à jour du message.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApprove = async (oppId) => {
    setActionLoadingId(oppId);
    try {
      await opportunitiesApi.approve(oppId);
      setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, status: 'APPROVED' } : o));
      if (onAlert) onAlert('success', 'Opportunité approuvée pour envoi.');
    } catch (err) {
      if (onAlert) onAlert('danger', 'Erreur lors de l\'approbation.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (oppId) => {
    setActionLoadingId(oppId);
    try {
      await opportunitiesApi.reject(oppId);
      setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, status: 'REJECTED' } : o));
      if (onAlert) onAlert('info', 'Opportunité ignorée.');
    } catch (err) {
      if (onAlert) onAlert('danger', 'Erreur lors du rejet.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSend = async (oppId) => {
    if (!window.confirm('Confirmer l\'envoi direct de cette candidature par e-mail ?')) return;
    setActionLoadingId(oppId);
    try {
      const res = await opportunitiesApi.send(oppId);
      if (res?.status === 'SENT') {
        setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, status: 'SENT' } : o));
        if (onAlert) onAlert('success', 'E-mail de candidature envoyé avec succès !');
      } else if (res?.status === 'SEND_UNKNOWN') {
        setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, status: 'SEND_UNKNOWN' } : o));
        if (onAlert) onAlert('warning', 'Statut ambigu : en attente de vérification.');
      }
    } catch (err) {
      if (onAlert) onAlert('danger', err.message || 'Erreur lors de l\'envoi.');
      loadOpportunities();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReconcile = async (oppId) => {
    setActionLoadingId(oppId);
    try {
      const res = await opportunitiesApi.reconcile(oppId);
      setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, status: res.status } : o));
      if (onAlert) onAlert('info', res.message || 'Réconciliation effectuée.');
    } catch (err) {
      if (onAlert) onAlert('danger', 'Erreur de réconciliation.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];

  const filteredOpportunities = safeOpportunities.filter(opp => {
    if (!opp) return false;
    const matchesStatus = filterStatus === 'ALL' || opp.status === filterStatus;
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch = 
      (opp.role || '').toLowerCase().includes(query) ||
      (opp.company?.name || '').toLowerCase().includes(query) ||
      (opp.country || '').toLowerCase().includes(query);

    // Filtrage temporel intelligent
    let matchesDate = true;
    if (dateFilter !== 'ALL') {
      const oppDate = new Date(opp.createdAt);
      const now = new Date();
      
      if (dateFilter === 'TODAY') {
        matchesDate = oppDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'YESTERDAY') {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        matchesDate = oppDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === 'THIS_WEEK') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesDate = oppDate >= oneWeekAgo;
      } else if (dateFilter === 'CUSTOM') {
        if (customStartDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          if (oppDate < start) matchesDate = false;
        }
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          if (oppDate > end) matchesDate = false;
        }
      }
    }

    return matchesStatus && matchesSearch && matchesDate;
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

  const getLogBadge = (status) => {
    switch (status) {
      case 'OK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">OK</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">WARNING</span>;
      case 'ERROR':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">ERROR</span>;
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white animate-pulse">CRITICAL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-white flex items-center gap-2.5">
            <Sparkles size={20} className="text-cyan-400" />
            <span>Opportunity Engine</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {safeOpportunities.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chasse automatisée, qualification par IA et envoi contrôlé avec validation humaine
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-white/10 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setSubTab('opportunities')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              subTab === 'opportunities'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            <span>Candidatures</span>
          </button>

          <button
            onClick={() => setSubTab('diagnostics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              subTab === 'diagnostics'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity size={14} />
            <span>Santé & Logs</span>
          </button>

          <button
            onClick={() => setSubTab('guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              subTab === 'guide'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle size={14} />
            <span>Guide Patch</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VUE 1 : CANDIDATURES ET OPPORTUNITES */}
      {/* ========================================================= */}
      {subTab === 'opportunities' && (
        <div className="flex flex-col gap-5">
          {/* Controls & Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher par poste, entreprise, pays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 focus:border-cyan-500/80 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['ALL', 'READY', 'APPROVED', 'SEND_UNKNOWN', 'SENT', 'REPLIED', 'FOLLOW_UP', 'CLOSED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    filterStatus === st
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {st === 'ALL' ? 'Toutes' : st === 'FOLLOW_UP' ? 'Relance' : st === 'REPLIED' ? '💬 Réponse' : st === 'CLOSED' ? '✓ Fermé' : st}
                </button>
              ))}

              {/* Manual refresh button */}
              <button
                onClick={handleManualRefresh}
                disabled={loading || isRefreshing}
                className="p-2 rounded-xl border transition-all ml-1 flex items-center gap-1.5"
                style={{
                  background: isRefreshing ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)',
                  border: isRefreshing ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  color: isRefreshing ? '#22d3ee' : '#94a3b8',
                }}
                title="Actualiser"
              >
                <RotateCcw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Date Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-900/40 border border-white/5 rounded-2xl text-xs">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 pl-1 mr-1">
              <Calendar size={13} className="text-cyan-400" />
              <span>Date de détection :</span>
            </span>

            {[
              { id: 'ALL', label: 'Toutes les dates' },
              { id: 'TODAY', label: "Aujourd'hui" },
              { id: 'YESTERDAY', label: 'Hier' },
              { id: 'THIS_WEEK', label: '7 derniers jours' },
              { id: 'CUSTOM', label: 'Personnalisée' }
            ].map(df => (
              <button
                key={df.id}
                onClick={() => setDateFilter(df.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  dateFilter === df.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {df.label}
              </button>
            ))}

            {dateFilter === 'CUSTOM' && (
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-cyan-500"
                  placeholder="Du"
                />
                <span className="text-slate-500 text-[11px]">au</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white outline-none focus:border-cyan-500"
                  placeholder="Au"
                />
              </div>
            )}
          </div>

          {/* Cards List */}
          <div className="flex flex-col gap-4">
            {filteredOpportunities.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-white/10 rounded-3xl text-slate-400 text-xs">
                Aucune opportunité trouvée avec ces critères.
              </div>
            ) : (
              filteredOpportunities.map((opp) => {
                const message = opp.messages?.[0];
                const contact = opp.contacts?.[0];
                const isEditing = editingMessageId === opp.id;
                const isUnknown = opp.status === 'SEND_UNKNOWN';

                return (
                  <div
                    key={opp.id}
                    className={`bg-slate-900/50 border rounded-2xl p-5 sm:p-6 transition-all shadow-xl relative overflow-hidden ${
                      isUnknown 
                        ? 'border-rose-500/40 bg-rose-950/10' 
                        : opp.status === 'READY'
                        ? 'border-cyan-500/30 hover:border-cyan-500/50'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Header Card */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/5">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {getStatusBadge(opp.status)}
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-slate-300">
                            {opp.type === 'offre' ? 'Offre directe' : 'Candidature spontanée'}
                          </span>
                          {opp.remote && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <Globe size={11} />
                              <span>100% Remote</span>
                            </span>
                          )}
                          {opp.source?.name && (
                            <span className="text-[11px] text-slate-400">
                              via <span className="text-white font-medium">{opp.source.name}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold font-['Outfit'] text-white flex items-center gap-2">
                          <span>{opp.role}</span>
                          {opp.jobUrl && (
                            <a
                              href={opp.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1.5 font-medium text-slate-200">
                            <Building2 size={13} className="text-cyan-400" />
                            {opp.company?.name || 'Entreprise non spécifiée'}
                          </span>
                          {opp.country && (
                            <span className="flex items-center gap-1">
                              <MapPin size={13} className="text-slate-500" />
                              {opp.country}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score Bento */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 min-w-[70px]">
                        <span className={`text-xl font-black font-['Outfit'] ${
                          (opp.score || 0) >= 70 ? 'text-emerald-400' : (opp.score || 0) >= 50 ? 'text-cyan-400' : 'text-amber-400'
                        }`}>
                          {opp.score || 0}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          / 100
                        </span>
                      </div>
                    </div>

                    {/* Stack Required */}
                    {opp.stackRequired && opp.stackRequired.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 py-3">
                        <span className="text-xs text-slate-400 font-semibold mr-1">Stack :</span>
                        {opp.stackRequired.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-cyan-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Contact & Message Box */}
                    <div className="mt-3 p-4 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col gap-3">
                      {contact && (
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/5 text-xs">
                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-cyan-400" />
                            <span className="font-semibold text-white">{contact.fullName || contact.role || 'Contact'}</span>
                            {contact.email && <span className="text-slate-400 font-mono">({contact.email})</span>}
                          </div>
                          {contact.emailConfidence && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-300">
                              Confiance : {contact.emailConfidence}%
                            </span>
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div>
                        <div className="flex items-center justify-between pb-1.5 mb-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={11} className="text-cyan-400" />
                            Message d'accroche ({message?.generatedBy || 'IA'}) :
                          </span>
                          {!isEditing && opp.status !== 'SENT' && (
                            <button
                              onClick={() => {
                                setEditingMessageId(opp.id);
                                setMessageDraft(message?.content || '');
                              }}
                              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                            >
                              <Edit3 size={11} />
                              <span>Modifier</span>
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              rows={5}
                              value={messageDraft}
                              onChange={(e) => setMessageDraft(e.target.value)}
                              className="w-full bg-slate-900 border border-cyan-500/50 rounded-xl p-3 text-xs text-white outline-none font-mono leading-relaxed"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => handleUpdateMessage(opp.id)}
                                disabled={actionLoadingId === opp.id}
                                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                              >
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap line-clamp-3 hover:line-clamp-none transition-all">
                            {message?.content || 'Aucun message généré.'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-white/5">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        <span>Détecté le {new Date(opp.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isUnknown && (
                          <button
                            onClick={() => handleReconcile(opp.id)}
                            disabled={actionLoadingId === opp.id}
                            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <AlertTriangle size={14} />
                            <span>Vérifier auprès de Resend</span>
                          </button>
                        )}

                        {opp.status !== 'SENT' && opp.status !== 'REJECTED' && !isUnknown && (
                          <>
                            <button
                              onClick={() => handleReject(opp.id)}
                              disabled={actionLoadingId === opp.id}
                              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                            >
                              <XCircle size={14} />
                              <span>Ignorer</span>
                            </button>

                            {opp.status === 'READY' && (
                              <button
                                onClick={() => handleApprove(opp.id)}
                                disabled={actionLoadingId === opp.id}
                                className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <CheckCircle2 size={14} />
                                <span>Approuver</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleSend(opp.id)}
                              disabled={actionLoadingId === opp.id || opp.status === 'SENDING'}
                              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                              <Send size={14} />
                              <span>Valider & Envoyer</span>
                            </button>
                          </>
                        )}

                        {opp.status === 'REJECTED' && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-medium">Ignoré</span>
                            <button
                              onClick={() => handleDelete(opp.id)}
                              disabled={actionLoadingId === opp.id}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all flex items-center gap-1.5"
                              title="Supprimer définitivement"
                            >
                              <Trash2 size={13} />
                              <span>Supprimer définitivement</span>
                            </button>
                          </div>
                        )}

                        {opp.status === 'SENT' && (
                          <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 size={16} />
                              <span>Candidature transmise</span>
                            </span>
                            {/* Reply status pills */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-slate-500 font-semibold">Suivi :</span>
                              {[
                                { status: 'REPLIED',   label: '💬 Réponse', color: '#22d3ee' },
                                { status: 'FOLLOW_UP', label: '📤 Relance', color: '#f59e0b' },
                                { status: 'CLOSED',    label: '✓ Fermer',   color: '#64748b' },
                              ].map(({ status: s, label, color }) => (
                                <button
                                  key={s}
                                  onClick={() => handleSetReplyStatus(opp.id, s)}
                                  disabled={actionLoadingId === opp.id}
                                  className="px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all"
                                  style={{
                                    background: `${color}15`,
                                    border: `1px solid ${color}35`,
                                    color,
                                  }}
                                >
                                  {label}
                                </button>
                              ))}
                              <button
                                onClick={() => handleDelete(opp.id)}
                                disabled={actionLoadingId === opp.id}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-all ml-auto"
                                title="Supprimer de l'historique"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VUE 2 : SANTE SYSTEME & LOGS */}
      {/* ========================================================= */}
      {subTab === 'diagnostics' && (
        <div className="flex flex-col gap-6">
          {/* Health Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database size={22} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Base de données</span>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                  <span>Neon PostgreSQL</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <span className="text-xs text-emerald-400 font-mono">
                  {healthData?.database?.latencyMs ? `${healthData.database.latencyMs} ms latence` : 'Connectée (OK)'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Server size={22} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Backend API</span>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                  <span>Render Free Node.js</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                </h4>
                <span className="text-xs text-cyan-400">Opérationnel (/ready OK)</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Clock size={22} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Dernier Run Pipeline</span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {healthData?.lastRun ? healthData.lastRun.status : 'Aucun run récent'}
                </h4>
                <span className="text-xs text-slate-400">
                  {healthData?.lastRun?.startedAt ? new Date(healthData.lastRun.startedAt).toLocaleString('fr-FR') : 'Prêt pour exécution'}
                </span>
              </div>
            </div>
          </div>

          {/* Sources Status Table */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold font-['Outfit'] text-white flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span>État des Sources de Scraping & Circuit Breaker</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {['Remotive', 'Jobicy', 'WeWorkRemotely', 'Himalayas', 'RemoteOK', 'CompanySites'].map((srcName) => {
                const srcObj = healthData?.sources?.find(s => s.name.toLowerCase() === srcName.toLowerCase());
                const isEnabled = srcObj ? srcObj.enabled : true;
                const failures = srcObj?.consecutiveFailures || 0;

                return (
                  <div key={srcName} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col gap-1">
                    <span className="text-xs font-bold text-white">{srcName}</span>
                    <span className={`text-[10px] font-semibold flex items-center gap-1 ${isEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {isEnabled ? 'Active' : 'Désactivée'}
                    </span>
                    {failures > 0 && (
                      <span className="text-[10px] text-amber-400">Échecs: {failures}/5</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Logs Viewer */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold font-['Outfit'] text-white flex items-center gap-2">
                <Terminal size={16} className="text-cyan-400" />
                <span>Logs Système en Direct (Neon `system_logs`)</span>
              </h3>

              {/* Filtres Logs */}
              <div className="flex items-center gap-1.5">
                {['ALL', 'CRITICAL', 'ERROR', 'WARNING', 'OK'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLogFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      logFilter === st
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
                <button
                  onClick={loadDiagnostics}
                  disabled={diagLoading}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 ml-1"
                  title="Actualiser les logs"
                >
                  <RefreshCw size={13} className={diagLoading ? 'animate-spin text-cyan-400' : ''} />
                </button>
              </div>
            </div>

            {/* Logs List */}
            <div className="flex flex-col gap-2 max-h-[450px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Aucun log enregistré avec ce filtre.
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs flex flex-col gap-1 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getLogBadge(log.status)}
                        <span className="text-cyan-300 font-bold">{log.step}</span>
                        <span className="text-slate-500 text-[11px]">{log.runId}</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">
                        {new Date(log.createdAt).toLocaleTimeString('fr-FR')} - {new Date(log.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {log.message && (
                      <p className="text-slate-300 mt-1">{log.message}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VUE 3 : GUIDE DE RESOLUTION IMMEDIATE DES ERREURS (RUNBOOK) */}
      {/* ========================================================= */}
      {subTab === 'guide' && (
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
          <div className="pb-3 border-b border-white/10">
            <h3 className="text-base font-bold font-['Outfit'] text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Guide de Patching Rapide des Erreurs</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Procédure étape par étape en cas d'alerte e-mail ou d'anomalie détectée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>1. Alerte CRITICAL — health_check</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Cause :</strong> Le serveur Render Free s'est endormi et a dépassé les 120s de réveil ou Neon a coupé.
              </p>
              <div className="p-2.5 rounded-lg bg-white/5 text-[11px] font-mono text-cyan-300">
                Ouvrir https://portfolio-server-frmx.onrender.com/ready dans le navigateur pour forcer le réveil.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>2. Alerte WARNING — gemini_failed</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Cause :</strong> Quota d'API gratuit Google AI Studio atteint temporairement.
              </p>
              <div className="p-2.5 rounded-lg bg-white/5 text-[11px] font-mono text-cyan-300">
                Aucune action requise : le moteur utilise automatiquement le template local sans bloquer.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>3. Statut Opportunité SEND_UNKNOWN</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Cause :</strong> Coupure réseau pendant l'appel à Resend API.
              </p>
              <div className="p-2.5 rounded-lg bg-white/5 text-[11px] font-mono text-cyan-300">
                Cliquer sur le bouton rouge « Vérifier auprès de Resend » dans la carte pour réconcilier en 1 clic.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <CheckCircle size={14} />
                <span>4. Source désactivée (Circuit Breaker)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Cause :</strong> Une source a échoué 5 fois de suite (maintenance ou changement de format).
              </p>
              <div className="p-2.5 rounded-lg bg-white/5 text-[11px] font-mono text-cyan-300">
                Consulter les logs ci-dessus pour inspecter l'erreur spécifique de l'adaptateur dans sources/.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
