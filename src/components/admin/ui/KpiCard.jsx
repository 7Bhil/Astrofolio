import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, iconColor = '#38bdf8', loading = false }) {
  return (
    <div className="relative overflow-hidden bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-lg hover:shadow-cyan-500/5 transition-all group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div 
            className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
            style={{ color: iconColor }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white flex items-center">
          {loading ? (
            <span className="inline-block w-12 h-7 bg-white/10 rounded-lg animate-pulse" />
          ) : (
            value
          )}
        </div>
        {subtitle && (
          <span className="text-xs font-medium text-cyan-400 mt-1 block">
            {subtitle}
          </span>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
