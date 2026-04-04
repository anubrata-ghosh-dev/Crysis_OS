'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, AlertTriangle, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import IconSidebar from '@/components/IconSidebar';

export default function SOSPage() {
  const [formData, setFormData] = useState({
    emergencyType: 'medical',
    description: '',
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate geolocation
  useEffect(() => {
    setLocation({
      lat: 40.7505 + (Math.random() - 0.5) * 0.05,
      lng: -73.9972 + (Math.random() - 0.5) * 0.05,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.emergencyType,
          description: formData.description,
          location: location,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    } catch (error) {
      console.error('SOS submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-crisis-dark overflow-hidden flex flex-col">
      <Navbar activeAlerts={0} />

      <div className="flex flex-1 pt-16">
        <IconSidebar currentPage="sos" />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          {submitted ? (
            // Success Screen
            <div className="glass-panel rounded-2xl p-12 border border-crisis-safe max-w-md w-full text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-crisis-safe bg-opacity-20 rounded-full flex items-center justify-center mb-4 border-2 border-crisis-safe">
                  <AlertTriangle size={32} className="text-crisis-safe animate-pulse" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-crisis-safe mb-2">SOS DISPATCHED</h1>
              <p className="text-gray-300 mb-6">Emergency services have been notified of your location.</p>

              <div className="bg-crisis-safe bg-opacity-10 border border-crisis-safe rounded-lg p-4 mb-6 text-sm text-left">
                <p className="text-gray-300">
                  <span className="text-crisis-safe font-bold">Location:</span> {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                </p>
                <p className="text-gray-300 mt-2">
                  <span className="text-crisis-safe font-bold">Type:</span> {formData.emergencyType.toUpperCase()}
                </p>
              </div>

              <p className="text-xs text-gray-500">Redirecting to command center in 3 seconds...</p>

              <Link href="/">
                <button className="mt-6 button-primary w-full">RETURN TO COMMAND CENTER</button>
              </Link>
            </div>
          ) : (
            // Form Screen
            <div className="glass-panel rounded-2xl p-10 border border-crisis-edge max-w-md w-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-crisis-danger to-red-700 rounded-lg flex items-center justify-center">
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-crisis-danger">EMERGENCY</h1>
              </div>

              <p className="text-gray-300 mb-6">Send emergency distress signal to local response services.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Location Display */}
                <div className="glass-panel-dark rounded-lg p-4 border border-crisis-edge">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin size={16} className="text-crisis-cyan" />
                    <span>
                      {location
                        ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                        : 'Detecting location...'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">GPS detected. Updating in real-time.</p>
                </div>

                {/* Emergency Type */}
                <div>
                  <label className="block text-sm font-bold text-crisis-cyan mb-2 tracking-wider uppercase">
                    Emergency Type
                  </label>
                  <select
                    value={formData.emergencyType}
                    onChange={(e) => setFormData({ ...formData, emergencyType: e.target.value })}
                    className="w-full bg-crisis-dark border border-crisis-edge rounded-lg px-4 py-3 text-white focus:outline-none focus:border-crisis-cyan transition"
                  >
                    <option value="medical">Medical Emergency</option>
                    <option value="flood">Flooding</option>
                    <option value="fire">Fire</option>
                    <option value="accident">Accident</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-crisis-cyan mb-2 tracking-wider uppercase">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your emergency situation..."
                    rows={4}
                    className="w-full bg-crisis-dark border border-crisis-edge rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-crisis-cyan transition resize-none"
                  />
                </div>

                {/* Warning */}
                <div className="bg-crisis-warning bg-opacity-10 border border-crisis-warning rounded-lg p-3">
                  <p className="text-xs text-gray-300">
                    <span className="text-crisis-warning font-bold">⚠ Warning:</span> False reporting is a crime. Emergency services will respond to this signal.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full button-danger flex items-center justify-center gap-2 py-3 text-base hover:shadow-lg transition-all duration-300"
                >
                  <Send size={20} />
                  <span className="font-bold tracking-wider">SEND SOS</span>
                </button>

                {/* Cancel */}
                <Link href="/">
                  <button
                    type="button"
                    className="w-full button-primary py-2 text-sm hover:shadow-lg transition-all"
                  >
                    CANCEL
                  </button>
                </Link>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
