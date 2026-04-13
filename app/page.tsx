'use client';

/**
 * CRYSIS_OS - ADMIN DASHBOARD
 * 
 * ==========================================
 * ⚠️ THIS APPLICATION IS READ-ONLY ADMIN DASHBOARD ONLY
 * 
 * Citizen incident reporting is handled in a separate application.
 * DO NOT add reporting functionality to this dashboard.
 * 
 * PERMITTED: 
 * - Display incidents from Firestore
 * - Real-time incident monitoring
 * - Route planning and display
 * - Emergency response coordination UI
 * 
 * NOT PERMITTED:
 * - Citizen incident submissions
 * - Geolocation capture from public users
 * - Direct Firestore writes from frontend
 * - SOS signal creation
 * ==========================================
 */

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import IconSidebar from '@/components/IconSidebar';
import IntelligenceFeed from '@/components/IntelligenceFeed';
import CrisisResponsePanel from '@/components/CrisisResponsePanel';
import { useToast, ToastContainer } from '@/components/Toast';
import { INITIAL_DISASTERS, INITIAL_SAFE_ZONES } from '@/lib/mockData';
import type { Disaster, SafeZone } from '@/lib/mockData';
import { apiService } from '@/lib/api';
import { incidentService } from '@/lib/api/incidents';

// Dynamic imports for browser-only components
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });
const ZoneLabels = dynamic(() => import('@/components/ZoneLabels'), { ssr: false });
const HeatmapLayer = dynamic(() => import('@/components/HeatmapLayer'), { ssr: false });

export default function CommandCenter() {
  // Essential state only
  const [disasters, setDisasters] = useState<Disaster[]>(INITIAL_DISASTERS);
  const [safeZones, setSafeZones] = useState<SafeZone[]>(INITIAL_SAFE_ZONES);
  const [selectedAlert, setSelectedAlert] = useState<Disaster | null>(null);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [routeVisible, setRouteVisible] = useState(false);
  const [mapRef, setMapRef] = useState<any>(null);
  const [loading, setLoading] = useState(false); // Start with false - show content immediately
  const { toasts, showToast } = useToast();

  // Real-time Firestore listener for incidents (non-blocking)
  useEffect(() => {
    // Page loads immediately with mock data - real-time listener updates in background
    
    // Subscribe to real-time incident updates from Firestore
    const unsubscribe = incidentService.getIncidentsRealtime((incidents) => {
      if (incidents && incidents.length > 0) {
        setDisasters(incidents as Disaster[]);
      } else {
        // Fall back to mock data if no real incidents
        setDisasters(INITIAL_DISASTERS);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleAlertSelect = useCallback((alert: Disaster) => {
    setSelectedAlert(alert);
    setRouteVisible(false);
    setActiveRoute(null);
  }, []);

  const handleToggleRoute = useCallback((alert: Disaster) => {
    setRouteVisible(!routeVisible);
    setActiveRoute(!routeVisible ? alert.id : null);
  }, [routeVisible]);

  const handleMapReady = useCallback((mapInstance: any) => {
    setMapRef(mapInstance);
  }, []);

  // Simple heatmap data generation
  const heatmapData = disasters.map((d) => ({
    lat: d.lat,
    lng: d.lng,
    intensity: d.severity === 'HIGH' ? 0.9 : d.severity === 'MEDIUM' ? 0.65 : 0.45,
  }));

  if (loading) {
    return (
      <div className="w-screen h-screen bg-crisis-dark text-white flex items-center justify-center">
        <p className="text-gray-400">Loading disaster data...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-crisis-dark text-white flex flex-col" style={{ backgroundColor: '#0B1220' }}>
      <Navbar activeAlerts={disasters.length} />

      <div className="flex flex-1 overflow-hidden relative bg-crisis-dark" style={{ backgroundColor: '#0B1220', paddingTop: '4rem' }}>
        <div className="hidden lg:block">
          <IconSidebar currentPage="map" />
        </div>

        {/* Desktop left panel */}
        <div className="hidden lg:flex h-full flex-shrink-0">
          <div className="w-20 flex-shrink-0" />
          <AnimatePresence>
            {selectedAlert && (
              <motion.div
                initial={{ opacity: 0, x: -380 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -380 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-96 h-full bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 backdrop-blur-xl border-r border-slate-700/50 flex-shrink-0 z-40 shadow-2xl overflow-y-auto"
              >
                <CrisisResponsePanel
                  alert={selectedAlert}
                  safeZones={safeZones}
                  routeVisible={routeVisible}
                  onRouteToggle={handleToggleRoute}
                  onClose={() => setSelectedAlert(null)}
                  onAlert={() => {
                    showToast(`Alert sent to responders for ${selectedAlert.title}`, 'success');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map Section */}
        <div className="flex-1 relative h-full bg-black map-panel" style={{ backgroundColor: '#000000' }}>
          <Suspense fallback={<div className="w-full h-full bg-black/50 flex items-center justify-center text-gray-400">Loading map...</div>}>
            <MapView
              disasters={disasters}
              sosSignals={[]}
              safeZones={safeZones}
              selectedAlert={selectedAlert}
              activeRoute={activeRoute}
              onMarkerClick={handleAlertSelect}
              onMapReady={handleMapReady}
              showHeatmap={true}
            />
            <HeatmapLayer map={mapRef} heatmapData={heatmapData} visible={true} />
            <ZoneLabels map={mapRef} disasters={disasters} safeZones={safeZones} selectedAlert={selectedAlert} />
          </Suspense>
        </div>

        {/* Desktop right panel - Intelligence feed */}
        <AnimatePresence>
          {!selectedAlert && (
            <motion.div
              initial={{ opacity: 0, x: 380 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 380 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="hidden xl:flex relative w-96 h-full bg-black/55 backdrop-blur-md border-l border-crisis-edge flex flex-col z-40 overflow-hidden shadow-2xl flex-shrink-0"
            >
              <div className="absolute inset-y-0 -left-4 w-4 bg-gradient-to-r from-transparent to-black/35 pointer-events-none" />
              <IntelligenceFeed
                alerts={disasters}
                onAlertSelect={handleAlertSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile bottom sheet */}
        <AnimatePresence>
          {selectedAlert && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden absolute inset-x-0 bottom-0 max-h-[70vh] sm:max-h-[60vh] bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/90 backdrop-blur-xl border-t border-slate-700/50 z-40 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-center py-2 sticky top-0">
                <div className="w-12 h-1 bg-slate-600 rounded-full" />
              </div>
              <div className="px-4 pb-8">
                <CrisisResponsePanel
                  alert={selectedAlert}
                  safeZones={safeZones}
                  routeVisible={routeVisible}
                  onRouteToggle={handleToggleRoute}
                  onClose={() => setSelectedAlert(null)}
                  onAlert={() => {
                    showToast(`Alert sent to responders for ${selectedAlert.title}`, 'success');
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay container */}
      <div className="fixed inset-0 z-[1200] pointer-events-none">
        {/* Toasts */}
        <ToastContainer toasts={toasts} />
      </div>
    </div>
  );
}