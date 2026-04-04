'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import type { Disaster } from '@/lib/mockData';

interface ZoneLabelsProps {
  map: L.Map | null;
  disasters: Disaster[];
}

export default function ZoneLabels({ map, disasters }: ZoneLabelsProps) {
  useEffect(() => {
    if (!map || disasters.length === 0) return;

    try {
      // Clear existing zone labels more reliably
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker && layer.getIcon()) {
          const className = layer.getIcon()?.options?.className || '';
          if (className.includes('zone-label')) {
            map.removeLayer(layer);
          }
        }
      });

      // Add zone labels
      disasters.forEach((disaster) => {
        // High-severity disasters get danger zone labels
        if (disaster.severity === 'HIGH') {
          const dangerMarker = L.marker([disaster.lat, disaster.lng], {
            icon: L.divIcon({
              html: `
                <div style="
                  background-color: rgba(255, 0, 51, 0.15);
                  border: 1px solid rgba(255, 0, 51, 0.4);
                  border-radius: 8px;
                  padding: 8px 12px;
                  color: #FF0033;
                  font-size: 11px;
                  font-weight: bold;
                  white-space: nowrap;
                  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
                ">
                  ⚠ HIGH RISK ZONE
                </div>
              `,
              iconSize: [140, 30],
              className: 'zone-label danger-zone',
            }),
            interactive: false,
          }).addTo(map);
        }
      });

      // Add safe area label if disasters exist, position it relative to the map center or disasters
      if (disasters.length > 0) {
        // Use the first disaster's coordinates but offset north as a "safe area"
        const safeAreaLat = disasters[0].lat + 1.5; // offset north
        const safeAreaLng = disasters[0].lng + 2; // offset east
        L.marker([safeAreaLat, safeAreaLng], {
          icon: L.divIcon({
            html: `
              <div style="
                background-color: rgba(0, 221, 102, 0.15);
                border: 1px solid rgba(0, 221, 102, 0.4);
                border-radius: 8px;
                padding: 8px 12px;
                color: #00DD66;
                font-size: 11px;
                font-weight: bold;
                white-space: nowrap;
                text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
              ">
                ✓ SAFE AREA
              </div>
            `,
            iconSize: [100, 30],
            className: 'zone-label safe-zone',
          }),
          interactive: false,
        }).addTo(map);
      }

      return () => {
        // Cleanup on unmount
      };
    } catch (error) {
      console.error('Error updating zone labels:', error);
    }
  }, [map, disasters]);

  return null;
}
