'use client';

/**
 * CITIZEN REPORTING APP
 * 
 * This app allows citizens to report emergencies in real-time.
 * All incident reports are written to shared Firebase backend.
 * Admin dashboard reads from the same backend (read-only).
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Loader, MapPin, RotateCw } from 'lucide-react';
import { incidentService } from '@/lib/api';
import { useToast, ToastContainer } from '@/components/Toast';
import NearbyResources from '@/components/NearbyResources';

// Severity mapping based on emergency type
const SEVERITY_MAP: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
  fire: 'HIGH',
  flood: 'HIGH',
  crime: 'HIGH',
  accident: 'MEDIUM',
  medical: 'MEDIUM',
};

// Default location (India center) for fallback
const DEFAULT_LOCATION = {
  lat: 22.5,
  lng: 78.9,
};

interface Location {
  lat: number;
  lng: number;
}

export default function ReportPage() {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    lat: '',
    lng: '',
  });

  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toasts, showToast } = useToast();

  // Request geolocation on mount
  useEffect(() => {
    requestGeolocation();
  }, []);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported in this browser');
      setLocationLoading(false);
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: parseFloat(position.coords.latitude.toFixed(4)),
          lng: parseFloat(position.coords.longitude.toFixed(4)),
        };
        setLocation(newLocation);
        setFormData((prev) => ({
          ...prev,
          lat: newLocation.lat.toString(),
          lng: newLocation.lng.toString(),
        }));
        setLocationError(null);
        setLocationLoading(false);
      },
      (error) => {
        let errorMsg = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Permission denied. Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location unavailable. Check GPS.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Try again.';
            break;
          default:
            errorMsg = error.message;
        }
        setLocationError(errorMsg);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const useDefaultLocation = () => {
    setLocation(DEFAULT_LOCATION);
    setFormData((prev) => ({
      ...prev,
      lat: DEFAULT_LOCATION.lat.toString(),
      lng: DEFAULT_LOCATION.lng.toString(),
    }));
    setLocationError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.type) {
      showToast('Please select an emergency type', 'error');
      return false;
    }

    if (!location && (!formData.lat || !formData.lng)) {
      showToast('Location required. Please provide coordinates.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 Form submit started');

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setSubmitting(true);
    console.log('📝 Submitting form...');

    try {
      let finalLocation = location;
      if (!finalLocation && formData.lat && formData.lng) {
        finalLocation = {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
        };
      }

      if (!finalLocation) {
        console.log('❌ No final location available');
        showToast('Location required', 'error');
        setSubmitting(false);
        return;
      }

      console.log('📍 Location:', finalLocation);
      const severity = SEVERITY_MAP[formData.type] || 'MEDIUM';

      const incidentData = {
        lat: finalLocation.lat,
        lng: finalLocation.lng,
        type: formData.type as any,
        description: formData.description || 'No description provided',
        severity,
        title: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Emergency`,
        summary: formData.description || 'Emergency reported by citizen',
        confidence: 'MEDIUM' as const,
        sources: 1,
        affectedPeople: 0,
        reports_count: 1,
        timestamp: new Date().toISOString(),
        status: 'active' as const,
      };

      console.log('📦 Incident data prepared:', incidentData);
      console.log('📤 Calling incidentService.addIncident()...');
      const result = await incidentService.addIncident(incidentData);
      console.log('✅ Incident service returned:', result);

      if (result) {
        console.log('✨ Incident submitted successfully');
        showToast('✅ Emergency reported successfully! Responders have been notified.', 'success');
        setSubmitted(true);
        setFormData({
          type: '',
          description: '',
          lat: '',
          lng: '',
        });
        setLocation(null);

        setTimeout(() => {
          window.location.href = '';
        }, 3000);
      } else {
        console.log('⚠️ Incident service returned falsy value');
        showToast('Failed to report incident. Please try again.', 'error');
      }
    } catch (error) {
      console.error('💥 Error reporting incident:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to report incident';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
      console.log('🏁 Form submission completed');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-crisis-dark to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Emergency Reported!</h2>
          <p className="text-gray-300 mb-4">Emergency responders have been notified and are on their way.</p>
          <p className="text-gray-500 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crisis-dark via-slate-900 to-crisis-dark flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-crisis-danger to-red-700 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Report Emergency</h1>
          </div>
          <p className="text-gray-400">Help responders reach those in need. Provide emergency details below.</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Status */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-crisis-cyan mt-1 flex-shrink-0" />
                <div className="flex-1 w-full">
                  {locationLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader size={16} className="animate-spin text-crisis-cyan" />
                      <span className="text-sm text-gray-300">Getting your location...</span>
                    </div>
                  ) : locationError ? (
                    <div className="space-y-2">
                      <p className="text-sm text-yellow-400">⚠️ {locationError}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={requestGeolocation}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                        >
                          <RotateCw size={14} />
                          Retry
                        </button>
                        <button
                          type="button"
                          onClick={useDefaultLocation}
                          className="px-3 py-1.5 bg-crisis-cyan hover:bg-cyan-500 text-black text-xs rounded transition font-medium"
                        >
                          Use Default Location
                        </button>
                      </div>
                    </div>
                  ) : location ? (
                    <p className="text-sm text-gray-300">
                      ✅ Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  ) : (
                    <p className="text-sm text-yellow-400">Location required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Manual Location Input */}
            {locationError && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-3">
                <p className="text-xs font-bold text-crisis-cyan uppercase">Manual Location Entry</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Latitude</label>
                    <input
                      type="number"
                      name="lat"
                      value={formData.lat}
                      onChange={handleInputChange}
                      placeholder="e.g., 22.5"
                      step="0.0001"
                      min="-90"
                      max="90"
                      className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-crisis-cyan transition"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Longitude</label>
                    <input
                      type="number"
                      name="lng"
                      value={formData.lng}
                      onChange={handleInputChange}
                      placeholder="e.g., 78.9"
                      step="0.0001"
                      min="-180"
                      max="180"
                      className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-crisis-cyan transition"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Nearby Emergency Resources */}
            {location && !locationLoading && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <NearbyResources lat={location.lat} lng={location.lng} />
              </div>
            )}

            {/* Emergency Type */}
            <div>
              <label className="block text-sm font-bold text-crisis-cyan mb-2 uppercase tracking-wider">
                Emergency Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-crisis-cyan transition"
                disabled={submitting}
              >
                <option value="">Select type...</option>
                <option value="fire">🔥 Fire</option>
                <option value="flood">💧 Flood</option>
                <option value="accident">🚗 Accident</option>
                <option value="medical">🏥 Medical Emergency</option>
                <option value="crime">🚨 Crime</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-crisis-cyan mb-2 uppercase tracking-wider">
                Description (optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what's happening... (injuries, exact location details, etc.)"
                rows={4}
                maxLength={500}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-crisis-cyan transition resize-none"
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
            </div>

            {/* Severity Info */}
            {formData.type && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                <p className="text-xs text-gray-400">
                  <span className="font-bold">Priority Level:</span>{' '}
                  <span
                    className={`${
                      SEVERITY_MAP[formData.type] === 'HIGH'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                    } font-semibold`}
                  >
                    {SEVERITY_MAP[formData.type] || 'MEDIUM'}
                  </span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !location || !formData.type}
              className="w-full bg-gradient-to-r from-crisis-danger to-red-700 hover:shadow-glow-red disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 uppercase tracking-wider mt-8"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={18} className="animate-spin" />
                  Reporting...
                </span>
              ) : (
                '🚨 Report Emergency'
              )}
            </button>

            {/* Disclaimer */}
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 mt-4">
              <p className="text-xs text-yellow-200">
                <span className="font-bold">⚠️ Warning:</span> False reporting of emergencies is a crime. Only report genuine emergencies.
              </p>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Emergency responders in your area have been notified of this report.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Crysis_OS © 2026 - Real-time Emergency Response
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
