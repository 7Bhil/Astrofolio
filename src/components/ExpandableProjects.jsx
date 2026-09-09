"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../hooks/use-outside-click";
import { ExternalLink, Github } from "lucide-react";
import { projectsApi } from "../services/api";

const insightCards = [
  { key: "problem", label: "Problème" },
  { key: "decision", label: "Décision technique" },
  { key: "impact", label: "Impact business" },
  { key: "solved", label: "Problème résolu" }
];

export function ExpandableProjects({ projects: initialProjects = [], labels = {}, lang = 'fr' }) {
  const [active, setActive] = useState(null);
  const [projectList, setProjectList] = useState(initialProjects);
  const id = useId();
  const ref = useRef(null);

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

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-[60]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.button
              key={"button-" + active.title + "-" + id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-6 right-6 items-center justify-center bg-white dark:bg-neutral-800 rounded-full h-10 w-10 shadow-xl z-[110]"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={"card-" + active.title + "-" + id}
              ref={ref}
              className="w-full max-w-[760px] h-fit max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <motion.div layoutId={"image-" + active.title + "-" + id}>
                <img
                  src={typeof active.image === 'string' ? active.image : (active.image?.src || active.image)}
                  alt={active.title}
                  className="w-full h-64 md:h-80 object-cover object-top"
                />
              </motion.div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex justify-between items-start gap-6 mb-6">
                  <div className="min-w-0">
                    <motion.h3
                      layoutId={"title-" + active.title + "-" + id}
                      className="font-bold text-2xl text-neutral-800 dark:text-neutral-100"
                    >
                      {active.title}
                    </motion.h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {active.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0">
                    {active.githubUrl && (
                      <motion.a
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        href={active.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:scale-110 transition-transform"
                        title="GitHub"
                      >
                        <Github size={20} />
                      </motion.a>
                    )}
                    {active.liveUrl && (
                      <motion.a
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        href={active.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                      >
                        <span>{labels.demo || "Demo"}</span>
                        <ExternalLink size={18} />
                      </motion.a>
                    )}
                  </div>
                </div>

                {active.description && (
                  <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mb-6">
                    {active.description}
                  </p>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  {insightCards.map((item) => (
                    <article key={item.key} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-neutral-500 dark:text-neutral-400">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                        {active[item.key]}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-col gap-12 lg:gap-16">
        {projectList.map((card, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <motion.div
              role="button"
              tabIndex={0}
              layoutId={"card-" + card.title + "-" + id}
              key={card.id || card.title}
              onClick={() => setActive(card)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(card);
                }
              }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-900/60 border border-neutral-800 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-950/30 transition-all duration-500 flex flex-col ${
                isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-stretch`}
            >
              {/* Image Preview Container */}
              <motion.div
                layoutId={"image-" + card.title + "-" + id}
                className="w-full lg:w-[55%] h-[260px] sm:h-[320px] lg:h-[380px] relative overflow-hidden bg-neutral-950 flex-shrink-0"
              >
                <img
                  src={typeof card.image === 'string' ? card.image : (card.image?.src || card.image)}
                  alt={card.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent lg:hidden" />
              </motion.div>

              {/* Text & Insights Container */}
              <div className="w-full lg:w-[45%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  
                  {/* Category & Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {card.tags.slice(0, 3).map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="text-[11px] font-mono tracking-wider font-semibold px-2.5 py-1 rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-800/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <motion.h3
                    layoutId={"title-" + card.title + "-" + id}
                    className="font-bold text-2xl sm:text-3xl text-neutral-100 group-hover:text-cyan-400 transition-colors tracking-tight"
                  >
                    {card.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
                    {card.description}
                  </p>

                  {/* Problem & Solution block */}
                  {card.solved && (
                    <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800/60 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyan-400/90 block">
                        Défi & Solution
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2">
                        {card.solved}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Link */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-800/50">
                  <span className="text-sm font-semibold text-cyan-400 flex items-center gap-2 group-hover:translate-x-1.5 transition-transform duration-300">
                    {labels.viewDetails || "Consulter les détails techniques"} <ExternalLink size={15} />
                  </span>
                  
                  <span className="text-xs text-neutral-500 font-mono">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-neutral-800 dark:text-neutral-200"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
