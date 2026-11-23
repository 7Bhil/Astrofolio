import React, { useState, useEffect } from 'react';
import { FolderGit2, Wrench, Mail, Award, Plus, Sparkles, Briefcase, TrendingUp, Clock, Activity, BarChart2 } from 'lucide-react';
import KpiCard from '../ui/KpiCard';
import { opportunitiesApi } from '../../../services/api';

// ── CSS Activity Bar Chart ───────────────────────────────────
function ActivityChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.created), 1);
  return (
    <div className="flex items-end gap-1.5 h-20 w-full">
      {data.map((d, i) => {
        const height = Math.max((d.created / maxVal) * 100, d.created > 0 ? 8 : 3);
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1 group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
              <div className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-semibold whitespace-nowrap shadow-xl">
                {d.created} trouvée{d.created !== 1 ? 's' : ''}
                {d.sent > 0 && <span className="text-cyan-400 ml-1">· {d.sent} envoyée{d.sent !== 1 ? 's' : ''}</span>}
              </div>
              <div className="w-2 h-2 bg-slate-800 border-r border-b border-white/10 rotate-45 -mt-1" />
            </div>
            {/* Bar */}
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${height}%`,
                background: d.created > 0
                  ? 'linear-gradient(180deg, #38bdf8, #2563eb)'
                  : 'rgba(255,255,255,0.06)',
                boxShadow: d.created > 0 ? '0 0 8px rgba(56,189,248,0.3)' : 'none',
                minHeight: '3px',
              }}
            />
            <span className="text-[9px] text-slate-500 capitalize truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Bonne nuit';
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

function getDate() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function OverviewTab({ 
  projects = [], 
  skills = [], 
  messages = [], 
  experiences = [],
  certifications = [],
  initialLoaded = false, 
  setActiveTab,
  onOpenProjectModal,
  onOpenSkillModal,
  onOpenCertModal
}) {
  const unreadCount = messages.filter(m => !m.read).length;

  // ── Activity data ─────────────────────────────────────────
  const [activityData, setActivityData] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    opportunitiesApi.getActivityData()
      .then(data => setActivityData(data))
      .catch(() => {
        // Fallback placeholder on error
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days.push({ label: d.toLocaleDateString('fr-FR', { weekday: 'short' }), created: 0, sent: 0 });
        }
        setActivityData(days);
      })
      .finally(() => setActivityLoading(false));
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ── Greeting Header ─────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(6,182,212,0.08) 60%, rgba(124,58,237,0.1) 100%)',
          border: '1px solid rgba(6,182,212,0.15)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl" />

        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-semibold text-cyan-400/70 uppercase tracking-widest mb-1">
              {getDate()}
            </p>
            <h2 className="text-2xl font-extrabold font-['Outfit'] text-white">
              {getGreeting()}, Bhilal 👋
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Bienvenue dans ton espace admin. Tout est opérationnel.
            </p>
          </div>

          {/* Live badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full self-start"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="text-[11px] font-bold text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      {/* ── KPI Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Projets"
          value={projects.length}
          subtitle="En ligne sur le portfolio"
          icon={FolderGit2}
          iconColor="#38bdf8"
          glowColor="rgba(56,189,248,0.2)"
          loading={!initialLoaded}
        />
        <KpiCard
          title="Compétences"
          value={skills.length}
          subtitle="Technologies maîtrisées"
          icon={Wrench}
          iconColor="#10b981"
          glowColor="rgba(16,185,129,0.2)"
          loading={!initialLoaded}
        />
        <KpiCard
          title="Messages"
          value={messages.length}
          subtitle={unreadCount > 0 ? `${unreadCount} non lu(s) ⚡` : 'Tous consultés'}
          icon={Mail}
          iconColor="#a855f7"
          glowColor="rgba(168,85,247,0.2)"
          loading={!initialLoaded}
        />
        <KpiCard
          title="Certifications"
          value={certifications.length}
          subtitle="Validations officielles"
          icon={Award}
          iconColor="#f59e0b"
          glowColor="rgba(245,158,11,0.2)"
          loading={!initialLoaded}
        />
      </div>

      {/* ── Secondary KPIs ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
        <KpiCard
          title="Expériences"
          value={experiences.length}
          subtitle="Postes & formations"
          icon={Briefcase}
          iconColor="#f97316"
          glowColor="rgba(249,115,22,0.2)"
          loading={!initialLoaded}
        />
        <KpiCard
          title="Activité Pipeline"
          value={0}
          subtitle="Opportunités en attente"
          icon={Activity}
          iconColor="#ec4899"
          glowColor="rgba(236,72,153,0.2)"
          loading={!initialLoaded}
        />
      </div>

      {/* ── Bottom Row: Actions + Activity ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(15,23,42,0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-cyan-400" />
            <h3 className="text-sm font-bold font-['Outfit'] text-white">Actions Rapides</h3>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('projects'); if (onOpenProjectModal) onOpenProjectModal(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(90deg, #2563eb, #06b6d4)', boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
            >
              <Plus size={15} />
              Nouveau Projet
            </button>

            <button
              onClick={() => { setActiveTab('skills'); if (onOpenSkillModal) onOpenSkillModal(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Plus size={15} />
              Ajouter une Compétence
            </button>

            <button
              onClick={() => { setActiveTab('certifications'); if (onOpenCertModal) onOpenCertModal(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Plus size={15} />
              Ajouter une Certification
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all active:scale-95 relative"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Mail size={15} />
              Boîte de Réception
              {unreadCount > 0 && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(15,23,42,0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-violet-400" />
            <h3 className="text-sm font-bold font-['Outfit'] text-white">Statut du Portfolio</h3>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: 'Pipeline IA', status: 'Actif', color: '#10b981', desc: 'Exécution 08h00 & 20h00' },
              { label: 'Base de données', status: 'Connectée', color: '#10b981', desc: 'Neon PostgreSQL · pooler' },
              { label: 'Site en ligne', status: 'Live', color: '#10b981', desc: '7bhil.vercel.app' },
              { label: 'API Backend', status: 'Opérationnel', color: '#38bdf8', desc: 'Render · portfolio-server' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{item.label}</span>
                    <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px my-4 bg-white/5" />

          <div className="flex items-center gap-2">
            <Clock size={11} className="text-slate-500" />
            <span className="text-[10px] text-slate-500">
              Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Activity Graph ─────────────────────────────────── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={15} className="text-cyan-400" />
            <h3 className="text-sm font-bold font-['Outfit'] text-white">Activité Pipeline — 7 derniers jours</h3>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#38bdf8' }} />Trouvées
          </span>
        </div>
        {activityLoading ? (
          <div className="h-20 flex items-center justify-center">
            <span className="text-xs text-slate-500 animate-pulse">Chargement...</span>
          </div>
        ) : activityData.length === 0 || activityData.every(d => d.created === 0) ? (
          <div className="h-20 flex items-center justify-center">
            <span className="text-xs text-slate-500">Aucune activité cette semaine</span>
          </div>
        ) : (
          <ActivityChart data={activityData} />
        )}
      </div>
    </div>
  );
}
