import React from 'react';
import { motion } from 'motion/react';

export default function BrandInteractiveLogo() {
  return (
    <motion.div
      className="relative flex items-center justify-center p-3 cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background soft ambient halo on hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      {/* Logo symbol */}
      <motion.img
        src="/branding/logo-symbol.png"
        alt="7Bhil"
        className="w-10 h-10 object-contain relative z-10 transition-transform duration-300 group-hover:rotate-6"
      />
    </motion.div>
  );
}
