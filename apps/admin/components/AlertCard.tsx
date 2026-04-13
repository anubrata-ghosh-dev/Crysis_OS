'use client';

import React from 'react';
import { motion } from 'framer-motion';
import RelativeTime from '@/components/RelativeTime';
import type { Disaster } from '@/lib/mockData';
import { Clock, MapPin, Users } from 'lucide-react';

interface AlertCardProps {
  alert: Disaster;
  isNew?: boolean;
  onSelect?: (alert: Disaster) => void;
}

export default function AlertCard({ alert, isNew = false, onSelect }: AlertCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(alert)}
      className={`glass-panel rounded-lg p-3.5 border transition-all duration-300 cursor-pointer hover:border-crisis-cyan hover:shadow-lg relative overflow-hidden ${
        isNew ? 'border-crisis-cyan shadow-glow-cyan' : 'border-crisis-edge'
      }`}
    >
      {/* New badge */}
      {isNew && (
        <div className="absolute top-2 right-2">
          <div className="px-2 py-1 rounded-full text-xs font-bold bg-crisis-cyan bg-opacity-20 text-crisis-cyan border border-crisis-cyan animate-pulse">
            NEW
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-2 pr-6">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-xs text-white flex-1 leading-snug">{alert.title}</h3>
          <div className={`badge-base text-xs px-2 py-0.5 ${alert.severity === 'HIGH' ? 'badge-high' : alert.severity === 'MEDIUM' ? 'badge-medium' : 'badge-low'}`}>
            {alert.severity}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-xs text-gray-300 mb-2 leading-relaxed">{alert.summary}</p>

      {/* Escalation Indicator */}
      {alert.escalation && alert.escalation > 30 && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          className="mb-3 px-2 py-1 bg-crisis-danger bg-opacity-10 border border-crisis-danger rounded text-xs text-crisis-danger font-bold flex items-center gap-1"
        >
          <span>⚠ ESCALATING</span>
          <div className="flex-1 h-1 bg-crisis-danger bg-opacity-20 rounded ml-2">
            <div
              className="h-full bg-crisis-danger rounded transition-all duration-300"
              style={{ width: `${Math.min(alert.escalation, 100)}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Meta Info */}
      <div className="grid grid-cols-3 gap-1.5 mb-2 text-xs border-t border-crisis-edge pt-2">
        <div className="flex items-center gap-1 text-gray-400">
          <Clock size={11} className="text-crisis-cyan" />
          <RelativeTime value={alert.timestamp} className="truncate" />
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Users size={11} className="text-crisis-warning" />
          <span className="truncate">{alert.affectedPeople}+</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <MapPin size={11} className="text-crisis-safe" />
          <span className="truncate">{alert.sources} src</span>
        </div>
      </div>

      {/* Confidence Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 tracking-wider font-medium">Confidence</span>
        <div className={`badge-base text-xs px-2 py-0.5 ${alert.confidence === 'HIGH' ? 'badge-high' : alert.confidence === 'MEDIUM' ? 'badge-medium' : 'badge-low'}`}>
          {alert.confidence}
        </div>
      </div>
    </motion.div>
  );
}
