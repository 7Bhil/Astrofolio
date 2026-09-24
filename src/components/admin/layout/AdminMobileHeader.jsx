import React, { useState } from 'react';
import { 
  Menu, X, Globe, 
  LayoutDashboard, FolderGit2, Wrench, Briefcase, Award, Mail, Sparkles, Building2, User, LogOut,
  ChevronRight
} from 'lucide-react';

export default function AdminMobileHeader({ activeTab, setActiveTab, user, counts = {}, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'overview',       label: "Vue d'ensemble", icon: LayoutDashboard, group: 'main' },
    { id: 'projects',       label: 'Projets',         icon: FolderGit2,     group: 'content', count: counts.projects },
    { id: 'skills',         label: 'Compétences',     icon: Wrench,         group: 'content', count: counts.skills },
    { id: 'experiences',    label: 'Parcours',        icon: Briefcase,      group: 'content', count: counts.experiences },
    { id: 'certifications', label: 'Certifications',  icon: Award,          group: 'content', count: counts.certifications },
    { id: 'messages',       label: 'Messages',        icon: Mail,           group: 'comms',   count: counts.unreadMessages, isBadgeAlert: counts.unreadMessages > 0 },
    { id: 'opportunities',  label: 'Opportunités IA', icon: Sparkles,       group: 'comms',   count: counts.opportunities, isBadgeAlert: counts.opportunities > 0 },
    { id: 'prospects',      label: 'CRM Prospects',   icon: Building2,      group: 'comms',   count: counts.prospects },
    { id: 'profile',        label: 'Mon Profil',      icon: User,           group: 'account' },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  const tabLabel = navItems.find(i => i.id === activeTab)?.label || 'Admin';

  return (
    <>
      {/* ── Sticky mobile topbar ── */}
      <header
        className="lg:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-2xl"
        style={{
          background: 'rgba(3,7,15,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black font-['Outfit'] text-white text-sm"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
              boxShadow: '0 0 16px rgba(6,182,212,0.4)',
            }}
          >
            7B
          </div>
          <div>
            <h2 className="text-sm font-bold font-['Outfit'] text-white leading-tight">Studio Admin</h2>
            <span className="text-[10px] font-semibold text-slate-500">{tabLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-slate-400 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            title="Voir le site"
          >
            <Globe size={15} />
          </a>

          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{
              background: isOpen ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.25)',
              color: '#67e8f9',
            }}
            aria-label="Menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ── Bottom sheet drawer ── */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto"
            style={{
              background: 'rgba(5,10,25,0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderBottom: 'none',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />

            {/* Drawer header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black font-['Outfit'] text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', boxShadow: '0 0 16px rgba(6,182,212,0.3)' }}
                >
                  7B
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Bhilal CHITOU</p>
                  <p className="text-[10px] text-slate-500">{user?.email || '7bhilal.chitou7@gmail.com'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav */}
            <div className="flex flex-col gap-0.5 py-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all"
                    style={isActive ? {
                      background: 'linear-gradient(90deg, rgba(37,99,235,0.2) 0%, rgba(6,182,212,0.08) 100%)',
                      border: '1px solid rgba(6,182,212,0.25)',
                      color: '#67e8f9',
                    } : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: '#94a3b8',
                    }}
                  >
                    <Icon size={16} style={{ color: isActive ? '#22d3ee' : 'currentColor' }} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${item.isBadgeAlert ? 'animate-pulse' : ''}`}
                        style={item.isBadgeAlert ? {
                          background: 'rgba(245,158,11,0.15)',
                          color: '#fcd34d',
                          border: '1px solid rgba(245,158,11,0.3)',
                        } : {
                          background: 'rgba(255,255,255,0.08)',
                          color: '#94a3b8',
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                    {isActive && <ChevronRight size={13} className="text-cyan-500/50" />}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            {onLogout && (
              <div className="pt-3 mt-2 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); onLogout(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#fca5a5',
                  }}
                >
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
