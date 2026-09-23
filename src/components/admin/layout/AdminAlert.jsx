import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminAlert({ alert }) {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';

  return (
    <div className={`p-3.5 sm:p-4 rounded-xl border mb-6 flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all animate-in slide-in-from-top-2 duration-200 ${
      isSuccess 
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    }`}>
      {isSuccess ? <CheckCircle2 size={18} className="flex-shrink-0" /> : <AlertCircle size={18} className="flex-shrink-0" />}
      <span>{alert.message}</span>
    </div>
  );
}
