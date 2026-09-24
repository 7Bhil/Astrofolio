import React from 'react';
import { LayoutDashboard, FolderGit2, Sparkles, Mail, User } from 'lucide-react';

export default function AdminBottomNav({ activeTab, setActiveTab, unreadCount = 0 }) {
  const tabs = [
    { id: 'overview',       label: 'Accueil',      icon: LayoutDashboard },
    { id: 'projects',       label: 'Projets',      icon: FolderGit2 },
    { id: 'opportunities',  label: 'Opps',         icon: Sparkles },
    { id: 'messages',       label: 'Messages',     icon: Mail, count: unreadCount },
    { id: 'profile',        label: 'Profil',       icon: User },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-2 flex justify-around items-center"
      style={{
        background: 'rgba(3,7,15,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            type="button"
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab(tab.id);
            }}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative touch-manipulation cursor-pointer active:scale-95 select-none"
            style={isActive ? {
              background: 'rgba(6,182,212,0.12)',
            } : {}}
          >
            {/* Active top indicator */}
            {isActive && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full"
                style={{ background: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.8)' }}
              />
            )}

            <div className="relative">
              <Icon
                size={isActive ? 20 : 18}
                style={{
                  color: isActive ? '#22d3ee' : '#64748b',
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(34,211,238,0.6))' : 'none',
                  transition: 'all 0.2s',
                }}
              />
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className="absolute -top-1.5 -right-2.5 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
                  style={{ background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.6)' }}
                >
                  {tab.count}
                </span>
              )}
            </div>

            <span
              className="text-[10px] mt-1 font-semibold"
              style={{ color: isActive ? '#22d3ee' : '#64748b' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
