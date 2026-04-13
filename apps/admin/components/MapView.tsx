'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Disaster, SOSSignal, SafeZone } from '@/lib/mockData';
import { getColorBySeverity } from '@/lib/utils';
import { fetchOSRMRoute } from '@/lib/osrmRouting';

interface MapViewProps {
  disasters: Disaster[];
  sosSignals: SOSSignal[];
  safeZones?: SafeZone[];
  selectedAlert?: Disaster | null;
  activeRoute?: string | null;
  onMarkerClick?: (alert: Disaster, latlng: [number, number]) => void;
  onMapReady?: (map: L.Map) => void;
  showHeatmap?: boolean;
}

export default function MapView({ 
  disasters, 
  sosSignals, 
  safeZones = [],
  selectedAlert, 
  activeRoute,
  onMarkerClick,
  onMapReady,
  showHeatmap = true 
}: MapViewProps) {
  const [routeLoading, setRouteLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const safeZoneMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const sosMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const impactCirclesRef = useRef<Map<string, L.Circle>>(new Map());
  const selectedMarkerRingRef = useRef<L.Circle | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeStartMarkerRef = useRef<L.Marker | null>(null);
  const routeEndMarkerRef = useRef<L.Marker | null>(null);
  const focusOverlayRef = useRef<HTMLDivElement | null>(null);

  // Helper: Get marker size based on severity and escalation
  const getMarkerSize = (disaster: Disaster, isSelected?: boolean) => {
    const baseSize = disaster.severity === 'HIGH' ? 32 : disaster.severity === 'MEDIUM' ? 24 : 18;
    const escalationBoost = (disaster.escalation || 0) / 100 * 8;
    const selectedBoost = isSelected ? 15 : 0;
    return Math.floor(baseSize + escalationBoost + selectedBoost);
  };

  // Helper: Get glow intensity based on severity and escalation
  const getGlowIntensity = (disaster: Disaster, isSelected?: boolean) => {
    const baseIntensity = disaster.severity === 'HIGH' ? 25 : disaster.severity === 'MEDIUM' ? 15 : 10;
    const escalationBoost = (disaster.escalation || 0) / 100 * 15;
    const selectedBoost = isSelected ? 20 : 0;
    return baseIntensity + escalationBoost + selectedBoost;
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
          center: [22.5, 78.9], // India center
          zoom: 4, // Show entire India
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
            cursor: pointer;
            transition: all 0.3s ease;
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

        // Hover effect - add a semi-transparent ring
        marker.on('mouseover', () => {
          const markerElement = document.querySelector(`.marker-${disaster.id}`);
          if (markerElement) {
            (markerElement as HTMLElement).style.transform = 'scale(1.15)';
            (markerElement as HTMLElement).style.filter = 'brightness(1.2)';
          }
        });

        marker.on('mouseout', () => {
          const markerElement = document.querySelector(`.marker-${disaster.id}`);
          if (markerElement) {
            (markerElement as HTMLElement).style.transform = '';
            (markerElement as HTMLElement).style.filter = '';
          }
        });

        markersRef.current.set(disaster.id, marker);
        const impactBase = disaster.severity === 'HIGH' ? 1300 : disaster.severity === 'MEDIUM' ? 900 : 600;
        const impactRadius = impactBase;
        const impactCircle = L.circle([disaster.lat, disaster.lng], {
          radius: impactRadius,
          color,
          weight: 1,
          opacity: 0.45,
          fillColor: color,
          fillOpacity: 0.2,
        }).addTo(mapRef.current!);
        impactCirclesRef.current.set(disaster.id, impactCircle);
      });
    } catch (error) {
      console.error('Error updating disaster markers:', error);
    }
  }, [disasters, onMarkerClick]);

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

  // Update Safe Zone markers
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Clear old safe zone markers
      safeZoneMarkersRef.current.forEach((marker) => {
        try {
          mapRef.current?.removeLayer(marker);
        } catch (e) {
          console.warn('Error removing safe zone marker:', e);
        }
      });
      safeZoneMarkersRef.current.clear();

      // Add new safe zone markers (green, calm, static)
      safeZones.forEach((zone) => {
        const markerHtml = `
          <div style="
            background-color: #22c55e;
            border: 2.5px solid white;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.8);
            font-size: 16px;
            color: white;
            font-weight: bold;
          ">
            ✓
          </div>
        `;

        const marker = L.marker([zone.lat, zone.lng], {
          icon: L.divIcon({
            html: markerHtml,
            iconSize: [28, 28],
            className: `marker-safe-zone-${zone.id}`,
          }),
        }).addTo(mapRef.current!);

        // Hover effect for safe zones
        marker.on('mouseover', () => {
          const markerElement = document.querySelector(`.marker-safe-zone-${zone.id}`);
          if (markerElement) {
            (markerElement as HTMLElement).style.transform = 'scale(1.2)';
            (markerElement as HTMLElement).style.filter = 'brightness(1.3)';
          }
        });

        marker.on('mouseout', () => {
          const markerElement = document.querySelector(`.marker-safe-zone-${zone.id}`);
          if (markerElement) {
            (markerElement as HTMLElement).style.transform = '';
            (markerElement as HTMLElement).style.filter = '';
          }
        });

        safeZoneMarkersRef.current.set(zone.id, marker);
      });
    } catch (error) {
      console.error('Error updating safe zone markers:', error);
    }
  }, [safeZones]);

  // Effect: Handle selection ring and camera movement
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Remove old selected ring if it exists
      if (selectedMarkerRingRef.current) {
        mapRef.current.removeLayer(selectedMarkerRingRef.current);
        selectedMarkerRingRef.current = null;
      }

      // Update focus mode overlay
      if (focusOverlayRef.current) {
        if (selectedAlert) {
          // Show focus mode: dim background
          focusOverlayRef.current.style.opacity = '0.6';
          focusOverlayRef.current.style.pointerEvents = 'none';
          
          // Dim all non-selected markers
          markersRef.current.forEach((marker, id) => {
            const element = document.querySelector(`.marker-${id}`) as HTMLElement;
            if (element) {
              if (id === selectedAlert.id) {
                // Selected marker: brighten
                element.style.opacity = '1';
                element.style.filter = 'brightness(1.3)';
              } else {
                // Non-selected markers: dim
                element.style.opacity = '0.4';
                element.style.filter = 'brightness(0.7)';
              }
            }
          });

          // Dim SOS signals
          sosMarkersRef.current.forEach((marker, id) => {
            const element = document.querySelector(`.marker-sos-${id}`) as HTMLElement;
            if (element) {
              element.style.opacity = '0.3';
              element.style.filter = 'brightness(0.6)';
            }
          });

          // Dim safe zones
          safeZoneMarkersRef.current.forEach((marker, id) => {
            const element = document.querySelector(`.marker-safe-zone-${id}`) as HTMLElement;
            if (element) {
              element.style.opacity = '0.5';
              element.style.filter = 'brightness(0.8)';
            }
          });
        } else {
          // Clear focus mode: restore all markers
          focusOverlayRef.current.style.opacity = '0';
          focusOverlayRef.current.style.pointerEvents = 'auto';

          markersRef.current.forEach((marker, id) => {
            const element = document.querySelector(`.marker-${id}`) as HTMLElement;
            if (element) {
              element.style.opacity = '1';
              element.style.filter = 'brightness(1)';
            }
          });

          sosMarkersRef.current.forEach((marker, id) => {
            const element = document.querySelector(`.marker-sos-${id}`) as HTMLElement;
            if (element) {
              element.style.opacity = '1';
              element.style.filter = 'brightness(1)';
            }
          });

          safeZoneMarkersRef.current.forEach((marker, id) => {
            const element = document.querySelector(`.marker-safe-zone-${id}`) as HTMLElement;
            if (element) {
              element.style.opacity = '1';
              element.style.filter = 'brightness(1)';
            }
          });
        }
      }

      if (selectedAlert) {
        // Pan to marker with smooth animation
        mapRef.current.flyTo([selectedAlert.lat, selectedAlert.lng], 14, {
          duration: 1,
        });

        // Add a selection ring around the selected marker
        const color = getColorBySeverity(selectedAlert.severity);
        selectedMarkerRingRef.current = L.circle([selectedAlert.lat, selectedAlert.lng], {
          radius: 400,
          color: color,
          weight: 3,
          opacity: 0.8,
          fillColor: color,
          fillOpacity: 0.15,
          dashArray: '10, 5',
          lineCap: 'round',
        }).addTo(mapRef.current);

        // Add a pulsing animation to the ring using CSS
        const ringElement = document.querySelector(`.leaflet-circle[style*="dash"]`);
        if (ringElement) {
          (ringElement as SVGElement).style.animation = 'selection-pulse 1.5s ease-in-out infinite';
        }
      }
    } catch (error) {
      console.error('Error highlighting selected alert:', error);
    }
  }, [selectedAlert]);

  // Effect: Handle route rendering (independent of popup visibility)
  // CRITICAL: Routes persist independently of popup state - decoupled state management
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // If no active route, clear everything
      if (!activeRoute) {
        if (routePolylineRef.current) {
          try {
            mapRef.current.removeLayer(routePolylineRef.current);
          } catch (e) {
            console.warn('Error removing route polyline:', e);
          }
          routePolylineRef.current = null;
        }
        if (routeStartMarkerRef.current) {
          try {
            mapRef.current.removeLayer(routeStartMarkerRef.current);
          } catch (e) {
            console.warn('Error removing start marker:', e);
          }
          routeStartMarkerRef.current = null;
        }
        if (routeEndMarkerRef.current) {
          try {
            mapRef.current.removeLayer(routeEndMarkerRef.current);
          } catch (e) {
            console.warn('Error removing end marker:', e);
          }
          routeEndMarkerRef.current = null;
        }
        return;
      }

      // Find the alert corresponding to the active route
      const routeAlert = disasters.find((d) => d.id === activeRoute);
      if (!routeAlert) return;

      // Find the related safe zone
      const relatedSafeZone = safeZones.find((z) => z.relatedAlertId === activeRoute);
      if (!relatedSafeZone) return;

      // Fetch and render REAL routing - uses OSRM with fallback
      setRouteLoading(true);
      fetchOSRMRoute(
        { lat: routeAlert.lat, lng: routeAlert.lng },
        { lat: relatedSafeZone.lat, lng: relatedSafeZone.lng }
      )
        .then((routeResult) => {
          // Defensive: Prevent rendering stale route if state changed
          if (!mapRef.current || !activeRoute) return;
          const stillActive = disasters.some((d) => d.id === activeRoute);
          if (!stillActive) return;

          // Clean up old route
          if (routePolylineRef.current) {
            try {
              mapRef.current.removeLayer(routePolylineRef.current);
            } catch (e) {
              console.warn('Error removing old route polyline:', e);
            }
          }

          // Draw new polyline with route coordinates
          // PRODUCTION QUALITY:
          // - Real OSRM routes: solid blue (#3b82f6), 5px weight
          // - Fallback curves: dashed blue (#3b82f6), 4px weight (marked so user knows it's estimated)
          // - Never straight lines - fallback ensures curves
          routePolylineRef.current = L.polyline(
            routeResult.coordinates.map((p) => [p.lat, p.lng]),
            {
              color: '#3b82f6',
              weight: routeResult.success ? 5 : 4,
              opacity: 0.9,
              dashArray: routeResult.success ? '0' : '5, 5', // Dashed = fallback/estimate
              lineCap: 'round',
              lineJoin: 'round',
              className: 'evacuation-route',
            }
          ).addTo(mapRef.current);

          // Add start marker (incident location - red alert icon)
          if (routeStartMarkerRef.current) {
            try {
              mapRef.current.removeLayer(routeStartMarkerRef.current);
            } catch (e) {
              console.warn('Error removing old start marker:', e);
            }
          }
          routeStartMarkerRef.current = L.marker([routeAlert.lat, routeAlert.lng], {
            icon: L.divIcon({
              html: `<div style="
                font-size: 28px; 
                color: #ef4444; 
                text-shadow: 0 0 3px rgba(0,0,0,0.8);
                filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
              ">🚨</div>`,
              iconSize: [40, 40],
              className: 'route-start-marker',
            }),
          })
            .addTo(mapRef.current)
            .bindPopup('Incident Location', { closeButton: false, offset: [0, -10] });

          // Add end marker
          if (routeEndMarkerRef.current) {
            try {
              mapRef.current.removeLayer(routeEndMarkerRef.current);
            } catch (e) {
              console.warn('Error removing old end marker:', e);
            }
          }
          routeEndMarkerRef.current = L.marker([relatedSafeZone.lat, relatedSafeZone.lng], {
            icon: L.divIcon({
              html: `<div style="
                font-size: 28px; 
                color: #22c55e; 
                text-shadow: 0 0 3px rgba(0,0,0,0.8);
                filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6));
              ">✓</div>`,
              iconSize: [40, 40],
              className: 'route-end-marker',
            }),
          })
            .addTo(mapRef.current)
              .bindPopup(`Safe Zone: ${relatedSafeZone.title}`, { closeButton: false, offset: [0, -10] });
          
          // Fit bounds between incident and safe zone with comfortable padding
          // Ensures both start (incident) and end (safe zone) are visible
          const bounds = L.latLngBounds([
            [routeAlert.lat, routeAlert.lng],
            [relatedSafeZone.lat, relatedSafeZone.lng],
          ]);
          mapRef.current.fitBounds(bounds, { padding: [100, 100], maxZoom: 14, animate: true });

          // Route successfully rendered
        })
        .catch((error) => {
          console.error('Error fetching route:', error);
          // Route should still be rendered with fallback - error is already handled in fetchOSRMRoute
          setRouteLoading(false);
        })
        .finally(() => {
          setRouteLoading(false);
        });
    } catch (error) {
      console.error('Error managing route:', error);
      setRouteLoading(false);
    }
  }, [activeRoute, disasters, safeZones]);

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
          safeZoneMarkersRef.current.forEach((marker) => {
            mapRef.current?.removeLayer(marker);
          });
          if (selectedMarkerRingRef.current) {
            mapRef.current.removeLayer(selectedMarkerRingRef.current);
            selectedMarkerRingRef.current = null;
          }
          if (routePolylineRef.current) {
            mapRef.current.removeLayer(routePolylineRef.current);
            routePolylineRef.current = null;
          }
          if (routeStartMarkerRef.current) {
            mapRef.current.removeLayer(routeStartMarkerRef.current);
            routeStartMarkerRef.current = null;
          }
          if (routeEndMarkerRef.current) {
            mapRef.current.removeLayer(routeEndMarkerRef.current);
            routeEndMarkerRef.current = null;
          }
          markersRef.current.clear();
          impactCirclesRef.current.clear();
          sosMarkersRef.current.clear();
          safeZoneMarkersRef.current.clear();
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
      className="w-full h-full rounded-none animate-fade-in relative"
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        id="map-container" 
        className="w-full h-full rounded-none" 
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* Focus mode overlay - dims non-selected markers when incident is selected */}
      <div
        ref={focusOverlayRef}
        className="absolute inset-0 bg-black transition-opacity duration-200 pointer-events-none z-[0]"
        style={{
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
