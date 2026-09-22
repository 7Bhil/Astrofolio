import React from 'react';
import { Plus, Edit, Trash2, Award, ExternalLink } from 'lucide-react';

export default function CertificationsTab({
  certifications = [],
  onOpenModal,
  onEditCert,
  onDeleteCert
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
            <span>Certifications & Diplômes</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {certifications.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Badges, accréditations et certifications officielles
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Nouvelle Certification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {certifications.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-slate-900/40 border border-white/10 rounded-2xl text-slate-400 text-xs">
            Aucune certification enregistrée. Cliquez sur "Nouvelle Certification" pour en ajouter une.
          </div>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-amber-500/30 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-12 h-12 object-contain rounded-xl p-1 bg-white/5 border border-white/10 flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Award size={22} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    <span className="text-amber-300 font-semibold">{cert.issuer}</span>
                    {cert.date && ` • ${cert.date}`}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors mt-1"
                    >
                      <span>Vérifier l'authenticité</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEditCert(cert)}
                  className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 flex items-center justify-center transition-colors"
                  title="Modifier"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteCert(cert.id)}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 flex items-center justify-center transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
