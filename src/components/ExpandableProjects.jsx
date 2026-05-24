"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../hooks/use-outside-click";
import { ExternalLink, Github } from 'lucide-react';

export function ExpandableProjects({ projects }) {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
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
              key={`button-${active.title}-${id}`}
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
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[600px] h-fit max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  src={active.image.src || active.image}
                  alt={active.title}
                  className="w-full h-64 md:h-80 object-cover object-top"
                />
              </motion.div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
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

                  <div className="flex gap-3">
                    {active.githubUrl && (
                      <motion.a
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        href={active.githubUrl}
                        target="_blank"
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
                        className="px-6 py-3 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                      >
                        <span>Demo</span>
                        <ExternalLink size={18} />
                      </motion.a>
                    )}
                  </div>
                </div>
                
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed"
                >
                  <p>{active.description}</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300"
          >
            <motion.div 
              layoutId={`image-${card.title}-${id}`}
              className="h-2/3 w-full overflow-hidden"
            >
              <img
                src={card.image.src || card.image}
                alt={card.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            
            <div className="p-6 h-1/3 flex flex-col justify-between">
              <div>
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-bold text-lg text-neutral-800 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {card.title}
                </motion.h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {card.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
                      {tag} {idx < 2 && idx < card.tags.length - 1 ? "•" : ""}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View details <ExternalLink size={14} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
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
