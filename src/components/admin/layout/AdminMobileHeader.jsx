import React from 'react';
import { RefreshCw, Globe, LogOut } from 'lucide-react';

export default function AdminMobileHeader({ onRefresh, isSyncing, onLogout }) {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
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
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          title="Voir le site"
        >
          <Globe size={15} />
        </a>

        <button 
          onClick={onRefresh}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          title="Actualiser"
        >
          <RefreshCw size={15} className={isSyncing ? 'animate-spin text-cyan-400' : ''} />
        </button>

        <button 
          onClick={onLogout}
          className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-colors"
          title="Déconnexion"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
