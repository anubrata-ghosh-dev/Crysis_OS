'use client';

import React, { useEffect, useState, Suspense, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import IconSidebar from '@/components/IconSidebar';
import IntelligenceFeed from '@/components/IntelligenceFeed';
import DecisionPanel from '@/components/DecisionPanel';
import TimelinePlayback from '@/components/TimelinePlayback';
import DecisionStats from '@/components/DecisionStats';
import SOSButton from '@/components/SOSButton';
import ResourceBar from '@/components/ResourceBar';

// Dynamic imports for components that use browser-only libraries (Leaflet)
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });
const ZoneLabels = dynamic(() => import('@/components/ZoneLabels'), { ssr: false });
const HeatmapLayer = dynamic(() => import('@/components/HeatmapLayer'), { ssr: false });
import { INITIAL_DISASTERS, INITIAL_SOS } from '@/lib/mockData';
import type { Disaster, SOSSignal, HeatmapPoint } from '@/lib/mockData';

export default function CommandCenter() {
  const [disasters, setDisasters] = useState<Disaster[]>(INITIAL_DISASTERS);
  const [sosSignals, setSosSignals] = useState<SOSSignal[]>(INITIAL_SOS);
  const [selectedAlert, setSelectedAlert] = useState<Disaster | null>(null);
  const [newAlertIds, setNewAlertIds] = useState<string[]>([]);
  const [mapRef, setMapRef] = useState<any>(null);
  const [timelineMinutes, setTimelineMinutes] = useState(60);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [timelineSpeed, setTimelineSpeed] = useState(1);

  const replayWindowMs = 60 * 60000;

  const replayState = useMemo(() => {
    const now = Date.now();
    const replayStart = now - replayWindowMs;
    const replayTime = replayStart + (timelineMinutes / 60) * replayWindowMs;
    return { replayStart, replayTime, progress: timelineMinutes / 60 };
  }, [timelineMinutes]);

  const filteredDisasters = useMemo(() => {
    const { replayStart, replayTime } = replayState;
    return disasters.filter((disaster) => {
      const ts = new Date(disaster.timestamp).getTime();
      return ts >= replayStart && ts <= replayTime;
    });
  }, [disasters, replayState]);

  const filteredSosSignals = useMemo(() => {
    const { replayStart, replayTime } = replayState;
    return sosSignals.filter((sos) => {
      const ts = new Date(sos.timestamp).getTime();
      return ts >= replayStart && ts <= replayTime;
    });
  }, [sosSignals, replayState]);

  const replayHeatmapData = useMemo<HeatmapPoint[]>(() => {
    return filteredDisasters.map((d) => {
      const base = d.severity === 'HIGH' ? 0.9 : d.severity === 'MEDIUM' ? 0.65 : 0.45;
      const escalationFactor = (d.escalation || 0) / 100;
      const intensity = Math.min(1, base * (0.35 + replayState.progress * 0.65) + escalationFactor * 0.2);
      return { lat: d.lat, lng: d.lng, intensity };
    });
  }, [filteredDisasters, replayState.progress]);

  // Simulate escalation: increase severity and affected people over time
  useEffect(() => {
    const escalationInterval = setInterval(() => {
      setDisasters((prev) =>
        prev.map((d) => ({
          ...d,
          escalation: Math.min((d.escalation || 0) + Math.random() * 5, 100),
          affectedPeople: Math.max(d.affectedPeople + Math.floor(Math.random() * 15 - 5), 10),
          sources: Math.min(d.sources + (Math.random() > 0.7 ? 1 : 0), 100),
        }))
      );
    }, 7000);

    return () => clearInterval(escalationInterval);
  }, []);

  // Simulate occasional new SOS signals
  useEffect(() => {
    const sosInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // Indian disaster zones for random SOS generation
        const zones = [
          { lat: 19.1136, lng: 72.8697, name: 'Mumbai' }, // Mumbai flood zone
          { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar' }, // Odisha cyclone zone
          { lat: 28.6139, lng: 77.2090, name: 'Delhi' }, // Delhi heatwave zone
        ];
        const zone = zones[Math.floor(Math.random() * zones.length)];
        
        const newSOS: SOSSignal = {
          id: `sos-${Date.now()}`,
          lat: zone.lat + (Math.random() - 0.5) * 0.05,
          lng: zone.lng + (Math.random() - 0.5) * 0.05,
          type: ['flood', 'fire', 'medical', 'other'][Math.floor(Math.random() * 4)] as any,
          status: 'pending',
          timestamp: new Date().toISOString(),
          description: 'Urgent assistance required',
          userLocation: `${zone.name} Emergency Zone`,
        };

        setSosSignals((prev) => [newSOS, ...prev.slice(0, 9)]);
      }
    }, 8000);

    return () => clearInterval(sosInterval);
  }, []);

  useEffect(() => {
    if (!isPlayingTimeline) return;

    const playbackInterval = setInterval(() => {
      setTimelineMinutes((prev) => {
        const next = prev + timelineSpeed;
        if (next >= 60) {
          setIsPlayingTimeline(false);
          return 60;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(playbackInterval);
  }, [isPlayingTimeline, timelineSpeed]);

  useEffect(() => {
    if (!selectedAlert) return;
    const stillVisible = filteredDisasters.some((d) => d.id === selectedAlert.id);
    if (!stillVisible) {
      setSelectedAlert(null);
    }
  }, [filteredDisasters, selectedAlert]);

  const handleAlertSelect = useCallback((alert: Disaster) => {
    setSelectedAlert(alert);
  }, []);

  const handleTimelineChange = useCallback((minutes: number) => {
    setTimelineMinutes(minutes);
  }, []);

  const handleTimelinePlaybackChange = useCallback((isPlaying: boolean, speed: number) => {
    setIsPlayingTimeline(isPlaying);
    setTimelineSpeed(speed);
  }, []);

  const handleMapReady = useCallback((mapInstance: any) => {
    setMapRef(mapInstance);
  }, []);

  return (
    <div className="w-screen h-screen bg-crisis-dark text-white flex flex-col" style={{ backgroundColor: '#0B1220' }}>
      {/* Navbar */}
      <Navbar activeAlerts={filteredDisasters.length} />

      {/* Main Content Area - Flexbox row */}
      <div className="flex flex-1 overflow-hidden relative bg-crisis-dark pt-16" style={{ backgroundColor: '#0B1220' }}>
        {/* Icon Sidebar (Fixed overlay) */}
        <IconSidebar currentPage="map" />

        {/* Spacer for fixed sidebar */}
        <div className="w-20 flex-shrink-0" />

        {/* Map Section */}
        <div className="flex-1 relative h-full bg-black map-panel" style={{ backgroundColor: '#000000' }}>
          {/* Wrap dynamic components in Suspense to prevent unmounting on load */}
          <Suspense fallback={<div className="w-full h-full bg-black/50 flex items-center justify-center text-gray-400">Initializing map...</div>}>
            <MapView
              disasters={filteredDisasters}
              sosSignals={filteredSosSignals}
              timelineProgress={replayState.progress}
              selectedAlert={selectedAlert}
              onMarkerClick={handleAlertSelect}
              onMapReady={handleMapReady}
              showHeatmap={true}
            />
          </Suspense>

          <Suspense fallback={null}>
            <HeatmapLayer map={mapRef} heatmapData={replayHeatmapData} visible={true} />
          </Suspense>

          {/* Zone Labels - wrapped in Suspense */}
          <Suspense fallback={null}>
            <ZoneLabels map={mapRef} disasters={filteredDisasters} />
          </Suspense>
        </div>

        {/* Right Panel - Intelligence Feed or Decision Panel */}
        <div className="relative w-96 h-full bg-black/55 backdrop-blur-md border-l border-crisis-edge flex flex-col z-40 overflow-hidden shadow-2xl">
          <div className="absolute inset-y-0 -left-4 w-4 bg-gradient-to-r from-transparent to-black/35 pointer-events-none" />
          {selectedAlert ? (
            <DecisionPanel
              alert={selectedAlert}
              onClose={() => setSelectedAlert(null)}
            />
          ) : (
            <IntelligenceFeed
              alerts={filteredDisasters}
              onAlertSelect={handleAlertSelect}
              newAlertIds={newAlertIds}
              timelineMinutes={timelineMinutes}
              isPlaying={isPlayingTimeline}
            />
          )}
        </div>
      </div>

      {/* OverlayContainer: stable command interface layer above map */}
      <div className="fixed inset-0 z-[1200] pointer-events-none">
        <div className="absolute top-20 left-24 pointer-events-auto glass-panel-dark rounded-xl border border-crisis-edge px-4 py-3 shadow-2xl">
          <DecisionStats disasters={filteredDisasters} />
        </div>

        <AnimatePresence>
          {selectedAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-24 left-24 w-80 glass-panel rounded-lg p-4 border border-crisis-cyan glow-cyan pointer-events-auto"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-crisis-cyan flex-1">{selectedAlert.title}</h3>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-crisis-cyan transition text-lg font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-300 mb-4">{selectedAlert.summary}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 border-t border-crisis-edge pt-3">
                <div>
                  <span className="text-crisis-cyan font-bold">Severity:</span> {selectedAlert.severity}
                </div>
                <div>
                  <span className="text-crisis-cyan font-bold">Affected:</span> {selectedAlert.affectedPeople}+
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <TimelinePlayback
          currentTime={timelineMinutes}
          isPlaying={isPlayingTimeline}
          onTimeChange={handleTimelineChange}
          onPlaybackChange={handleTimelinePlaybackChange}
        />

        <ResourceBar />

        <SOSButton />
      </div>
    </div>
  );
}
