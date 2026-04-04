'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimelinePlaybackProps {
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (minutes: number) => void;
  onPlaybackChange: (isPlaying: boolean, speed: number) => void;
}

export default function TimelinePlayback({ currentTime, isPlaying, onTimeChange, onPlaybackChange }: TimelinePlaybackProps) {
  const [speed, setSpeed] = useState(1);

  const handlePlay = () => {
    onPlaybackChange(!isPlaying, speed);
  };

  const handleReset = () => {
    onTimeChange(0);
    onPlaybackChange(false, speed);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onTimeChange(value);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSpeed = parseInt(e.target.value);
    setSpeed(nextSpeed);
    if (isPlaying) {
      onPlaybackChange(true, nextSpeed);
    }
  };

  const getTimeLabel = (minutes: number) => {
    const minutesAgo = 60 - minutes;
    if (minutesAgo <= 0) return 'Now';
    if (minutesAgo === 60) return '1h ago';
    return `${minutesAgo}m ago`;
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute left-24 bottom-28 right-[25rem] glass-panel rounded-xl p-4 border border-crisis-edge shadow-2xl pointer-events-auto"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-center gap-5">
        {/* Label */}
        <div className="flex-shrink-0 min-w-fit">
          <p className="text-xs text-gray-400 tracking-widest uppercase font-semibold">Timeline</p>
          <p className="text-base font-bold text-crisis-cyan mt-1">{getTimeLabel(currentTime)}</p>
        </div>

        {/* Slider Container */}
        <div className="flex-1">
          <div className="relative group">
            <input
              type="range"
              min="0"
              max="60"
              value={currentTime}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gradient-to-r from-crisis-safe via-crisis-warning to-crisis-danger rounded-full appearance-none cursor-pointer accent-crisis-cyan"
              style={{
                background: `linear-gradient(to right, #00DD66 0%, #FFB800 50%, #FF0033 100%)`,
                filter: 'drop-shadow(0 0 6px rgba(0, 217, 255, 0.3))',
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1h ago</span>
              <span>30m</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            onClick={handlePlay}
            className="w-10 h-10 rounded-lg bg-crisis-cyan bg-opacity-10 border border-crisis-cyan text-crisis-cyan hover:bg-opacity-20 transition flex items-center justify-center"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="w-10 h-10 rounded-lg bg-crisis-warning bg-opacity-10 border border-crisis-warning text-crisis-warning hover:bg-opacity-20 transition flex items-center justify-center"
          >
            <RotateCcw size={18} />
          </motion.button>

          {/* Speed Selector */}
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="bg-crisis-dark border border-crisis-edge rounded px-2 py-1 text-xs text-gray-300 hover:border-crisis-cyan transition focus:outline-none focus:border-crisis-cyan"
          >
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="4">4x</option>
          </select>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
          {isPlaying && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-crisis-cyan rounded-full"
            />
          )}
          <span>{isPlaying ? 'Playing' : 'Paused'}</span>
        </div>
      </div>
    </motion.div>
  );
}
