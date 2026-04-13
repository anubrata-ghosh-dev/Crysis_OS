'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import type { Disaster, SafeZone } from '@/lib/mockData';

interface ZoneLabelsProps {
  map: L.Map | null;
  disasters: Disaster[];
  safeZones?: SafeZone[];
  selectedAlert?: Disaster | null;
}

export default function ZoneLabels({ map, disasters, safeZones = [], selectedAlert }: ZoneLabelsProps) {
  useEffect(() => {
    if (!map) return;

    try {
      // Clear all existing zone labels
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker && layer.getIcon()) {
          const className = layer.getIcon()?.options?.className || '';
          if (className.includes('zone-label')) {
            map.removeLayer(layer);
          }
        }
      });

      // Label HIGH RISK ZONES (red severity disasters)
      disasters.forEach((disaster) => {
        if (disaster.severity === 'HIGH') {
          const labelHtml = `
            <div style="
              background: linear-gradient(135deg, rgba(220, 38, 38, 0.85) 0%, rgba(239, 68, 68, 0.75) 100%);
              border: 2px solid #dc2626;
              border-radius: 6px;
              padding: 6px 10px;
              color: #fff;
              font-size: 10px;
              font-weight: bold;
              white-space: nowrap;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
              box-shadow: 0 0 8px rgba(220, 38, 38, 0.5);
              backdrop-filter: blur(4px);
              letter-spacing: 0.5px;
            ">
              🔴 HIGH RISK ZONE
            </div>
          `;
          
          L.marker([disaster.lat + 0.008, disaster.lng], {
            icon: L.divIcon({
              html: labelHtml,
              iconSize: [130, 24],
              className: 'zone-label danger-zone',
            }),
            interactive: false,
          }).addTo(map);
        }
        
        // Label WARNING ZONES (orange/yellow severity disasters)
        if (disaster.severity === 'MEDIUM') {
          const labelHtml = `
            <div style="
              background: linear-gradient(135deg, rgba(217, 119, 6, 0.85) 0%, rgba(251, 146, 60, 0.75) 100%);
              border: 2px solid #d97706;
              border-radius: 6px;
              padding: 6px 10px;
              color: #fff;
              font-size: 10px;
              font-weight: bold;
              white-space: nowrap;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
              box-shadow: 0 0 8px rgba(217, 119, 6, 0.5);
              backdrop-filter: blur(4px);
              letter-spacing: 0.5px;
            ">
              🟠 WARNING ZONE
            </div>
          `;
          
          L.marker([disaster.lat + 0.008, disaster.lng], {
            icon: L.divIcon({
              html: labelHtml,
              iconSize: [115, 24],
              className: 'zone-label warning-zone',
            }),
            interactive: false,
          }).addTo(map);
        }

        // Label LOW severity as safe
        if (disaster.severity === 'LOW') {
          const labelHtml = `
            <div style="
              background: linear-gradient(135deg, rgba(34, 197, 94, 0.85) 0%, rgba(74, 222, 128, 0.75) 100%);
              border: 2px solid #22c55e;
              border-radius: 6px;
              padding: 6px 10px;
              color: #fff;
              font-size: 10px;
              font-weight: bold;
              white-space: nowrap;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
              box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
              backdrop-filter: blur(4px);
              letter-spacing: 0.5px;
            ">
              🟢 SAFE AREA
            </div>
          `;
          
          L.marker([disaster.lat + 0.008, disaster.lng], {
            icon: L.divIcon({
              html: labelHtml,
              iconSize: [100, 24],
              className: 'zone-label safe-zone',
            }),
            interactive: false,
          }).addTo(map);
        }
      });

      // Label SAFE ZONES (recommended evacuation/shelter areas)
      safeZones.forEach((zone) => {
        // Highlight safe zones related to selected alert
        const isRelated = selectedAlert?.id === zone.relatedAlertId;
        const opacity = isRelated ? 0.95 : 0.75;
        const scale = isRelated ? 1.1 : 1;

        const labelHtml = `
          <div style="
            background: linear-gradient(135deg, rgba(34, 197, 94, ${opacity}) 0%, rgba(74, 222, 128, ${opacity - 0.1}) 100%);
            border: 2px solid #22c55e;
            border-radius: 6px;
            padding: 6px 10px;
            color: #fff;
            font-size: 10px;
            font-weight: bold;
            white-space: nowrap;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            box-shadow: 0 0 12px rgba(34, 197, 94, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            letter-spacing: 0.5px;
            transform: scale(${scale});
            transform-origin: center;
            transition: all 0.3s ease;
          ">
            ✓ SAFE ZONE
          </div>
        `;

        L.marker([zone.lat, zone.lng], {
          icon: L.divIcon({
            html: labelHtml,
            iconSize: [110, 28],
            className: 'zone-label safe-zone-recommended',
          }),
          interactive: false,
        }).addTo(map);
      });

      return () => {
        // Cleanup on unmount
      };
    } catch (error) {
      console.error('Error updating zone labels:', error);
    }
  }, [map, disasters, safeZones, selectedAlert]);

  return null;
}
