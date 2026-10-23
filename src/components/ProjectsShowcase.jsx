import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
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
  const previewImgRef = useRef(null);
  const quickRef = useRef({});
  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const [hovered, setHovered] = useState(null);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // QuickTo setters for fluid mouse preview tracking with rotation & skew inertia
      if (previewRef.current && !prefersReduced) {
        quickRef.current.x = gsap.quickTo(previewRef.current, "x", { duration: 0.45, ease: "power3.out" });
        quickRef.current.y = gsap.quickTo(previewRef.current, "y", { duration: 0.45, ease: "power3.out" });
        quickRef.current.rotation = gsap.quickTo(previewRef.current, "rotation", { duration: 0.5, ease: "power3.out" });
        quickRef.current.skewX = gsap.quickTo(previewRef.current, "skewX", { duration: 0.5, ease: "power3.out" });
        quickRef.current.scale = gsap.quickTo(previewRef.current, "scale", { duration: 0.35, ease: "power2.out" });
      }

      if (prefersReduced) {
        gsap.set(".project-row", { opacity: 1, y: 0 });
        gsap.set(".project-row-line", { scaleX: 1 });
        return;
      }

      // Elegant entrance animation with border reveal & stagger
      const rows = gsap.utils.toArray(".project-row");
      const lines = gsap.utils.toArray(".project-row-line");

      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(rows, { opacity: 0, y: 35 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 85%",
          once: true,
          onComplete: () => ScrollTrigger.refresh(),
        },
      });

      tl.to(lines, {
        scaleX: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.inOut",
      }).to(
        rows,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "transform,opacity",
        },
        "-=0.6"
      );
    }, listRef);

    return () => ctx.revert();
  }, [projects]);

  // Subtle image zoom effect when switching projects
  useEffect(() => {
    if (hovered && previewImgRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        previewImgRef.current,
        { scale: 1.12, filter: "brightness(0.85)" },
        { scale: 1, filter: "brightness(1)", duration: 0.5, ease: "power2.out" }
      );
    }
  }, [hovered]);

  const onMouseMove = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const now = performance.now();
    const dt = Math.max(now - lastMousePos.current.time, 16);
    const dx = e.clientX - lastMousePos.current.x;

    // Calculate mouse horizontal velocity for skew and rotation tilt
    const vx = dx / dt;
    const tilt = Math.max(-12, Math.min(12, vx * 10));
    const skew = Math.max(-8, Math.min(8, vx * 6));

    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

    quickRef.current.x?.(e.clientX + 25);
    quickRef.current.y?.(e.clientY - 130);
    quickRef.current.rotation?.(tilt);
    quickRef.current.skewX?.(skew);
  };

  const handleRowHover = (p) => {
    setHovered(p);
    if (quickRef.current.scale) {
      quickRef.current.scale(1);
    }
  };

  const handleMouseLeave = () => {
    setHovered(null);
    if (quickRef.current.scale) {
      quickRef.current.scale(0.85);
      quickRef.current.rotation?.(0);
      quickRef.current.skewX?.(0);
    }
  };

  // Subtle magnetic interaction for project rows
  const handleRowMouseMove = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - (rect.top + rect.height / 2);
    gsap.to(e.currentTarget, {
      y: relY * 0.12,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleRowMouseLeave = (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(e.currentTarget, {
      y: 0,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={listRef}
      onMouseMove={onMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <div className="project-row-line h-px bg-neutral-800 w-full" />
      <ul>
        {projects.map((p, i) => (
          <li key={p.id || p.title} className="relative">
            <button
              type="button"
              onClick={() => onSelect(p)}
              onMouseEnter={() => handleRowHover(p)}
              onMouseMove={handleRowMouseMove}
              onMouseLeave={handleRowMouseLeave}
              onFocus={() => handleRowHover(p)}
              onBlur={() => setHovered(null)}
              className="project-row group w-full grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1.4fr_1fr_auto] items-center gap-x-4 gap-y-1 py-6 md:py-8 text-left transition-colors hover:bg-neutral-900/40 px-2 md:px-4 rounded-xl cursor-pointer"
            >
              <span className="font-mono text-xs md:text-sm text-neutral-500 group-hover:text-cyan-400 group-hover:font-semibold transition-colors">
                {pad(i)}
              </span>

              <span className="min-w-0 pr-2">
                <span className="block text-xl md:text-3xl font-bold tracking-tight text-neutral-100 group-hover:text-cyan-300 group-hover:translate-x-1.5 md:group-hover:translate-x-3 transition-all duration-300">
                  {p.title}
                </span>
                <span className="mt-1 text-xs md:text-sm text-neutral-500 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 inline-block opacity-0 group-hover:opacity-100 transition-opacity" />
                  {p.categoryLabel}
                </span>
              </span>

              <span className="hidden md:block text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                {p.metric}
              </span>

              <span className="flex items-center gap-3 text-neutral-500 group-hover:text-cyan-400 transition-colors">
                <span className="hidden lg:inline text-xs font-mono px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900/50 group-hover:border-cyan-500/30">
                  {(p.tags || []).slice(0, 3).join(" · ")}
                </span>
                <div className="w-9 h-9 rounded-full border border-neutral-800 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 flex items-center justify-center transition-all">
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </span>
            </button>
            <div className="project-row-line h-px bg-neutral-800 w-full" />
          </li>
        ))}
      </ul>

      {/* Floating preview with dynamic tilt, shadow & scale (desktop pointer only) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 z-50 w-[360px] h-[230px] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] pointer-events-none bg-neutral-950 will-change-transform"
        style={{
          opacity: hovered ? 1 : 0,
          transform: "scale(0.85)",
          transition: "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {hovered && (
          <div className="relative w-full h-full">
            <img
              ref={previewImgRef}
              src={imgSrc(hovered.image)}
              alt=""
              className="w-full h-full object-cover object-top will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                {hovered.categoryLabel}
              </span>
              <span className="text-sm font-semibold text-white truncate">
                {hovered.title}
              </span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs font-mono text-neutral-500 lg:hidden text-center">
        {lang === "en" ? "Tap a project to inspect case study" : "Touchez un projet pour voir les détails"}
      </p>
    </div>
  );
}

/* ───────────── Infinite Dual-Row Marquee Carousel (Opposite directions) ───────────── */
export function ProjectsHorizontal({ projects, onSelect, lang = "fr" }) {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Split projects into two balanced rows
  const half = Math.ceil(projects.length / 2);
  const row1Original = projects.slice(0, half);
  const row2Original = projects.slice(half);

  // If a row is too small, duplicate to ensure continuous seamless scroll
  const duplicate = (arr) => {
    if (!arr || arr.length === 0) return [];
    let res = [...arr];
    while (res.length < 6) {
      res = [...res, ...arr];
    }
    return res;
  };

  const row1List = duplicate(row1Original);
  const row2List = duplicate(row2Original.length > 0 ? row2Original : row1Original);

  // Triple to allow infinite seamless looping in GSAP
  const row1Items = [...row1List, ...row1List, ...row1List];
  const row2Items = [...row2List, ...row2List, ...row2List];

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1 || !r2) return;

    // Row 1: Right to Left (0% to -33.333%)
    const tween1 = gsap.to(r1, {
      xPercent: -33.3333,
      duration: Math.max(25, row1List.length * 7),
      ease: "none",
      repeat: -1,
    });

    // Row 2: Left to Right (-33.333% to 0%)
    gsap.set(r2, { xPercent: -33.3333 });
    const tween2 = gsap.to(r2, {
      xPercent: 0,
      duration: Math.max(25, row2List.length * 7),
      ease: "none",
      repeat: -1,
    });

    if (isPaused) {
      tween1.pause();
      tween2.pause();
    } else {
      tween1.play();
      tween2.play();
    }

    return () => {
      tween1.kill();
      tween2.kill();
    };
  }, [row1List.length, row2List.length, isPaused]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden py-4 space-y-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Edge gradient fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-neutral-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-neutral-950 to-transparent z-10" />

      {/* Row 1: Right to Left */}
      <div className="flex overflow-hidden">
        <div ref={row1Ref} className="flex gap-5 sm:gap-6 shrink-0 will-change-transform">
          {row1Items.map((p, idx) => (
            <ProjectCard key={`r1-${idx}`} project={p} onSelect={onSelect} lang={lang} />
          ))}
        </div>
      </div>

      {/* Row 2: Left to Right */}
      <div className="flex overflow-hidden">
        <div ref={row2Ref} className="flex gap-5 sm:gap-6 shrink-0 will-change-transform">
          {row2Items.map((p, idx) => (
            <ProjectCard key={`r2-${idx}`} project={p} onSelect={onSelect} lang={lang} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2 text-xs font-mono text-neutral-500">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>
          {lang === "en"
            ? "Hover any card to pause & explore details"
            : "Survolez une carte pour figer le défilement et inspecter"}
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project, onSelect, lang }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className="group relative shrink-0 w-[290px] sm:w-[360px] md:w-[410px] text-left rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-cyan-500/50 p-3.5 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 hover:-translate-y-1.5 cursor-pointer backdrop-blur-sm"
    >
      <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-xl bg-neutral-950">
        <img
          src={imgSrc(project.image)}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
        
        {/* Category tag */}
        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-neutral-900/85 backdrop-blur-md text-cyan-300 border border-cyan-800/40">
          {project.categoryLabel || "Web"}
        </span>

        {/* Hover action icon */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700 flex items-center justify-center text-neutral-300 group-hover:bg-cyan-500 group-hover:text-neutral-950 group-hover:border-cyan-400 transition-all">
          <ArrowUpRight size={14} />
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-sm sm:text-base text-neutral-100 group-hover:text-cyan-300 transition-colors truncate">
            {project.title}
          </h4>
        </div>
        <p className="mt-1 text-xs text-neutral-400 line-clamp-1">
          {project.metric}
        </p>

        {/* Tags */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {(project.tags || []).slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-950 text-neutral-400 border border-neutral-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
