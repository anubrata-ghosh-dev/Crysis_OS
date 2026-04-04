'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Users, Clock } from 'lucide-react';
import type { Disaster } from '@/lib/mockData';

interface DecisionStatsProps {
  disasters: Disaster[];
}

export default function DecisionStats({ disasters }: DecisionStatsProps) {
  const stats = useMemo(() => {
    const highSeverity = disasters.filter((d) => d.severity === 'HIGH').length;
    const escalating = disasters.filter((d) => (d.escalation || 0) > 50).length;
    const totalAffected = disasters.reduce((sum, d) => sum + d.affectedPeople, 0);
    const avgConfidence = (disasters.reduce((sum, d) => {
      const conf = d.confidence === 'HIGH' ? 3 : d.confidence === 'MEDIUM' ? 2 : 1;
      return sum + conf;
    }, 0) / disasters.length * 33.33).toFixed(0);

    return { highSeverity, escalating, totalAffected, avgConfidence };
  }, [disasters]);

  const statCards = [
    {
      label: 'HIGH PRIORITY',
      value: stats.highSeverity,
      icon: AlertTriangle,
      color: 'text-crisis-danger',
      bgColor: 'bg-crisis-danger',
    },
    {
      label: 'ESCALATING',
      value: stats.escalating,
      icon: TrendingUp,
      color: 'text-crisis-warning',
      bgColor: 'bg-crisis-warning',
    },
    {
      label: 'AFFECTED',
      value: `${stats.totalAffected}+`,
      icon: Users,
      color: 'text-crisis-cyan',
      bgColor: 'bg-crisis-cyan',
    },
    {
      label: 'AVG. CONFIDENCE',
      value: `${stats.avgConfidence}%`,
      icon: Clock,
      color: 'text-crisis-safe',
      bgColor: 'bg-crisis-safe',
    },
  ];

  return (
    <div className="flex gap-2 pointer-events-auto">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel rounded-lg border ${idx === 0 ? 'border-crisis-danger/40' : 'border-crisis-edge'} p-2 min-w-[132px]`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded bg-opacity-10 flex items-center justify-center border ${card.bgColor} ${card.color}`}>
                <Icon size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">{card.label}</p>
                <p className={`text-sm font-extrabold ${card.color}`}>{card.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
