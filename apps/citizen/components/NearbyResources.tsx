'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Loader, Heart, Shield, Flame } from 'lucide-react';
import { fetchNearbyResources, formatDistance } from '@/lib/resources';
import type { Resource, ResourcesResponse } from '@/lib/resources';

interface NearbyResourcesProps {
  lat: number;
  lng: number;
  className?: string;
}

export default function NearbyResources({ lat, lng, className = '' }: NearbyResourcesProps) {
  const [resources, setResources] = useState<ResourcesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch resources when location changes
    const fetchResources = async () => {
      setLoading(true);
      setError(null);

      const data = await fetchNearbyResources({
        lat,
        lng,
        radius: 5000, // 5km radius
        limit: 3,
      });

      if (data) {
        setResources(data);
      } else {
        setError('Could not fetch nearby resources');
      }
      setLoading(false);
    };

    fetchResources();
  }, [lat, lng]);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
        <Loader size={16} className="animate-spin" />
        <span className="text-sm">Finding nearby resources...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-yellow-400 ${className}`}>
        <AlertCircle size={16} />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (!resources || resources.total === 0) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <AlertCircle size={16} />
        <span className="text-sm">No nearby resources found</span>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <Heart size={16} className="text-red-400" />;
      case 'police':
        return <Shield size={16} className="text-blue-400" />;
      case 'fire_station':
        return <Flame size={16} className="text-orange-400" />;
      default:
        return <MapPin size={16} className="text-gray-400" />;
    }
  };

  const getNearestResource = (type: 'hospital' | 'police' | 'fire_station') => {
    if (type === 'hospital') return resources.hospitals[0];
    if (type === 'police') return resources.police[0];
    return resources.fireStations[0];
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs text-gray-400 uppercase tracking-wider">Nearby Emergency Resources</p>

      <div className="grid grid-cols-1 gap-2">
        {/* Nearest Hospital */}
        {getNearestResource('hospital') && (
          <ResourceItem
            resource={getNearestResource('hospital')}
            icon={<Heart size={14} className="text-red-400" />}
          />
        )}

        {/* Nearest Police */}
        {getNearestResource('police') && (
          <ResourceItem
            resource={getNearestResource('police')}
            icon={<Shield size={14} className="text-blue-400" />}
          />
        )}

        {/* Nearest Fire Station */}
        {getNearestResource('fire_station') && (
          <ResourceItem
            resource={getNearestResource('fire_station')}
            icon={<Flame size={14} className="text-orange-400" />}
          />
        )}
      </div>

      <p className="text-xs text-gray-600 mt-3 border-t border-gray-700 pt-2">
        Data from OpenStreetMap • 5km search radius
      </p>
    </div>
  );
}

interface ResourceItemProps {
  resource: Resource | undefined;
  icon: React.ReactNode;
}

function ResourceItem({ resource, icon }: ResourceItemProps) {
  if (!resource) return null;

  return (
    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{resource.name}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
          <MapPin size={12} />
          {formatDistance(resource.distance)} away
        </p>
      </div>
    </div>
  );
}
