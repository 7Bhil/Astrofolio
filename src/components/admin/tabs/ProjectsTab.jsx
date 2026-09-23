import React, { useState } from 'react';
import { Plus, GripVertical, ArrowUp, ArrowDown, Edit, Trash2, ExternalLink, Github } from 'lucide-react';

export default function ProjectsTab({
  projects = [],
  onOpenModal,
  onEditProject,
  onDeleteProject,
  onReorderProjects
}) {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const items = [...sortedProjects];
    const [moved] = items.splice(draggedIdx, 1);
    items.splice(dropIndex, 0, moved);

    const reordered = items.map((p, idx) => ({ ...p, order: idx }));
    setDraggedIdx(null);
    setDragOverIdx(null);
    onReorderProjects(reordered);
  };

  const moveProject = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= sortedProjects.length) return;

    const items = [...sortedProjects];
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    const reordered = items.map((p, idx) => ({ ...p, order: idx }));
    onReorderProjects(reordered);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-white flex items-center gap-2">
            <span>Catalogue des Projets</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {projects.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Glissez-déposez les cartes ou utilisez les flèches pour modifier l'ordre d'affichage
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Projects List with Drag & Drop */}
      <div className="flex flex-col gap-2.5">
        {sortedProjects.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-white/10 rounded-2xl text-slate-400 text-xs">
            Aucun projet enregistré. Cliquez sur "Nouveau Projet" pour en créer un.
          </div>
        ) : (
          sortedProjects.map((proj, idx) => {
            const isDragging = draggedIdx === idx;
            const isOver = dragOverIdx === idx;

            return (
              <div
                key={proj.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isOver 
                    ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01]' 
                    : isDragging 
                    ? 'opacity-40 border-dashed border-cyan-500 bg-slate-900/40' 
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/30'
                }`}
              >
                {/* Left drag controls + image + content */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  {/* Drag Handle & Arrows */}
                  <div className="flex sm:flex-col items-center gap-0.5 text-slate-500 flex-shrink-0">
                    <div className="cursor-grab active:cursor-grabbing p-1 hover:text-white" title="Glisser pour réorganiser">
                      <GripVertical size={16} />
                    </div>
                    <div className="flex sm:flex-col gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveProject(idx, -1)}
                        className="text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500"
                        title="Monter"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sortedProjects.length - 1}
                        onClick={() => moveProject(idx, 1)}
                        className="text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500"
                        title="Descendre"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {proj.image ? (
                    <img
                      src={proj.image}
                      alt={proj.titleFr}
                      className="w-16 h-11 object-cover rounded-xl border border-white/10 flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-16 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-slate-500 flex-shrink-0">
                      Sans image
                    </div>
                  )}

                  {/* Title & Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        N°{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">
                        {proj.titleFr}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-semibold uppercase">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/20">
                          ⭐ Vedette
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-1">
                      {proj.descFr}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 w-full sm:w-auto justify-end">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                      title="Voir sur GitHub"
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 flex items-center justify-center transition-colors"
                      title="Voir la démo"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onEditProject(proj)}
                    className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 flex items-center justify-center transition-colors"
                    title="Modifier"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProject(proj.id)}
                    className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 flex items-center justify-center transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
