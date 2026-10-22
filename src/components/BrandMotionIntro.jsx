import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function BrandMotionIntro({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss intro after 2.6 seconds or skip on click
    const timer = setTimeout(() => {
      handleClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden cursor-pointer select-none"
          onClick={handleClose}
        >
          {/* Ambient Rotating Pattern in background */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 1.1], 
              opacity: [0, 0.15, 0.12],
              rotate: 45 
            }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <img
              src="/branding/pattern.png"
              alt="Motif 7Bhil"
              className="w-[120vw] max-w-[900px] h-auto object-contain filter invert opacity-30"
            />
          </motion.div>

          {/* Radial Glow */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.4, 1.2], opacity: [0, 0.4, 0.2] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none"
          />

          {/* Center Brand Identity */}
          <div className="relative flex flex-col items-center">
            {/* Symbol Animation */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -25, filter: "blur(10px)" }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotate: 0,
                filter: "blur(0px)" 
              }}
              transition={{ 
                duration: 1.1, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="relative w-28 h-28 md:w-36 md:h-36 mb-4"
            >
              <img
                src="/branding/logo-symbol.png"
                alt="7Bhil Logo"
                className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]"
              />
            </motion.div>

            {/* Brand Title reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-wider text-white">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                  7BHIL
                </span>
              </h2>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.9, duration: 0.8, ease: "easeInOut" }}
                className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-2"
              />
            </motion.div>

            {/* Skip hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.4 }}
              className="absolute -bottom-16 text-xs text-slate-400 tracking-widest uppercase"
            >
              Cliquer pour passer
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
