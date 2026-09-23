import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Sparkles,
  Mail, 
  User 
} from 'lucide-react';

export default function AdminBottomNav({ activeTab, setActiveTab, unreadCount = 0 }) {
  const tabs = [
    { id: 'overview', label: 'Accueil', icon: LayoutDashboard },
    { id: 'projects', label: 'Projets', icon: FolderGit2 },
    { id: 'opportunities', label: 'Opportunités', icon: Sparkles },
    { id: 'messages', label: 'Messages', icon: Mail, count: unreadCount },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 flex justify-around items-center">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon size={18} className={isActive ? 'scale-110' : ''} />
              {tab.count !== undefined && tab.count > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {tab.count}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
