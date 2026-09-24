import React, { useState } from 'react';
import initialProspects from '../../data/prospects.json';
import { 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Search, 
  Building2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  MapPin, 
  Mail, 
  Plus, 
  X, 
  Edit3,
  Check,
  AlertCircle
} from 'lucide-react';
import { opportunitiesApi } from '../../services/api';

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
  const [sendingId, setSendingId] = useState(null);
  const [alert, setAlert] = useState(null);

  // Modal d'envoi d'e-mail
  const [emailModalData, setEmailModalData] = useState(null); // { prospect, message, subject }
  const [emailDraft, setEmailDraft] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

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
      console.error('Erreur sauvegarde localStorage', e);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = prospects.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          sentDate: newStatus === 'SENT' ? new Date().toISOString() : p.sentDate
        };
      }
      return p;
    });
    saveProspects(updated);
  };

  // Préparation du message personnalisé
  const handleOpenSendModal = (prospect) => {
    const isEn = prospect.country && !prospect.country.toLowerCase().includes('bénin') && !prospect.country.toLowerCase().includes('france') && !prospect.country.toLowerCase().includes('maurice');
    
    const subject = isEn 
      ? `Full-Stack & Mobile Developer Application — Bhilal CHITOU (${prospect.name})`
      : `Candidature Développeur Full-Stack & Mobile — Bhilal CHITOU (${prospect.name})`;

    const templateFr = `Bonjour l'équipe ${prospect.name},

Je me permets de vous contacter pour vous soumettre ma candidature en tant que Développeur Full-Stack & Mobile au sein de ${prospect.name}.

Formé en informatique et développement logiciel, je conçois et déploie des applications web et mobiles modernes (React, React Native, Node.js, Python/Django, TypeScript, PostgreSQL). Je suis notamment le créateur du langage de programmation Bhilal (compilateur transpilant vers JS) et de plusieurs projets applicatifs en production.

Pourquoi ${prospect.name} ?
${prospect.whyFit || 'Vos projets et vos standards techniques correspondent à mon profil et à ma volonté d\'apporter une réelle valeur ajoutée.'}

Je serais ravi d'échanger avec vous lors d'un court entretien pour vous présenter mon parcours et mes réalisations.

Portfolio : https://7bhil.vercel.app
GitHub : https://github.com/7Bhil
LinkedIn : https://www.linkedin.com/in/7bhil/

Bien cordialement,
Bhilal CHITOU
+229 01 44 24 29 64 • Cotonou, Bénin`;

    const templateEn = `Hi ${prospect.name} team,

I am writing to express my strong interest in joining ${prospect.name} as a Full-Stack & Mobile Developer.

With a background in computer science, I build high-performance web and mobile solutions using React, React Native, Node.js, Python/Django, TypeScript, and PostgreSQL. I am also the creator of the Bhilal programming language compiler and several production-ready platforms.

Why ${prospect.name}?
${prospect.whyFit || 'Your engineering challenges and culture strongly resonate with my skills and eagerness to contribute meaningfully.'}

I would welcome the opportunity to discuss how my hands-on background can support your upcoming milestones.

Portfolio: https://7bhil.vercel.app
GitHub: https://github.com/7Bhil
LinkedIn: https://www.linkedin.com/in/7bhil/

Best regards,
Bhilal CHITOU
+229 01 44 24 29 64`;

    setEmailSubject(subject);
    setEmailDraft(isEn ? templateEn : templateFr);
    setEmailModalData(prospect);
  };

  // Envoi réel via Resend
  const handleConfirmSendEmail = async () => {
    if (!emailModalData) return;
    setSendingId(emailModalData.id);

    try {
      await opportunitiesApi.sendToProspect({
        to: emailModalData.recipient,
        companyName: emailModalData.name,
        subject: emailSubject,
        message: emailDraft
      });

      // Mettre à jour le statut en SENT
      const updated = prospects.map(p => {
        if (p.id === emailModalData.id) {
          return {
            ...p,
            status: 'SENT',
            sentDate: new Date().toISOString()
          };
        }
        return p;
      });
      saveProspects(updated);

      showAlert('success', `E-mail envoyé avec succès à ${emailModalData.name} (${emailModalData.recipient}) via Resend !`);
      setEmailModalData(null);
    } catch (err) {
      console.error(err);
      showAlert('danger', err.message || 'Erreur lors de l\'envoi de l\'e-mail.');
    } finally {
      setSendingId(null);
    }
  };

  const handleAddProspect = (e) => {
    e.preventDefault();
    if (!newProspect.name || !newProspect.recipient) {
      showAlert('danger', 'Veuillez renseigner le nom et l\'email de contact.');
      return;
    }

    const created = {
      ...newProspect,
      id: newProspect.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now(),
      status: 'READY',
      sentDate: null
    };

    saveProspects([created, ...prospects]);
    setShowAddModal(false);
    setNewProspect({
      name: '', website: '', country: '', recipient: '',
      description: '', techStack: '', whyFit: '', notes: ''
    });
    showAlert('success', `${created.name} ajouté aux cibles CRM.`);
  };

  const stats = {
    total: prospects.length,
    sent: prospects.filter(p => p.status === 'SENT').length,
    ready: prospects.filter(p => p.status === 'READY').length,
    replied: prospects.filter(p => p.status === 'INTERVIEW').length
  };

  const filteredProspects = prospects.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(q) ||
      (p.country || '').toLowerCase().includes(q) ||
      (p.techStack || '').toLowerCase().includes(q) ||
      (p.recipient || '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-6 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Alert Notification */}
      {alert && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in duration-200 ${
          alert.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold font-['Outfit'] text-white">
              CRM Cibles & Prospection
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {stats.total} comptes cibles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chasse directe de comptes stratégiques Fintech & Web3 avec personnalisation et envoi Resend
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all active:scale-95 shrink-0"
        >
          <Plus size={15} />
          <span>Nouvelle cible</span>
        </button>
      </div>

      {/* STATS BENTO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cibles Totales</span>
            <Building2 size={16} className="text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-2">{stats.total}</div>
          <span className="text-[11px] text-slate-500">Entreprises répertoriées</span>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Envoyées</span>
            <Send size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-emerald-400 mt-2">{stats.sent}</div>
          <span className="text-[11px] text-emerald-500/80">Candidatures expédiées</span>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">À Contacter</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-amber-400 mt-2">{stats.ready}</div>
          <span className="text-[11px] text-amber-500/80">En attente de transmission</span>
        </div>

        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Entretiens</span>
            <Sparkles size={16} className="text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-['Outfit'] text-cyan-400 mt-2">{stats.replied}</div>
          <span className="text-[11px] text-cyan-500/80">Réponses positives</span>
        </div>
      </div>

      {/* FILTRES & RECHERCHE */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-2 rounded-2xl border border-white/5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Toutes', count: stats.total },
            { id: 'READY', label: 'À contacter', count: stats.ready },
            { id: 'SENT', label: 'Envoyées', count: stats.sent },
            { id: 'INTERVIEW', label: 'Entretiens', count: stats.replied }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filter === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                filter === f.id ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/10 text-slate-400'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Filtrer par entreprise, tech, pays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/70 border border-white/10 focus:border-cyan-500/60 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* LISTE DES COMPTES */}
      <div className="flex flex-col gap-3">
        {filteredProspects.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-white/10 rounded-2xl text-slate-400 text-xs">
            Aucun compte cible ne correspond à vos filtres actuels.
          </div>
        ) : (
          filteredProspects.map(prospect => {
            const isExpanded = expandedId === prospect.id;
            const isSent = prospect.status === 'SENT';

            return (
              <div
                key={prospect.id}
                className="bg-slate-900/60 hover:bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden transition-all shadow-lg"
              >
                {/* Ligne principale du compte */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : prospect.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                      {prospect.flag || '🏢'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          {prospect.name}
                        </h3>
                        {prospect.website && (
                          <a
                            href={prospect.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-400 hover:text-cyan-400 transition-colors"
                            title="Ouvrir le site officiel"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <MapPin size={10} className="text-cyan-400" />
                          {prospect.country}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <Mail size={12} className="text-slate-500" />
                        <span className="font-mono text-slate-300 text-[11px] truncate">{prospect.recipient}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Badge */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      prospect.status === 'SENT' 
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : prospect.status === 'INTERVIEW'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {prospect.status === 'SENT' && '✓ Envoyé'}
                      {prospect.status === 'READY' && '⏳ Prêt'}
                      {prospect.status === 'INTERVIEW' && '🎉 Entretien'}
                    </span>

                    {/* BOUTON ENVOI RESEND DIRECT */}
                    <button
                      type="button"
                      onClick={() => handleOpenSendModal(prospect)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Send size={13} />
                      <span>{isSent ? 'Relancer' : 'Envoyer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : prospect.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Vue détaillée dépliée */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-white/5 bg-slate-950/40 flex flex-col gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Positionnement & Activité</span>
                      <p className="text-slate-300 leading-relaxed mt-1 text-xs">{prospect.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">Stack Technique Cible</span>
                        <div className="text-slate-200 font-mono text-[11px] leading-relaxed">{prospect.techStack}</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">Angle de Valeur Ajoutée</span>
                        <div className="text-slate-300 leading-relaxed">{prospect.whyFit}</div>
                      </div>
                    </div>

                    {prospect.notes && (
                      <div className="p-3.5 rounded-xl bg-blue-500/5 border-l-2 border-cyan-500 text-slate-300">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block mb-0.5">Notes Stratégiques</span>
                        <p>{prospect.notes}</p>
                      </div>
                    )}

                    {prospect.sentDate && (
                      <div className="text-[11px] text-slate-400 font-mono">
                        Dernière transmission enregistrée le {new Date(prospect.sentDate).toLocaleString('fr-FR')}
                      </div>
                    )}

                    {/* Actions manuelles de statut */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-2">Modifier état :</span>
                      <button
                        onClick={() => handleStatusChange(prospect.id, 'SENT')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium"
                      >
                        ✓ Marquer Envoyé
                      </button>
                      <button
                        onClick={() => handleStatusChange(prospect.id, 'INTERVIEW')}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-[11px] font-medium"
                      >
                        🎉 Décroché Entretien
                      </button>
                      <button
                        onClick={() => handleStatusChange(prospect.id, 'READY')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[11px] font-medium"
                      >
                        ⏳ Remettre à contacter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL D'ENVOI DIRECT PAR E-MAIL (RESEND) */}
      {emailModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Send size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold font-['Outfit'] text-white">
                  Envoyer une candidature à {emailModalData.name}
                </h3>
              </div>
              <button onClick={() => setEmailModalData(null)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Destinataire officiel</label>
                <input
                  type="text"
                  disabled
                  value={`${emailModalData.name} <${emailModalData.recipient}>`}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Objet du courriel</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/80 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Corps du message (personnalisable)</label>
                  <span className="text-[10px] text-slate-500 font-mono">Expéditeur : candidature@7bhil.com</span>
                </div>
                <textarea
                  rows={12}
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 focus:border-cyan-500/80 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEmailModalData(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={sendingId === emailModalData.id}
                onClick={handleConfirmSendEmail}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send size={14} className={sendingId === emailModalData.id ? 'animate-pulse' : ''} />
                <span>{sendingId === emailModalData.id ? 'Envoi en cours...' : 'Confirmer et expédier l\'e-mail'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOUVELLE CIBLE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold font-['Outfit'] text-white">Ajouter un compte d'entreprise cible</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProspect} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nom de l'entreprise *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Wave, Kora, Paystack..."
                  value={newProspect.name}
                  onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email de contact *</label>
                  <input
                    type="email"
                    required
                    placeholder="careers@company.com"
                    value={newProspect.recipient}
                    onChange={(e) => setNewProspect({ ...newProspect, recipient: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500/80"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pays / Siège</label>
                  <input
                    type="text"
                    placeholder="Bénin, Sénégal, Remote..."
                    value={newProspect.country}
                    onChange={(e) => setNewProspect({ ...newProspect, country: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500/80"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Site Web Officiel</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={newProspect.website}
                  onChange={(e) => setNewProspect({ ...newProspect, website: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500/80"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Technologies / Stack</label>
                <input
                  type="text"
                  placeholder="Node.js, React, Go, PostgreSQL..."
                  value={newProspect.techStack}
                  onChange={(e) => setNewProspect({ ...newProspect, techStack: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-500/80"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description & Activité</label>
                <textarea
                  rows={2}
                  placeholder="En quelques mots, ce que fait l'entreprise..."
                  value={newProspect.description}
                  onChange={(e) => setNewProspect({ ...newProspect, description: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500/80"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20"
                >
                  Enregistrer la cible
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
