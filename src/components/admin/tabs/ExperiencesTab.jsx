import React from 'react';
import { Plus, Edit, Trash2, Briefcase, GraduationCap } from 'lucide-react';

export default function ExperiencesTab({
  experiences = [],
  onOpenModal,
  onEditExp,
  onDeleteExp
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
            <span>Parcours & Formations</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {experiences.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Historique professionnel et diplômes universitaires
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Nouvelle Entrée</span>
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {experiences.map((exp) => {
          const isEducation = exp.type === 'education';
          const Icon = isEducation ? GraduationCap : Briefcase;

          return (
            <div
              key={exp.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                  isEducation 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  <Icon size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white truncate">
                      {exp.roleFr}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      isEducation 
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' 
                        : 'bg-blue-500/15 text-blue-300 border-blue-500/20'
                    }`}>
                      {isEducation ? 'Diplôme' : 'Expérience'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5">
                    <strong className="text-slate-300">{exp.companyFr}</strong>
                    {exp.dateFr && ` • ${exp.dateFr}`}
                  </p>
                  {exp.descFr && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {exp.descFr}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onEditExp(exp)}
                  className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 flex items-center justify-center transition-colors"
                  title="Modifier"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteExp(exp.id)}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 flex items-center justify-center transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
