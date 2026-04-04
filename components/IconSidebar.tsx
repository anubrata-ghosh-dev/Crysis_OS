'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Map, Phone, BarChart3 } from 'lucide-react';

interface IconSidebarProps {
  currentPage?: string;
}

export default function IconSidebar({ currentPage = 'map' }: IconSidebarProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const icons = [
    { id: 'map', icon: Map, href: '/', label: 'Command Center' },
    { id: 'sos', icon: Phone, href: '/sos', label: 'SOS Dispatch' },
    { id: 'dashboard', icon: BarChart3, href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-20 border-r border-crisis-edge glass-panel-dark z-40 flex flex-col items-center py-6 gap-6">
      {icons.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => setHoveredIcon(item.id)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <Link href={item.href}>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-crisis-cyan bg-opacity-20 border border-crisis-cyan glow-cyan'
                    : 'border border-crisis-edge hover:border-crisis-cyan hover:bg-crisis-cyan hover:bg-opacity-10'
                }`}
              >
                <Icon
                  size={24}
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-crisis-cyan' : 'text-gray-400 group-hover:text-crisis-cyan'
                  }`}
                />
              </div>
            </Link>

            {/* Tooltip */}
            {hoveredIcon === item.id && (
              <div className="absolute left-20 ml-2 top-1/2 transform -translate-y-1/2 bg-crisis-dark border border-crisis-edge px-3 py-1 rounded text-xs text-crisis-cyan whitespace-nowrap font-mono">
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
