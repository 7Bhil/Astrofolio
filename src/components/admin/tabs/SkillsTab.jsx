import React from 'react';
import { Plus, Edit, Trash2, Code2 } from 'lucide-react';

export default function SkillsTab({
  skills = [],
  onOpenModal,
  onEditSkill,
  onDeleteSkill
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
            <span>Stack & Compétences</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {skills.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gérez les technologies et les jauges de maîtrise affichées sur votre vitrine
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Nouvelle Compétence</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white truncate">
                {skill.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-medium">
                  {skill.category}
                </span>
                <span className="text-xs font-bold text-cyan-400 font-['Outfit']">
                  {skill.level || 90}%
                </span>
              </div>

              {/* Mini progress bar */}
              <div className="w-full bg-slate-950 rounded-full h-1 mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                  style={{ width: `${skill.level || 90}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => onEditSkill(skill)}
                className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 flex items-center justify-center transition-colors"
                title="Modifier"
              >
                <Edit size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDeleteSkill(skill.id)}
                className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 flex items-center justify-center transition-colors"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
