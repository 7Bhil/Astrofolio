import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Globe, 
  LayoutDashboard, 
  FolderGit2, 
  Wrench, 
  Briefcase, 
  Award, 
  Mail, 
  Sparkles, 
  Building2, 
  User, 
  LogOut 
} from 'lucide-react';

export default function AdminMobileHeader({ 
  activeTab, 
  setActiveTab, 
  user, 
  counts = {}, 
  onLogout 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'projects', label: 'Projets', icon: FolderGit2, count: counts.projects },
    { id: 'skills', label: 'Compétences', icon: Wrench, count: counts.skills },
    { id: 'experiences', label: 'Parcours', icon: Briefcase, count: counts.experiences },
    { id: 'certifications', label: 'Certifications', icon: Award, count: counts.certifications },
    { id: 'messages', label: 'Messages', icon: Mail, count: counts.unreadMessages, isBadgeAlert: counts.unreadMessages > 0 },
    { id: 'opportunities', label: 'Opportunités IA', icon: Sparkles, count: counts.opportunities, isBadgeAlert: counts.opportunities > 0 },
    { id: 'prospects', label: 'CRM Prospects', icon: Building2, count: counts.prospects },
    { id: 'profile', label: 'Mon Profil', icon: User }
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black font-['Outfit'] text-white text-sm shadow-md shadow-blue-500/20">
            7B
          </div>
          <div>
            <h2 className="text-sm font-bold font-['Outfit'] text-white leading-tight">
              Studio Admin
            </h2>
            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neon PostgreSQL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Voir le site"
          >
            <Globe size={16} />
          </a>

          {/* Bouton Hamburger */}
          <button 
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 flex items-center justify-center transition-colors"
            title="Menu"
            aria-label="Menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Drawer / Menu mobile coulissant */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full bg-slate-900 border-t border-white/15 rounded-t-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black font-['Outfit'] text-white text-xs">
                  7B
                </div>
                <div>
                  <h3 className="text-sm font-bold font-['Outfit'] text-white">Menu Navigation</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{user?.email || 'admin@7bhil.com'}</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Liste de navigation complète */}
            <div className="flex flex-col gap-1 py-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
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
            </div>

            {/* Pied de drawer avec déconnexion */}
            {onLogout && (
              <div className="pt-3 mt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
                >
                  <LogOut size={14} />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
