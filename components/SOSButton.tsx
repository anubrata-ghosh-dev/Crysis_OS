'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

export default function SOSButton() {
  return (
    <Link href="/sos">
      <motion.div
        className="absolute bottom-24 right-8 z-[1300] group cursor-pointer pointer-events-auto"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Outer ripple layers (3 concentric circles) */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-crisis-danger"
          animate={{ 
            scale: [1, 1.4, 1.6],
            opacity: [1, 0.6, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full border border-crisis-danger opacity-40"
          animate={{ 
            scale: [1, 1.25, 1.5],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
        />

        {/* Main button core */}
        <motion.div
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-crisis-danger via-red-600 to-red-800 border-2 border-red-400 flex items-center justify-center shadow-2xl group-hover:shadow-red-500/50"
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 59, 59, 0.6), 0 0 40px rgba(255, 59, 59, 0.3)',
              '0 0 30px rgba(255, 59, 59, 0.8), 0 0 60px rgba(255, 59, 59, 0.4)',
              '0 0 20px rgba(255, 59, 59, 0.6), 0 0 40px rgba(255, 59, 59, 0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Inner glow circle */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-t from-crisis-danger/0 to-crisis-danger/20 blur-sm" />

          {/* Icon container */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Radio size={32} className="text-white fill-white drop-shadow-lg" />
            </motion.div>
            <span className="text-xs font-black text-white mt-1 tracking-widest drop-shadow-lg">SOS</span>
          </div>
        </motion.div>

        {/* Tooltip on hover */}
        <motion.div
          initial={false}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-full right-0 mb-4 px-3 py-2 bg-black border border-crisis-danger rounded text-xs font-bold text-crisis-danger whitespace-nowrap pointer-events-none"
        >
          Emergency Broadcast
        </motion.div>
      </motion.div>
    </Link>
  );
}
