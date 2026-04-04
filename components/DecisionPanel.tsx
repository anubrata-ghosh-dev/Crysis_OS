'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, MapPin, Shield, AlertTriangle, Flame } from 'lucide-react';
import type { Disaster } from '@/lib/mockData';
import { RESOURCE_LOCATIONS, calculateDistance } from '@/lib/mockData';
import RelativeTime from '@/components/RelativeTime';

interface DecisionPanelProps {
  alert: Disaster | null;
  onClose: () => void;
  onNavigate?: () => void;
}

export default function DecisionPanel({ alert, onClose, onNavigate }: DecisionPanelProps) {
  const recommendations = useMemo(() => {
    if (!alert) return null;

    // Calculate risk level based on severity + confidence
    const riskScore = (alert.severity === 'HIGH' ? 10 : alert.severity === 'MEDIUM' ? 6 : 2) +
                      (alert.confidence === 'HIGH' ? 5 : alert.confidence === 'MEDIUM' ? 3 : 1);

    const riskLevel = riskScore >= 12 ? 'CRITICAL' : riskScore >= 8 ? 'HIGH' : riskScore >= 5 ? 'MEDIUM' : 'LOW';

    // Find nearest resources
    const nearestHospital = RESOURCE_LOCATIONS.hospitals.reduce((prev, curr) => {
      const currDist = calculateDistance(alert.lat, alert.lng, curr.lat, curr.lng);
      const prevDist = calculateDistance(alert.lat, alert.lng, prev.lat, prev.lng);
      return currDist < prevDist ? curr : prev;
    });

    const nearestShelter = RESOURCE_LOCATIONS.shelters.reduce((prev, curr) => {
      const currDist = calculateDistance(alert.lat, alert.lng, curr.lat, curr.lng);
      const prevDist = calculateDistance(alert.lat, alert.lng, prev.lat, prev.lng);
      return currDist < prevDist ? curr : prev;
    });

    const hospitalDist = calculateDistance(alert.lat, alert.lng, nearestHospital.lat, nearestHospital.lng);
    const shelterDist = calculateDistance(alert.lat, alert.lng, nearestShelter.lat, nearestShelter.lng);

    // Evacuation radius (in miles)
    const evacuationRadius = alert.severity === 'HIGH' ? 2.0 : alert.severity === 'MEDIUM' ? 1.5 : 0.5;

    return {
      riskLevel,
      riskScore,
      evacuationRadius,
      nearestHospital: { ...nearestHospital, distance: hospitalDist },
      nearestShelter: { ...nearestShelter, distance: shelterDist },
      estimatedAffected: alert.affectedPeople + Math.floor(Math.random() * 200),
    };
  }, [alert]);

  if (!alert || !recommendations) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'text-crisis-danger';
      case 'HIGH':
        return 'text-crisis-warning';
      case 'MEDIUM':
        return 'text-crisis-warning';
      default:
        return 'text-crisis-safe';
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-crisis-danger bg-opacity-10 border-crisis-danger';
      case 'HIGH':
        return 'bg-crisis-warning bg-opacity-10 border-crisis-warning';
      case 'MEDIUM':
        return 'bg-crisis-warning bg-opacity-5 border-crisis-warning';
      default:
        return 'bg-crisis-safe bg-opacity-10 border-crisis-safe';
    }
  };

  const getRiskIcon = (risk: string) => {
    if (risk === 'CRITICAL' || risk === 'HIGH') return <AlertTriangle size={20} />;
    if (risk === 'MEDIUM') return <Shield size={20} />;
    return <Shield size={20} />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full h-full flex flex-col overflow-y-auto bg-transparent"
      >
        {/* Header */}
        <div className="border-b border-crisis-edge px-6 py-4 sticky top-0 bg-gradient-to-b from-black/30 via-black/20 to-transparent z-10 flex-shrink-0">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-lg font-bold text-crisis-cyan tracking-widest uppercase">Decision Panel</h2>
              <p className="text-xs text-gray-400 mt-1">Real-time advisory</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-crisis-cyan transition text-2xl font-bold leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">
          {/* Incident Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel-dark rounded-lg p-4 border border-crisis-edge"
          >
            <h3 className="font-bold text-white mb-2">Incident</h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">{alert.title}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>
                <span className="text-crisis-cyan font-bold">Time:</span> <RelativeTime value={alert.timestamp} />
              </div>
              <div>
                <span className="text-crisis-cyan font-bold">Sources:</span> {alert.sources}
              </div>
            </div>
          </motion.div>

          {/* Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-lg p-4 border-2 ${getRiskBgColor(recommendations.riskLevel)}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={getRiskColor(recommendations.riskLevel)}>
                {getRiskIcon(recommendations.riskLevel)}
              </div>
              <div>
                <p className="text-xs text-gray-400 tracking-wider uppercase">Risk Level</p>
                <p className={`text-xl font-bold ${getRiskColor(recommendations.riskLevel)}`}>
                  {recommendations.riskLevel}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-300 space-y-1">
              <p>Priority Score: <span className="text-crisis-warning font-bold">{recommendations.riskScore}/20</span></p>
              <p>Est. Affected: <span className="text-crisis-danger font-bold">{recommendations.estimatedAffected}+ people</span></p>
            </div>
          </motion.div>

          {/* Evacuation Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel-dark rounded-lg p-4 border border-crisis-edge"
          >
            <h3 className="font-bold text-crisis-warning mb-3 flex items-center gap-2">
              <Flame size={16} /> Evacuation Zone
            </h3>
            <div className="bg-crisis-danger bg-opacity-10 border border-crisis-danger rounded p-3 mb-3">
              <p className="text-sm text-white font-bold mb-2">Danger Radius: {recommendations.evacuationRadius.toFixed(1)} miles</p>
              <p className="text-xs text-gray-300">
                All personnel within this radius should evacuate immediately or seek shelter.
              </p>
            </div>
            <div className="text-xs text-gray-400 space-y-2">
              <p>🎯 <span className="text-crisis-cyan">Recommended Direction:</span> {['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)]}</p>
              <p>⏱ <span className="text-crisis-cyan">Evacuation Window:</span> {Math.floor(15 + Math.random() * 30)} minutes</p>
            </div>
          </motion.div>

          {/* Nearest Resources */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel-dark rounded-lg p-4 border border-crisis-edge"
          >
            <h3 className="font-bold text-crisis-safe mb-3 flex items-center gap-2">
              <MapPin size={16} /> Nearest Resources
            </h3>

            {/* Hospital */}
            <div className="mb-3 pb-3 border-b border-crisis-edge">
              <p className="text-xs text-gray-400 tracking-wider uppercase mb-1">🏥 Hospital</p>
              <p className="text-sm font-semibold text-white">{recommendations.nearestHospital.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-crisis-safe">{recommendations.nearestHospital.distance.toFixed(1)} miles</span> away
              </p>
              <p className="text-xs text-gray-400 mt-1">Capacity: {recommendations.nearestHospital.beds} beds available</p>
            </div>

            {/* Shelter */}
            <div>
              <p className="text-xs text-gray-400 tracking-wider uppercase mb-1">🏢 Shelter</p>
              <p className="text-sm font-semibold text-white">{recommendations.nearestShelter.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-crisis-safe">{recommendations.nearestShelter.distance.toFixed(1)} miles</span> away
              </p>
              <p className="text-xs text-gray-400 mt-1">Capacity: {recommendations.nearestShelter.capacity} people</p>
            </div>
          </motion.div>

          {/* Recommended Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel-dark rounded-lg p-4 border border-crisis-edge"
          >
            <h3 className="font-bold text-crisis-cyan mb-3">Recommended Actions</h3>
            <ul className="text-xs text-gray-300 space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-crisis-warning mt-0.5">▸</span>
                <span>Notify residents in the {recommendations.evacuationRadius}mi radius immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crisis-warning mt-0.5">▸</span>
                <span>Open {recommendations.nearestShelter.name} for emergency intake</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crisis-warning mt-0.5">▸</span>
                <span>Dispatch emergency units to the affected zone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crisis-cyan mt-0.5">▸</span>
                <span>Monitor situation for escalation every 5 minutes</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-crisis-edge px-6 py-4 bg-gradient-to-t from-black/30 to-transparent sticky bottom-0 space-y-3 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigate}
            className="w-full button-primary flex items-center justify-center gap-2 py-3"
          >
            <Navigation size={18} />
            <span className="font-bold">Navigate to Safety</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full button-primary py-2 text-sm"
          >
            Close Panel
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
