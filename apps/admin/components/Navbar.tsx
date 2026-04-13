import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ADMIN DASHBOARD NAVBAR
 * 
 * This application is READ-ONLY admin dashboard only.
 * Citizen incident reporting is handled in a separate application.
 * No reporting or data submission from this component.
 */

interface NavbarProps {
  activeAlerts: number;
}

export default function Navbar({ activeAlerts }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-crisis-dark via-crisis-dark to-transparent border-b border-crisis-edge z-50 glass-panel-dark">
      <div className="h-full px-3 md:px-6 md:pl-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-crisis-cyan to-crisis-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs md:text-sm">◆</span>
          </div>
          <h1 className="text-base md:text-xl font-bold text-crisis-cyan tracking-widest hidden sm:inline">CRYSIS_OS</h1>
          <span className="hidden md:inline text-xs text-crisis-cyan border-l border-crisis-cyan ml-3 pl-3">ADMIN DASHBOARD</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xs md:text-xs text-gray-400 tracking-wider whitespace-nowrap">
            <span className="hidden sm:inline">ACTIVE ALERTS: </span>
            <span className="text-crisis-warning font-bold md:ml-2">{activeAlerts}</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2 md:ml-4">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-crisis-cyan rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-crisis-cyan tracking-widest hidden md:inline">● LIVE SYSTEM</span>
            <span className="text-xs font-bold text-crisis-cyan md:hidden">LIVE</span>
          </div>
        </div>
      </div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px animated-line"></div>
    </nav>
  );
}
