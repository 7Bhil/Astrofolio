import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Wrench, 
  Briefcase, 
  Award, 
  Mail, 
  Sparkles,
  Building2, 
  User, 
  LogOut,
  Globe,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview',       label: "Vue d'ensemble", icon: LayoutDashboard, group: 'main' },
  { id: 'projects',       label: 'Projets',         icon: FolderGit2,     group: 'content' },
  { id: 'skills',         label: 'Compétences',     icon: Wrench,         group: 'content' },
  { id: 'experiences',    label: 'Parcours',        icon: Briefcase,      group: 'content' },
  { id: 'certifications', label: 'Certifications',  icon: Award,          group: 'content' },
  { id: 'messages',       label: 'Messages',        icon: Mail,           group: 'comms' },
  { id: 'opportunities',  label: 'Opportunités IA', icon: Sparkles,       group: 'comms' },
  { id: 'prospects',      label: 'CRM Prospects',   icon: Building2,      group: 'comms' },
  { id: 'profile',        label: 'Mon Profil',      icon: User,           group: 'account' },
];

const GROUP_LABELS = {
  main: null,
  content: 'Contenu',
  comms: 'Communications',
  account: 'Compte',
};

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  counts = {}, 
  onLogout 
}) {
  const countMap = {
    projects:       counts.projects,
    skills:         counts.skills,
    experiences:    counts.experiences,
    certifications: counts.certifications,
    messages:       counts.unreadMessages,
    opportunities:  counts.opportunities,
    prospects:      counts.prospects,
  };
  const alertMap = {
    messages:      (counts.unreadMessages || 0) > 0,
    opportunities: (counts.opportunities || 0) > 0,
  };

  // Group nav items
  const groups = ['main', 'content', 'comms', 'account'];

  return (
    <aside
      className="hidden lg:flex w-64 flex-col sticky top-0 h-screen z-40 select-none"
      style={{
        background: 'rgba(5,8,22,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Subtle top-edge gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Brand Header */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3.5 mb-1">
          {/* Logo badge */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black font-['Outfit'] text-white text-lg relative overflow-hidden shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
              boxShadow: '0 0 24px rgba(6,182,212,0.35)',
            }}
          >
            <span className="relative z-10">7B</span>
            <div className="absolute inset-0 bg-white/10 rounded-2xl" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold font-['Outfit'] text-white tracking-tight">
              Studio Admin
            </h1>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-cyan-400/70 hover:text-cyan-300 flex items-center gap-1 transition-colors mt-0.5"
            >
              <Globe size={10} />
              7bhil.vercel.app
            </a>
          </div>
        </div>

        {/* DB status pill */}
        <div
          className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] font-semibold text-emerald-400 tracking-wide">Neon PostgreSQL · Live</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 flex flex-col gap-0.5">
        {groups.map((group) => {
          const items = NAV_ITEMS.filter(i => i.group === group);
          const label = GROUP_LABELS[group];
          return (
            <div key={group} className="mb-2">
              {label && (
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] px-3 mb-1.5">
                  {label}
                </p>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const count = countMap[item.id];
                const isAlert = alertMap[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group/item relative"
                    style={isActive ? {
                      background: 'linear-gradient(90deg, rgba(37,99,235,0.2) 0%, rgba(6,182,212,0.08) 100%)',
                      border: '1px solid rgba(6,182,212,0.25)',
                      color: '#67e8f9',
                    } : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: '#94a3b8',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = '#e2e8f0';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#94a3b8';
                      }
                    }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    )}

                    <Icon
                      size={15}
                      style={{ color: isActive ? '#22d3ee' : 'currentColor', flexShrink: 0 }}
                    />
                    <span className="flex-1 text-left truncate">{item.label}</span>

                    {count !== undefined && count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold tabular-nums ${
                          isAlert
                            ? 'animate-pulse'
                            : ''
                        }`}
                        style={isAlert ? {
                          background: 'rgba(245,158,11,0.15)',
                          color: '#fcd34d',
                          border: '1px solid rgba(245,158,11,0.3)',
                        } : {
                          background: 'rgba(255,255,255,0.08)',
                          color: '#94a3b8',
                        }}
                      >
                        {count}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight size={12} className="text-cyan-500/50" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Footer */}
      <div className="px-4 py-4 flex flex-col gap-2">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Avatar initials */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          >
            BC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-white truncate">Bhilal CHITOU</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || '7bhilal.chitou7@gmail.com'}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#fca5a5',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
        >
          <LogOut size={13} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
