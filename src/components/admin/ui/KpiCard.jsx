import React, { useEffect, useRef, useState } from 'react';

// Animates a number from 0 to target on mount
function AnimatedNumber({ value, loading }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (loading || value === 0) { setDisplay(0); return; }
    const start = 0;
    const end = value;
    const duration = 700;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, loading]);

  return <span>{loading ? '' : display}</span>;
}

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = '#38bdf8',
  glowColor = 'rgba(56,189,248,0.15)',
  loading = false,
  trend,          // e.g. "+12%" optional
  trendUp,        // boolean
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-0.5 cursor-default"
      style={{
        background: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `0 0 0 0 ${glowColor}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 32px 4px ${glowColor}, 0 8px 24px rgba(0,0,0,0.3)`; e.currentTarget.style.borderColor = `${iconColor}33`; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 0 0 ${glowColor}`; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)` }}
      />

      {/* Ambient blob */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity"
        style={{ background: iconColor }}
      />

      <div className="flex items-start justify-between relative z-10">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        {Icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: `${iconColor}18`,
              border: `1px solid ${iconColor}30`,
              color: iconColor,
            }}
          >
            <Icon size={17} />
          </div>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-3xl font-extrabold font-['Outfit'] text-white flex items-end gap-2">
          {loading ? (
            <span className="inline-block w-12 h-8 bg-white/10 rounded-lg animate-pulse" />
          ) : (
            <AnimatedNumber value={value} loading={loading} />
          )}
          {!loading && trend && (
            <span
              className={`text-xs font-bold pb-1 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="text-[11px] font-medium text-slate-400 mt-1 block">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
