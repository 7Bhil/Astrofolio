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

/* ───────────── Horizontal scroll: pinned on desktop, native swipe on mobile ───────────── */
export function ProjectsHorizontal({ projects, onSelect, lang = "fr" }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const counterRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      if (!track || !wrap) return;

      const totalCards = projects.length;
      const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
      const cards = gsap.utils.toArray(".horizontal-project-card");
      const cardImages = gsap.utils.toArray(".horizontal-project-image");

      // Set initial states for cards
      cards.forEach((card, idx) => {
        gsap.set(card, {
          scale: idx === 0 ? 1 : 0.94,
          opacity: idx === 0 ? 1 : 0.65,
        });
      });

      // Horizontal track scrolling timeline
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top+=80",
        end: () => "+=" + distance(),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Smooth progress bar
          if (barRef.current) {
            gsap.set(barRef.current, { scaleX: progress });
          }

          // Active card index computation
          const currentIdx = Math.min(
            totalCards - 1,
            Math.floor(progress * totalCards + 0.3)
          );
          setActiveIndex(currentIdx);

          // Card focus effect: active card scales to 1, others slightly smaller & dimmed
          cards.forEach((card, idx) => {
            const cardCenterProgress = totalCards > 1 ? idx / (totalCards - 1) : 0;
            const distFromCenter = Math.abs(progress - cardCenterProgress);
            const factor = Math.max(0, 1 - distFromCenter * 2.2);

            gsap.to(card, {
              scale: 0.94 + 0.06 * factor,
              opacity: 0.6 + 0.4 * factor,
              duration: 0.25,
              overwrite: "auto",
              ease: "power1.out",
            });
          });
        },
      });

      // Main translation tween
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: st,
      });

      // Parallax effect on card images during horizontal scroll
      cardImages.forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -12, scale: 1.15 },
          {
            xPercent: 12,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top+=80",
              end: () => "+=" + distance(),
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, [projects]);

  return (
    <div ref={wrapRef} className="relative py-4">
      {/* Horizontal showcase container */}
      <div className="overflow-x-auto lg:overflow-hidden snap-x snap-mandatory lg:snap-none pb-6 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div ref={trackRef} className="flex gap-6 lg:gap-10 w-max items-center">
          {projects.map((p, i) => (
            <button
              key={p.id || p.title}
              type="button"
              onClick={() => onSelect(p)}
              className="horizontal-project-card group snap-center shrink-0 w-[86vw] sm:w-[62vw] lg:w-[48vw] max-w-[760px] text-left transform-gpu transition-all duration-300 cursor-pointer"
            >
              {/* Media card */}
              <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 h-[46vh] lg:h-[52vh] group-hover:border-cyan-500/50 shadow-2xl transition-all">
                <img
                  src={imgSrc(p.image)}
                  alt={p.title}
                  loading="lazy"
                  className="horizontal-project-image w-full h-full object-cover object-top will-change-transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />

                {/* Index badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-neutral-200 border border-neutral-700">
                    {pad(i)} / {pad(projects.length - 1)}
                  </span>
                  <span className="hidden sm:inline-block font-mono text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300">
                    {p.categoryLabel}
                  </span>
                </div>

                {/* Hover CTA hint */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500 text-neutral-950 font-medium text-xs shadow-lg">
                  <span>{lang === "en" ? "Explore" : "Découvrir"}</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>

              {/* Information footer */}
              <div className="mt-4 flex items-start justify-between gap-4 px-1">
                <div className="min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-neutral-100 group-hover:text-cyan-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-400 line-clamp-2">
                    {p.metric}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(p.tags || []).slice(0, 4).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full border border-neutral-800 group-hover:border-cyan-400 group-hover:bg-cyan-500/10 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowUpRight
                    size={20}
                    className="text-neutral-500 group-hover:text-cyan-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive visual progress tracker */}
      <div className="hidden lg:flex items-center justify-between gap-6 mt-8">
        <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <div
          ref={counterRef}
          className="font-mono text-xs text-neutral-400 shrink-0 flex items-center gap-2"
        >
          <span className="text-cyan-400 font-bold">{pad(activeIndex)}</span>
          <span className="text-neutral-600">/</span>
          <span>{pad(projects.length - 1)}</span>
        </div>
      </div>

      <p className="mt-3 text-xs font-mono text-neutral-500 text-center">
        {lang === "en"
          ? "Scroll horizontally or use your wheel to explore"
          : "Faites défiler pour explorer la galerie de projets"}
      </p>
    </div>
  );
}
