import React from 'react';
import { Mail, CheckCircle, Trash2, Calendar, Clock, User } from 'lucide-react';

export default function MessagesTab({
  messages = [],
  onMarkRead,
  onDeleteMessage
}) {
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
            <span>Boîte de Réception</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {messages.length} Total
            </span>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20 font-bold animate-pulse">
                {unreadCount} non lu(s)
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Messages envoyés depuis le formulaire de contact du portfolio
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-white/10 rounded-2xl text-slate-400 text-xs">
            Aucun message reçu pour le moment.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                msg.read
                  ? 'bg-slate-900/40 border-white/5 opacity-80'
                  : 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    msg.read ? 'bg-white/5 text-slate-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white'
                  }`}>
                    {msg.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block leading-tight">
                      {msg.name}
                    </span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock size={12} />
                  <span>{new Date(msg.createdAt).toLocaleString('fr-FR')}</span>
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-1" />
                  )}
                </div>
              </div>

              {msg.subject && (
                <div className="text-xs font-bold text-slate-200 mb-2">
                  Objet : <span className="text-cyan-300 font-normal">{msg.subject}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-white/5 whitespace-pre-wrap">
                {msg.message}
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 mt-2">
                <button
                  type="button"
                  onClick={() => onMarkRead(msg.id, !msg.read)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle size={13} />
                  <span>{msg.read ? 'Marquer non lu' : 'Marquer comme lu'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteMessage(msg.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-rose-500/20"
                >
                  <Trash2 size={13} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
