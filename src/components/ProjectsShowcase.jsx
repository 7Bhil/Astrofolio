import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const imgSrc = (img) => (typeof img === "string" ? img : img?.src || img);
const pad = (n) => String(n + 1).padStart(2, "0");

/* ───────────── Editorial index: numbered rows + cursor-following preview ───────────── */
export function ProjectList({ projects, onSelect, lang = "fr" }) {
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const quick = useRef({});
  const [hovered, setHovered] = useState(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (previewRef.current) {
        quick.current.x = gsap.quickTo(previewRef.current, "x", { duration: 0.5, ease: "power3" });
        quick.current.y = gsap.quickTo(previewRef.current, "y", { duration: 0.5, ease: "power3" });
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".project-row", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: { trigger: listRef.current, start: "top 85%", once: true },
      });
    }, listRef);
    return () => ctx.revert();
  }, [projects]);

  const onMove = (e) => {
    quick.current.x?.(e.clientX + 28);
    quick.current.y?.(e.clientY - 120);
  };

  return (
    <div ref={listRef} onMouseMove={onMove} onMouseLeave={() => setHovered(null)} className="relative">
      <ul className="border-t border-neutral-800">
        {projects.map((p, i) => (
          <li key={p.id || p.title} className="project-row border-b border-neutral-800">
            <button
              type="button"
              onClick={() => onSelect(p)}
              onMouseEnter={() => setHovered(p)}
              onFocus={() => setHovered(p)}
              onBlur={() => setHovered(null)}
              className="group w-full grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1.3fr_1fr_auto] items-center gap-x-4 gap-y-1 py-6 md:py-8 text-left transition-colors hover:bg-white/[0.02] px-1 md:px-3"
            >
              <span className="font-mono text-xs md:text-sm text-neutral-500 group-hover:text-cyan-400 transition-colors">
                {pad(i)}
              </span>

              <span className="min-w-0">
                <span className="block text-xl md:text-3xl font-bold tracking-tight text-neutral-100 group-hover:translate-x-1 md:group-hover:translate-x-3 transition-transform duration-300">
                  {p.title}
                </span>
                <span className="block mt-1 text-xs md:text-sm text-neutral-500 font-mono">
                  {p.categoryLabel}
                </span>
              </span>

              <span className="hidden md:block text-sm text-neutral-400">{p.metric}</span>

              <span className="flex items-center gap-3 text-neutral-500 group-hover:text-cyan-400 transition-colors">
                <span className="hidden lg:inline text-xs font-mono">
                  {(p.tags || []).slice(0, 3).join(" · ")}
                </span>
                <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Floating preview (desktop pointer only) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 z-40 w-[340px] h-[220px] rounded-xl overflow-hidden border border-neutral-700 shadow-2xl pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          transform: undefined,
          transition: "opacity .25s ease",
        }}
      >
        {hovered && <img src={imgSrc(hovered.image)} alt="" className="w-full h-full object-cover object-top" />}
      </div>

      <p className="mt-6 text-xs font-mono text-neutral-600 lg:hidden">
        {lang === "en" ? "Tap a project to open the case study" : "Touchez un projet pour ouvrir l'étude de cas"}
      </p>
    </div>
  );
}

/* ───────────── Horizontal scroll: pinned on desktop, native swipe on mobile ───────────── */
export function ProjectsHorizontal({ projects, onSelect, lang = "fr" }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, trackRef.current.scrollWidth - wrapRef.current.clientWidth);
      gsap.to(trackRef.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top+=90",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => barRef.current && gsap.set(barRef.current, { scaleX: self.progress }),
        },
      });
    });
    return () => mm.revert();
  }, [projects]);

  return (
    <div ref={wrapRef}>
      <div className="overflow-x-auto lg:overflow-hidden snap-x snap-mandatory lg:snap-none pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div ref={trackRef} className="flex gap-5 lg:gap-8 w-max">
          {projects.map((p, i) => (
            <button
              key={p.id || p.title}
              type="button"
              onClick={() => onSelect(p)}
              className="group snap-center shrink-0 w-[84vw] sm:w-[60vw] lg:w-[44vw] max-w-[760px] text-left"
            >
              <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 h-[44vh] lg:h-[50vh]">
                <img
                  src={imgSrc(p.image)}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 font-mono text-xs px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-neutral-200">
                  {pad(i)} / {pad(projects.length - 1)}
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-neutral-100 group-hover:text-cyan-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400 line-clamp-2">{p.metric}</p>
                  <p className="mt-2 text-xs font-mono text-neutral-500">
                    {(p.tags || []).slice(0, 4).join(" · ")}
                  </p>
                </div>
                <ArrowUpRight size={22} className="shrink-0 mt-1 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden lg:block mt-6 h-px bg-neutral-800">
        <div ref={barRef} className="h-px bg-cyan-400 origin-left" style={{ transform: "scaleX(0)" }} />
      </div>
      <p className="mt-3 text-xs font-mono text-neutral-600">
        {lang === "en" ? "Scroll to move through the projects" : "Faites défiler pour parcourir les projets"}
      </p>
    </div>
  );
}
