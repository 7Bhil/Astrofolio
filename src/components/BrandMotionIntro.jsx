import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function BrandMotionIntro({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Si déjà vu dans les 15 dernières minutes, on ne l'impose pas sauf rechargement explicite
    try {
      const seenTime = sessionStorage.getItem('brandIntroSeenAt');
      if (seenTime && Date.now() - parseInt(seenTime, 10) < 15 * 60 * 1000) {
        setIsVisible(false);
        return;
      }
    } catch (e) {}

    // Progression fluide du compteur 0 -> 100%
    const startTime = Date.now();
    const duration = 2400; // 2.4s pour une expérience cinématographique premium

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          handleClose();
        }, 350);
      }
    }, 25);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    try { 
      sessionStorage.setItem('brandIntroSeenAt', Date.now().toString()); 
    } catch (e) {}
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -30,
            filter: "blur(12px)",
            transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="brand-intro fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#030712] overflow-hidden cursor-pointer select-none"
          onClick={handleClose}
        >
          {/* Subtle Cyber Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }}
          />

          {/* Ambient Rotating Pattern in background */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: [0.85, 1.15, 1.05], 
              opacity: [0, 0.12, 0.09],
              rotate: 60 
            }}
            transition={{ duration: 3.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <img
              src="/branding/pattern.png"
              alt="Motif 7Bhil"
              className="w-[110vw] max-w-[850px] h-auto object-contain filter invert"
            />
          </motion.div>

          {/* Atmospheric Radial Glows */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.4, 1.2], opacity: [0, 0.35, 0.22] }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute w-80 h-80 md:w-[480px] md:h-[480px] rounded-full bg-cyan-500/25 blur-[100px] pointer-events-none"
          />

          {/* Center Brand Identity Container */}
          <div className="relative flex flex-col items-center z-10">
            {/* Spinning & Breathing Glowing Rings */}
            <div className="relative flex items-center justify-center w-36 h-36 md:w-44 md:h-44 mb-6">
              {/* Outer Dashed Orbit */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40"
              />

              {/* Inner Reverse Glow Orbit */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border border-cyan-400/20"
              />

              {/* Central Official Logo Symbol */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0, filter: "blur(8px)" }}
                animate={{ 
                  scale: [0.4, 1.08, 1], 
                  opacity: 1, 
                  filter: "blur(0px)" 
                }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center"
              >
                <img
                  src="/branding/logo-symbol.png"
                  alt="7Bhil Emblème"
                  className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.7)]"
                />
              </motion.div>
            </div>

            {/* Brand Title & Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-white flex items-center justify-center gap-2">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                  7BHIL
                </span>
              </h1>
              <p className="mt-1 text-xs md:text-sm font-mono tracking-[0.25em] text-cyan-300/80 uppercase">
                Software Engineer & Architect
              </p>
            </motion.div>

            {/* Futuristic Progress Gauge */}
            <div className="w-56 md:w-64 mt-8 flex flex-col items-center gap-2">
              <div className="w-full h-[3px] bg-slate-800/80 rounded-full overflow-hidden border border-cyan-500/20">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-cyan-400 tracking-wider">SYSTEM INITIALIZING</span>
                <span className="text-cyan-300 font-bold">{progress}%</span>
              </div>
            </div>

            {/* Skip hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-[11px] font-mono text-slate-500 tracking-widest uppercase hover:text-cyan-400 transition-colors"
            >
              Cliquer pour passer
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
