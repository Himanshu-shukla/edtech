import React from 'react';
import { motion } from 'framer-motion';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        
        {/* --- The Spinner --- */}
        <div className="relative w-24 h-24">
          {/* Outer Ring */}
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 border-r-emerald-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
          
          {/* Middle Ring (Reverse) */}
          <motion.span
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-orange-500 border-l-orange-500/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
          />
          
          {/* Inner Core (Pulse) */}
          <motion.div
            className="absolute inset-[30%] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          />
        </div>

        {/* --- Text --- */}
        <div className="flex flex-col items-center gap-1">
          <motion.h3 
            className="text-lg font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-orange-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading
          </motion.h3>
          <p className="text-zinc-600 text-xs tracking-wider">Please wait...</p>
        </div>

      </div>
    </div>
  );
};

export default Loading;