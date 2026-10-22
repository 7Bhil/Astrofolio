"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../hooks/use-outside-click";
import { ExternalLink, Github, ArrowUpRight, Sparkles, LayoutList, GalleryHorizontalEnd } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsApi } from "../services/api";
import { ProjectList, ProjectsHorizontal } from "./ProjectsShowcase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ExpandableProjects({ 
  projects: initialProjects = [], 
  categories = {}, 
  labels = {}, 
  lang = 'fr' 
}) {
  const [active, setActive] = useState(null);
  const [projectList, setProjectList] = useState(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [view, setView] = useState("list");
  const id = useId();
  const ref = useRef(null);

  const categoryEntries = useMemo(() => {
    return Object.entries(categories || {});
  }, [categories]);

  const insightCards = [
    { key: "problem", label: lang === 'en' ? "Problem & Context" : "Contexte & Problème" },
    { key: "decision", label: lang === 'en' ? "Architecture & Stack" : "Architecture & Choix techniques" },
    { key: "impact", label: lang === 'en' ? "Measurable Impact" : "Impact & Résultats mesurés" },
    { key: "solved", label: lang === 'en' ? "Key Value Delivered" : "Valeur clé délivrée" }
  ];

  useEffect(() => {
    async function loadDynamicProjects() {
      try {
        const data = await projectsApi.getAll();
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
          const formatted = sorted.map((p) => {
            const isEn = lang === 'en';
            return {
              id: p.id,
              category: p.category?.toLowerCase() || 'web',
              categoryLabel: p.category ? p.category.toUpperCase() : 'Web',
              metric: isEn ? (p.metricEn || 'Production Ready') : (p.metricFr || 'Prêt pour la production'),
              title: (isEn ? p.titleEn : p.titleFr) || p.titleFr || p.slug,
              description: (isEn ? p.descEn : p.descFr) || p.descFr || '',
              problem: (isEn ? p.problemEn : p.problemFr) || (isEn ? p.descEn : p.descFr) || '',
              decision: (isEn ? p.decisionEn : p.decisionFr) || (isEn ? "Technical Architecture" : "Architecture & Choix techniques"),
              impact: (isEn ? p.impactEn : p.impactFr) || (isEn ? "High impact solution" : "Solution à fort impact"),
              solved: (isEn ? p.solvedEn : p.solvedFr) || (isEn ? p.descEn : p.descFr) || '',
              tags: p.category ? [p.category.toUpperCase(), 'Full-Stack'] : ['Web'],
              image: p.image || '/pro.webp',
              githubUrl: p.githubUrl || null,
              liveUrl: p.demoUrl || null,
              order: p.order || 0
            };
          });
          setProjectList(formatted);
        }
      } catch (err) {
        console.warn("Using fallback static projects:", err);
      }
    }
    loadDynamicProjects();
  }, [lang]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const filteredProjects = useMemo(
    () => (selectedCategory === "all" ? projectList : projectList.filter((p) => p.category === selectedCategory)),
    [projectList, selectedCategory]
  );

  // Refresh ScrollTrigger when switching view or category
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [view, selectedCategory]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
  };

  const handleSelectView = (newView) => {
    if (newView === view) return;
    setView(newView);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  return (
    <>
      {/* Category filter pills */}
      {categoryEntries.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {categoryEntries.map(([key, label]) => {
            const isSelected = selectedCategory === key;
            const count = key === "all" 
              ? projectList.length 
              : projectList.filter(p => p.category === key).length;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectCategory(key)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-950/40"
                    : "bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700"
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-cyan-400/20 text-cyan-200" : "bg-neutral-800 text-neutral-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal Detail view */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md h-full w-full z-[9999]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[10000] p-4 sm:p-6">
            <motion.button
              key={"button-" + active.title + "-" + id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex absolute top-4 right-4 sm:top-6 sm:right-6 items-center justify-center bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-full h-11 w-11 shadow-2xl z-[10001] transition-colors"
              onClick={() => setActive(null)}
              aria-label="Fermer"
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={"card-" + active.title + "-" + id}
              ref={ref}
              className="w-full max-w-[820px] h-fit max-h-[92vh] flex flex-col bg-neutral-950 text-neutral-100 rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30"
            >
              {/* Modal Image Header with Browser frame */}
              <div className="relative overflow-hidden bg-neutral-900 border-b border-neutral-800 flex-shrink-0">
                <motion.div layoutId={"image-" + active.title + "-" + id}>
                  <img
                    src={typeof active.image === 'string' ? active.image : (active.image?.src || active.image)}
                    alt={active.title}
                    className="w-full h-56 sm:h-72 object-cover object-top"
                  />
                </motion.div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    {active.metric && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 mb-3">
                        {active.metric}
                      </span>
                    )}
                    <motion.h3
                      layoutId={"title-" + active.title + "-" + id}
                      className="font-extrabold text-2xl sm:text-3xl text-neutral-100 tracking-tight"
                    >
                      {active.title}
                    </motion.h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {active.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs font-mono rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-800/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                    {active.githubUrl && (
                      <a
                        href={active.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:scale-105 transition-all"
                        title={labels.sourceCode || "Code source"}
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {active.liveUrl && (
                      <a
                        href={active.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 hover:scale-105"
                      >
                        <span>{labels.demo || "Démo en direct"}</span>
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                {active.description && (
                  <p className="text-neutral-300 text-base leading-relaxed border-l-2 border-cyan-500/50 pl-4 py-1">
                    {active.description}
                  </p>
                )}

                {/* Case study grid */}
                <div className="grid gap-3.5 sm:grid-cols-2 pt-2">
                  {insightCards.map((item) => (
                    active[item.key] ? (
                      <article 
                        key={item.key} 
                        className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 hover:border-neutral-700 transition-colors"
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-400 flex items-center gap-1.5">
                          <Sparkles size={13} className="text-cyan-400" />
                          {item.label}
                        </p>
                        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-neutral-200">
                          {active[item.key]}
                        </p>
                      </article>
                    ) : null
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* View switch */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full border border-neutral-800 bg-neutral-900/60 p-1 text-xs font-mono backdrop-blur-sm">
          {[
            { key: "list", label: lang === "en" ? "Index" : "Index", icon: LayoutList },
            { key: "scroll", label: lang === "en" ? "Gallery" : "Galerie", icon: GalleryHorizontalEnd },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectView(key)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                view === key
                  ? "bg-neutral-100 text-neutral-950 font-semibold shadow-md"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <ProjectList key={"l-" + selectedCategory} projects={filteredProjects} onSelect={setActive} lang={lang} />
      ) : (
        <ProjectsHorizontal key={"h-" + selectedCategory} projects={filteredProjects} onSelect={setActive} lang={lang} />
      )}
    </>
  );
}

const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
};
