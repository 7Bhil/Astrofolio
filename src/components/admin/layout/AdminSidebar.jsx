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
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  counts = {}, 
  onLogout 
}) {
  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'projects', label: 'Projets', icon: FolderGit2, count: counts.projects },
    { id: 'skills', label: 'Compétences', icon: Wrench, count: counts.skills },
    { id: 'experiences', label: 'Parcours', icon: Briefcase, count: counts.experiences },
    { id: 'certifications', label: 'Certifications', icon: Award, count: counts.certifications },
    { id: 'messages', label: 'Messages', icon: Mail, count: counts.unreadMessages, isBadgeAlert: counts.unreadMessages > 0 },
    { id: 'opportunities', label: 'Opportunités IA', icon: Sparkles, count: counts.opportunities, isBadgeAlert: counts.opportunities > 0 },
    { id: 'prospects', label: 'CRM Prospects', icon: Building2, count: counts.prospects },
    { id: 'security', label: 'Sécurité & Accès', icon: ShieldCheck }
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-slate-950/80 border-r border-white/10 flex-col sticky top-0 h-screen p-4 z-40 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black font-['Outfit'] text-white text-base shadow-lg shadow-blue-500/25">
          7B
        </div>
        <div>
          <h1 className="text-sm font-bold font-['Outfit'] text-white tracking-tight">
            Studio Admin
          </h1>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Neon PostgreSQL
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon 
                size={16} 
                className={isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'} 
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  item.isBadgeAlert 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    : 'bg-white/10 text-slate-300'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer User & Logout */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Administrateur</span>
          <span className="text-xs text-white font-semibold truncate block mt-0.5">
            {user?.email || 'admin@7bhil.com'}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
        >
          <LogOut size={14} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
