import React from 'react';
import { FolderGit2, Wrench, Mail, Database, Award, Plus, Sparkles } from 'lucide-react';
import KpiCard from '../ui/KpiCard';

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

  return (
    <div className="w-full flex flex-col gap-6">
      {/* KPI BENTO GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          title="Projets"
          value={projects.length}
          subtitle="En ligne sur le portfolio"
          icon={FolderGit2}
          iconColor="#38bdf8"
          loading={!initialLoaded}
        />

        <KpiCard
          title="Compétences"
          value={skills.length}
          subtitle="Technologies maîtrisées"
          icon={Wrench}
          iconColor="#10b981"
          loading={!initialLoaded}
        />

        <KpiCard
          title="Messages"
          value={messages.length}
          subtitle={unreadCount > 0 ? `${unreadCount} non lu(s)` : 'Tous consultés'}
          icon={Mail}
          iconColor="#a855f7"
          loading={!initialLoaded}
        />

        <KpiCard
          title="Certifications"
          value={certifications.length}
          subtitle="Validations officielles"
          icon={Award}
          iconColor="#f59e0b"
          loading={!initialLoaded}
        />
      </div>

      {/* QUICK ACTIONS PANEL */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h2 className="text-base font-bold font-['Outfit'] text-white flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            Actions Rapides
          </h2>
          <span className="text-xs text-slate-400">PostgreSQL Cloud Neon</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('projects');
              if (onOpenProjectModal) onOpenProjectModal();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Plus size={15} />
            <span>Nouveau Projet</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('skills');
              if (onOpenSkillModal) onOpenSkillModal();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Ajouter une Compétence</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('certifications');
              if (onOpenCertModal) onOpenCertModal();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Ajouter Certification</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95"
          >
            <Mail size={15} />
            <span>Boîte de Réception ({unreadCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
