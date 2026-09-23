import React from 'react';

export function Input({ label, error, helperText, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && (
        <label className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition-all ${className}`}
        {...props}
      />
      {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
      {error && <span className="text-[11px] text-rose-400 font-medium">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, helperText, className = '', rows = 3, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && (
        <label className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full bg-slate-950/80 border border-white/10 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none transition-all resize-y ${className}`}
        {...props}
      />
      {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
      {error && <span className="text-[11px] text-rose-400 font-medium">{error}</span>}
    </div>
  );
}

export function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && (
        <label className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-slate-950 border border-white/10 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 rounded-xl px-3.5 py-2 text-sm text-white outline-none transition-all ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] text-rose-400 font-medium">{error}</span>}
    </div>
  );
}
