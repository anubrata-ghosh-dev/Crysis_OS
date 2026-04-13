'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import type { HeatmapPoint } from '@/lib/mockData';

interface HeatmapLayerProps {
  map: L.Map | null;
  heatmapData: HeatmapPoint[];
  visible?: boolean;
}

declare global {
  namespace L {
    function heatLayer(latlngs: [number, number, number][], options?: any): L.Layer;
  }
}

export default function HeatmapLayer({ map, heatmapData, visible = false }: HeatmapLayerProps) {
  useEffect(() => {
    if (!map || !visible || heatmapData.length === 0) return;

    // Create heatmap layer
    const heatData = heatmapData.map((point: HeatmapPoint) => [
      point.lat,
      point.lng,
      point.intensity,
    ]);

    const heat = L.heatLayer(heatData as [number, number, number][], {
      radius: 40,
      blur: 20,
      maxZoom: 17,
      gradient: {
        0.0: '#00dd66',
        0.25: '#ffb800',
        0.5: '#ff6600',
        0.75: '#ff0033',
        1.0: '#990011',
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, heatmapData, visible]);

  return null;
}
