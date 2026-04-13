'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, MapPin, Shield, Navigation, TrendingDown, Clock, Users, Zap, Map, Home, Send } from 'lucide-react';
import type { Disaster, SafeZone } from '@/lib/mockData';
import { RESOURCE_LOCATIONS, calculateDistance } from '@/lib/mockData';
import RelativeTime from '@/components/RelativeTime';

interface CrisisResponsePanelProps {
  alert: Disaster | null;
  safeZones?: SafeZone[];
  routeVisible?: boolean;
  onRouteToggle?: (alert: Disaster) => void;
  onClose: () => void;
  onAlert?: (alert: Disaster) => void;
}

export default function CrisisResponsePanel({ 
  alert, 
  safeZones = [],
  routeVisible = false,
  onRouteToggle,
  onClose, 
  onAlert 
}: CrisisResponsePanelProps) {
  const [alertSent, setAlertSent] = useState(false);

  const analysis = useMemo(() => {
    if (!alert) return null;

    // Calculate risk level
    const riskScore = (alert.severity === 'HIGH' ? 10 : alert.severity === 'MEDIUM' ? 6 : 2) +
                      (alert.confidence === 'HIGH' ? 5 : alert.confidence === 'MEDIUM' ? 3 : 1);
    const riskLevel = riskScore >= 12 ? 'CRITICAL' : riskScore >= 8 ? 'HIGH' : riskScore >= 5 ? 'MEDIUM' : 'LOW';

    // Find nearest resources within 50km radius
    const MAX_DISTANCE_KM = 50;
    
    const nearestHospital = RESOURCE_LOCATIONS.hospitals
      .filter(hospital => {
        const dist = calculateDistance(alert.lat, alert.lng, hospital.lat, hospital.lng);
        return dist <= MAX_DISTANCE_KM; // Only show hospitals within 50km
      })
      .reduce((prev, curr) => {
        const currDist = calculateDistance(alert.lat, alert.lng, curr.lat, curr.lng);
        const prevDist = calculateDistance(alert.lat, alert.lng, prev.lat, prev.lng);
        return currDist < prevDist ? curr : prev;
      }, RESOURCE_LOCATIONS.hospitals[0]); // Fallback to closest if none in radius

    const nearestShelter = RESOURCE_LOCATIONS.shelters
      .filter(shelter => {
        const dist = calculateDistance(alert.lat, alert.lng, shelter.lat, shelter.lng);
        return dist <= MAX_DISTANCE_KM; // Only show shelters within 50km
      })
      .reduce((prev, curr) => {
        const currDist = calculateDistance(alert.lat, alert.lng, curr.lat, curr.lng);
        const prevDist = calculateDistance(alert.lat, alert.lng, prev.lat, prev.lng);
        return currDist < prevDist ? curr : prev;
      }, RESOURCE_LOCATIONS.shelters[0]); // Fallback to closest if none in radius

    const hospitalDist = calculateDistance(alert.lat, alert.lng, nearestHospital.lat, nearestHospital.lng);
    const shelterDist = calculateDistance(alert.lat, alert.lng, nearestShelter.lat, nearestShelter.lng);

    return {
      riskLevel,
      riskScore,
      nearestHospital: { ...nearestHospital, distance: hospitalDist },
      nearestShelter: { ...nearestShelter, distance: shelterDist },
    };
  }, [alert]);

  // Note: Route info is now calculated on the map via OSRM API
  // This provides accurate real-world routing instead of estimates

  if (!alert || !analysis) return null;

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'CRITICAL': return 'bg-red-900 border-red-500 text-red-100';
      case 'HIGH': return 'bg-red-800 border-red-400 text-red-100';
      case 'MEDIUM': return 'bg-yellow-800 border-yellow-400 text-yellow-100';
      case 'LOW': return 'bg-green-800 border-green-400 text-green-100';
      default: return 'bg-gray-800 border-gray-400 text-gray-100';
    }
  };

  const shouldPulse = alert.severity === 'HIGH' && alert.confidence === 'HIGH';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`w-full h-full flex flex-col overflow-y-auto bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 backdrop-blur-xl border-l border-slate-700/50 ${shouldPulse ? 'animate-pulse-soft' : ''}`}
      >
        {/* HEADER WITH SEVERITY INDICATOR */}
        <div className="border-b border-slate-700/50 px-6 py-5 sticky top-0 bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent z-10 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${alert.severity === 'HIGH' ? 'bg-red-500/20' : alert.severity === 'MEDIUM' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                  <AlertTriangle size={20} className={getSeverityColor(alert.severity)} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Crisis Response</p>
                  <p className={`text-sm font-bold ${getSeverityColor(alert.severity)}`}>{alert.severity} SEVERITY</p>
                </div>
              </div>
              <h2 className="text-base font-bold text-white leading-snug mt-1">{alert.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition text-2xl font-bold leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">
          
          {/* 1. RISK ASSESSMENT - CRITICAL SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`rounded-xl p-4 border-2 ${getRiskColor(analysis.riskLevel)} backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap size={18} />
                <p className="text-xs font-bold uppercase tracking-wider">Risk Assessment</p>
              </div>
              <p className="text-2xl font-black">{analysis.riskLevel}</p>
            </div>
            <p className="text-sm leading-relaxed mb-3">{alert.summary}</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-black/30 rounded p-2">
                <p className="text-slate-300 mb-1">Confidence Score</p>
                <p className="font-bold text-lg">{alert.confidence}</p>
              </div>
              <div className="bg-black/30 rounded p-2">
                <p className="text-slate-300 mb-1">Affected People</p>
                <p className="font-bold text-lg">{alert.affectedPeople}+</p>
              </div>
            </div>
          </motion.div>

          {/* 2. RECOMMENDED ACTIONS - MOST IMPORTANT */}
          {alert.recommendedActions && alert.recommendedActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border-2 border-red-500/30 bg-red-900/10 backdrop-blur-sm p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-red-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-red-300">Priority Actions</h3>
              </div>
              <div className="space-y-2.5">
                {alert.recommendedActions.map((action, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + idx * 0.05 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-200 leading-snug flex-1">{action}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. SAFETY GUIDANCE & EVACUATION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-slate-600 bg-slate-800/30 backdrop-blur-sm p-4"
          >
            <h3 className="text-sm font-bold text-yellow-300 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Navigation size={16} /> Guidance
            </h3>
            <div className="space-y-3 text-xs text-slate-200 leading-relaxed">
              <p><span className="font-bold text-yellow-300">DO NOT:</span> Enter affected zone without protective equipment</p>
              <p><span className="font-bold text-yellow-300">DO:</span> Follow emergency services' direction and official safety protocols</p>
              <p><span className="font-bold text-yellow-300">MONITOR:</span> Official channels for status updates every 15 minutes</p>
            </div>
          </motion.div>

          {/* 4. NEAREST SAFE RESOURCES */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-green-600/30 bg-green-900/10 backdrop-blur-sm p-4"
          >
            <h3 className="text-sm font-bold text-green-300 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <MapPin size={16} /> Safe Resources
            </h3>

            <div className="space-y-3">
              {/* Hospital */}
              <div className="bg-black/30 rounded-lg p-3 border border-green-600/20">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">🏥 Hospital</p>
                <p className="font-bold text-green-300 text-sm">{analysis.nearestHospital.name}</p>
                <p className="text-xs text-slate-300 mt-1">
                  {analysis.nearestHospital.distance.toFixed(1)} km away • {analysis.nearestHospital.beds} beds available
                </p>
              </div>

              {/* Shelter */}
              <div className="bg-black/30 rounded-lg p-3 border border-green-600/20">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">🏢 Relief Shelter</p>
                <p className="font-bold text-green-300 text-sm">{analysis.nearestShelter.name}</p>
                <p className="text-xs text-slate-300 mt-1">
                  {analysis.nearestShelter.distance.toFixed(1)} km away • {analysis.nearestShelter.capacity} capacity
                </p>
              </div>
            </div>
          </motion.div>

          {/* 5. PREDICTION - FORWARD INTELLIGENCE */}
          {alert.prediction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-xl border border-blue-600/30 bg-blue-900/10 backdrop-blur-sm p-4"
            >
              <h3 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <TrendingDown size={16} /> Prediction & Timeline
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">{alert.prediction}</p>
            </motion.div>
          )}

          {/* 6. INCIDENT METADATA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-slate-600 bg-slate-800/20 backdrop-blur-sm p-4 grid grid-cols-2 gap-3"
          >
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Time Since Report</p>
              <p className="font-bold text-slate-200"><RelativeTime value={alert.timestamp} /></p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Data Sources</p>
              <p className="font-bold text-slate-200">{alert.sources} sources</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Type</p>
              <p className="font-bold text-slate-200 capitalize">{alert.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Escalation</p>
              <p className="font-bold text-slate-200">{Math.round(alert.escalation || 0)}%</p>
            </div>
          </motion.div>

          {/* RISK FACTORS */}
          {alert.riskFactors && alert.riskFactors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="rounded-xl border border-slate-600 bg-slate-800/20 backdrop-blur-sm p-4"
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Contributing Factors</p>
              <div className="flex flex-wrap gap-2">
                {alert.riskFactors.map((factor, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600">
                    {factor}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* FOOTER - ACTION BUTTONS */}
        <div className="border-t border-slate-700/50 px-6 py-4 bg-gradient-to-t from-slate-900 to-transparent sticky bottom-0 space-y-3 flex-shrink-0">
          {/* Primary Action: View Evacuation Route */}
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRouteToggle?.(alert)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30"
            >
              <Map size={18} />
              {routeVisible ? 'HIDE ROUTE' : 'VIEW EVACUATION ROUTE'}
            </motion.button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            {/* Find Safe Zone */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/30 text-sm"
            >
              <Home size={16} />
              SAFE ZONE
            </motion.button>

            {/* Alert to Responders */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                // Simulate dispatch delay
                setAlertSent(true);
                onAlert?.(alert);
                setTimeout(() => {
                  setAlertSent(false);
                }, 2000);
              }}
              disabled={alertSent}
              className={`font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm ${
                alertSent
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/30'
              }`}
            >
              <Send size={16} />
              {alertSent ? 'SENT' : 'ALERT'}
            </motion.button>
          </div>

          <p className="text-xs text-center text-slate-400">Real-time crisis intelligence • System monitoring active</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
