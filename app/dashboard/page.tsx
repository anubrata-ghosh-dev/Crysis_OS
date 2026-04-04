'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, AlertCircle, Users, MapPin, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import IconSidebar from '@/components/IconSidebar';
import { INITIAL_DISASTERS, INITIAL_SOS } from '@/lib/mockData';
import type { Disaster } from '@/lib/mockData';

export default function DashboardPage() {
  const [disasters, setDisasters] = useState<Disaster[]>(INITIAL_DISASTERS);
  const [stats, setStats] = useState({
    totalAffected: 0,
    highSeverity: 0,
    responseTime: '8m 42s',
    successRate: '94.2%',
  });

  useEffect(() => {
    // Calculate stats
    const totalAffected = disasters.reduce((sum, d) => sum + d.affectedPeople, 0);
    const highSeverity = disasters.filter((d) => d.severity === 'HIGH').length;

    setStats({
      totalAffected,
      highSeverity,
      responseTime: '8m 42s',
      successRate: '94.2%',
    });
  }, [disasters]);

  return (
    <div className="w-screen h-screen bg-crisis-dark overflow-hidden flex flex-col">
      <Navbar activeAlerts={disasters.length} />

      <div className="flex flex-1 pt-16">
        <IconSidebar currentPage="dashboard" />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 pl-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-crisis-cyan mb-2 tracking-widest">CRISIS DASHBOARD</h1>
            <p className="text-gray-400">Real-time monitoring and response metrics</p>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Active Incidents */}
            <div className="glass-panel rounded-lg p-6 border border-crisis-edge hover:border-crisis-cyan transition group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm tracking-wider uppercase mb-1">Active Incidents</p>
                  <p className="text-4xl font-bold text-crisis-cyan">{disasters.length}</p>
                </div>
                <AlertCircle size={24} className="text-crisis-warning group-hover:text-crisis-cyan transition" />
              </div>
              <p className="text-xs text-gray-500 border-t border-crisis-edge pt-3">
                <span className={disasters[0].severity === 'HIGH' ? 'text-crisis-danger' : 'text-crisis-warning'}>
                  {disasters[0].severity}
                </span>
                {' '}priority incident active
              </p>
            </div>

            {/* Total Affected */}
            <div className="glass-panel rounded-lg p-6 border border-crisis-edge hover:border-crisis-cyan transition group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm tracking-wider uppercase mb-1">People Affected</p>
                  <p className="text-4xl font-bold text-crisis-warning">{stats.totalAffected}</p>
                </div>
                <Users size={24} className="text-crisis-warning group-hover:text-crisis-cyan transition" />
              </div>
              <p className="text-xs text-gray-500 border-t border-crisis-edge pt-3">
                <span className="text-crisis-warning">+127</span> in last hour
              </p>
            </div>

            {/* Response Time */}
            <div className="glass-panel rounded-lg p-6 border border-crisis-edge hover:border-crisis-cyan transition group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm tracking-wider uppercase mb-1">Avg Response</p>
                  <p className="text-4xl font-bold text-crisis-safe">{stats.responseTime}</p>
                </div>
                <TrendingUp size={24} className="text-crisis-safe group-hover:text-crisis-cyan transition" />
              </div>
              <p className="text-xs text-gray-500 border-t border-crisis-edge pt-3">
                <span className="text-crisis-safe">-12%</span> vs. yesterday
              </p>
            </div>

            {/* Success Rate */}
            <div className="glass-panel rounded-lg p-6 border border-crisis-edge hover:border-crisis-cyan transition group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm tracking-wider uppercase mb-1">Success Rate</p>
                  <p className="text-4xl font-bold text-crisis-cyan">{stats.successRate}</p>
                </div>
                <BarChart3 size={24} className="text-crisis-cyan group-hover:text-crisis-cyan transition" />
              </div>
              <p className="text-xs text-gray-500 border-t border-crisis-edge pt-3">
                <span className="text-crisis-safe">+2.3%</span> from last week
              </p>
            </div>
          </div>

          {/* Alert Table */}
          <div className="glass-panel rounded-lg border border-crisis-edge overflow-hidden">
            <div className="border-b border-crisis-edge px-6 py-4 bg-gradient-to-r from-crisis-dark to-transparent">
              <h2 className="text-lg font-bold text-crisis-cyan tracking-widest">ACTIVE INCIDENTS</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-crisis-edge">
                  <tr className="text-left text-xs uppercase text-gray-400 tracking-wider">
                    <th className="px-6 py-3">Incident</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Severity</th>
                    <th className="px-6 py-3">Affected</th>
                    <th className="px-6 py-3">Sources</th>
                    <th className="px-6 py-3">Confidence</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {disasters.map((incident, idx) => (
                    <tr key={incident.id} className="border-b border-crisis-edge hover:bg-crisis-cyan hover:bg-opacity-5 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-white">{incident.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <span className="inline-block px-2 py-1 rounded bg-crisis-blue bg-opacity-20 border border-crisis-blue text-crisis-blue text-xs">
                          {incident.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                            incident.severity === 'HIGH'
                              ? 'bg-crisis-danger bg-opacity-20 text-crisis-danger border border-crisis-danger'
                              : incident.severity === 'MEDIUM'
                              ? 'bg-crisis-warning bg-opacity-20 text-crisis-warning border border-crisis-warning'
                              : 'bg-crisis-safe bg-opacity-20 text-crisis-safe border border-crisis-safe'
                          }`}
                        >
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{incident.affectedPeople}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{incident.sources}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                            incident.confidence === 'HIGH'
                              ? 'bg-crisis-safe bg-opacity-20 text-crisis-safe'
                              : incident.confidence === 'MEDIUM'
                              ? 'bg-crisis-warning bg-opacity-20 text-crisis-warning'
                              : 'bg-gray-500 bg-opacity-20 text-gray-300'
                          }`}
                        >
                          {incident.confidence}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-crisis-cyan rounded-full animate-pulse"></div>
                          <span className="text-crisis-cyan">Active</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-crisis-edge px-6 py-3 bg-gradient-to-r from-crisis-dark to-transparent text-xs text-gray-500">
              Showing {disasters.length} of {disasters.length} active incidents
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
