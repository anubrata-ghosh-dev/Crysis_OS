'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AlertCard from './AlertCard';
import type { Disaster } from '@/lib/mockData';

interface IntelligenceFeedProps {
  alerts: Disaster[];
  onAlertSelect?: (alert: Disaster) => void;
  newAlertIds?: string[];
  timelineMinutes?: number;
  isPlaying?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function IntelligenceFeed({ alerts, onAlertSelect, newAlertIds = [], timelineMinutes = 30, isPlaying = false }: IntelligenceFeedProps) {
  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="border-b border-crisis-edge px-5 py-4 bg-black/30 backdrop-blur-xl flex-shrink-0">
        <h2 className="text-xs font-black text-crisis-cyan tracking-widest uppercase letter-spacing-wide">INTELLIGENCE FEED</h2>
        <p className="text-xs text-gray-400 mt-2">• {alerts.length} active incidents in last {timelineMinutes}m</p>
        <p className="text-[11px] text-gray-500 mt-1 font-mono">{isPlaying ? 'Playback: Running' : 'Playback: Paused'}</p>
      </div>

      {/* Scroll area */}
      <motion.div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5"
        initial={false}
        animate={{ opacity: 1 }}
      >
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <p className="text-sm">No active incidents</p>
            <p className="text-xs text-gray-600 mt-2">System monitoring...</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <motion.div key={alert.id} initial={false} animate={{ opacity: 1, y: 0 }}>
              <AlertCard
                alert={alert}
                isNew={newAlertIds.includes(alert.id)}
                onSelect={onAlertSelect}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Footer */}
      <div className="border-t border-crisis-edge px-5 py-3 text-xs text-gray-500 text-center bg-black/20 backdrop-blur-xl flex-shrink-0">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-crisis-cyan rounded-full animate-pulse"></span>
          <span className="font-mono font-semibold">Live updates enabled</span>
        </span>
      </div>
    </div>
  );
}
