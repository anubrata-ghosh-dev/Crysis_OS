'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Disaster, SOSSignal } from '@/lib/mockData';
import { getColorBySeverity } from '@/lib/utils';

interface MapViewProps {
  disasters: Disaster[];
  sosSignals: SOSSignal[];
  timelineProgress?: number;
  selectedAlert?: Disaster | null;
  onMarkerClick?: (alert: Disaster, latlng: [number, number]) => void;
  onMapReady?: (map: L.Map) => void;
  showHeatmap?: boolean;
}

export default function MapView({ 
  disasters, 
  sosSignals, 
  timelineProgress = 0,
  selectedAlert, 
  onMarkerClick,
  onMapReady,
  showHeatmap = true 
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const sosMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const impactCirclesRef = useRef<Map<string, L.Circle>>(new Map());

  // Helper: Get marker size based on severity and escalation
  const getMarkerSize = (disaster: Disaster) => {
    const baseSize = disaster.severity === 'HIGH' ? 32 : disaster.severity === 'MEDIUM' ? 24 : 18;
    const escalationBoost = (disaster.escalation || 0) / 100 * 8;
    const replayBoost = timelineProgress * 6;
    return Math.floor(baseSize + escalationBoost + replayBoost);
  };

  // Helper: Get glow intensity based on severity and escalation
  const getGlowIntensity = (disaster: Disaster) => {
    const baseIntensity = disaster.severity === 'HIGH' ? 25 : disaster.severity === 'MEDIUM' ? 15 : 10;
    const escalationBoost = (disaster.escalation || 0) / 100 * 15;
    const replayBoost = timelineProgress * 14;
    return baseIntensity + escalationBoost + replayBoost;
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      try {
        const container = document.getElementById('map-container');
        if (!container) return;

        // Ensure Leaflet default icon paths are set
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        mapRef.current = L.map('map-container', {
          center: [28.6139, 77.2090], // Delhi, India
          zoom: 10,
          zoomControl: true,
          attributionControl: true,
          renderer: L.canvas(),
        });

        // Custom tile layer with dark theme (CartoDB Dark)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          maxZoom: 19,
        }).addTo(mapRef.current);

        // Disable default zoom on scroll
        mapRef.current.scrollWheelZoom.disable();
        
        // Critical: Call invalidateSize after rendering to ensure proper display
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
            // Notify parent that map is ready
            onMapReady?.(mapRef.current);
          }
        }, 100);
        
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    }
  }, [onMapReady]);

  // Update disaster markers
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Clear old markers - ensure all are properly removed
      markersRef.current.forEach((marker) => {
        try {
          mapRef.current?.removeLayer(marker);
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
      markersRef.current.clear();
      impactCirclesRef.current.forEach((circle) => {
        try {
          mapRef.current?.removeLayer(circle);
        } catch (e) {
          console.warn('Error removing impact circle:', e);
        }
      });
      impactCirclesRef.current.clear();

      // Add new markers with escalation logic
      disasters.forEach((disaster) => {
        const color = getColorBySeverity(disaster.severity);
        const size = getMarkerSize(disaster);
        const glowIntensity = getGlowIntensity(disaster);

        // Create custom HTML for marker with pulsing animation
        const markerHtml = `
          <div style="
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            width: ${size}px;
            height: ${size}px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}80;
            animation: marker-enter 0.25s ease-out, ${disaster.severity === 'HIGH' ? 'marker-pulse-intense' : 'marker-pulse'} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          "></div>
        `;

        const marker = L.marker([disaster.lat, disaster.lng], {
          icon: L.divIcon({
            html: markerHtml,
            iconSize: [size, size],
            className: `marker-${disaster.id}`,
          }),
        }).addTo(mapRef.current!);

        marker.on('click', () => {
          onMarkerClick?.(disaster, [disaster.lat, disaster.lng]);
        });

        markersRef.current.set(disaster.id, marker);
        const impactBase = disaster.severity === 'HIGH' ? 1300 : disaster.severity === 'MEDIUM' ? 900 : 600;
        const impactRadius = impactBase * (0.35 + timelineProgress * 0.65);
        const impactCircle = L.circle([disaster.lat, disaster.lng], {
          radius: impactRadius,
          color,
          weight: 1,
          opacity: 0.45,
          fillColor: color,
          fillOpacity: 0.08 + timelineProgress * 0.12,
        }).addTo(mapRef.current!);
        impactCirclesRef.current.set(disaster.id, impactCircle);
      });
    } catch (error) {
      console.error('Error updating disaster markers:', error);
    }
  }, [disasters, onMarkerClick, timelineProgress]);

  // Update SOS markers
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Clear old SOS markers - ensure all are properly removed
      sosMarkersRef.current.forEach((marker) => {
        try {
          mapRef.current?.removeLayer(marker);
        } catch (e) {
          console.warn('Error removing SOS marker:', e);
        }
      });
      sosMarkersRef.current.clear();

      // Add new SOS markers
      sosSignals.forEach((sos) => {
        const markerHtml = `
          <div style="background-color: #FFB800; border: 2px solid white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px #FFB800; animation: marker-enter 0.25s ease-out, marker-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        `;

        const marker = L.marker([sos.lat, sos.lng], {
          icon: L.divIcon({
            html: markerHtml,
            iconSize: [18, 18],
            className: `marker-sos-${sos.id}`,
          }),
        }).addTo(mapRef.current!);

        sosMarkersRef.current.set(sos.id, marker);
      });
    } catch (error) {
      console.error('Error updating SOS markers:', error);
    }
  }, [sosSignals]);

  // Highlight selected alert
  useEffect(() => {
    if (!mapRef.current || !selectedAlert) return;

    try {
      // Pan to marker
      mapRef.current.flyTo([selectedAlert.lat, selectedAlert.lng], 14, {
        duration: 1,
      });
    } catch (error) {
      console.error('Error panning to alert:', error);
    }
  }, [selectedAlert]);

  // Cleanup map and markers on unmount to prevent stale overlays/ghost markers.
  useEffect(() => {
    return () => {
      try {
        if (mapRef.current) {
          markersRef.current.forEach((marker) => {
            mapRef.current?.removeLayer(marker);
          });
          impactCirclesRef.current.forEach((circle) => {
            mapRef.current?.removeLayer(circle);
          });
          sosMarkersRef.current.forEach((marker) => {
            mapRef.current?.removeLayer(marker);
          });
          markersRef.current.clear();
          impactCirclesRef.current.clear();
          sosMarkersRef.current.clear();
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch (error) {
        console.error('Error during map cleanup:', error);
      }
    };
  }, []);

  return (
    <div 
      id="map-container" 
      className="w-full h-full rounded-none animate-fade-in" 
      style={{ pointerEvents: 'auto' }}
    />
  );
}
