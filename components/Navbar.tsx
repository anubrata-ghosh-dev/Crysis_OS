import React from 'react';

interface NavbarProps {
  activeAlerts: number;
}

export default function Navbar({ activeAlerts }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-crisis-dark via-crisis-dark to-transparent border-b border-crisis-edge z-50 glass-panel-dark">
      <div className="h-full pl-20 pr-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-crisis-cyan to-crisis-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">◆</span>
          </div>
          <h1 className="text-xl font-bold text-crisis-cyan tracking-widest">CRYSIS_OS</h1>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400 tracking-wider">
            ACTIVE ALERTS: <span className="text-crisis-warning font-bold ml-2">{activeAlerts}</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-2 h-2 bg-crisis-cyan rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-crisis-cyan tracking-widest">● LIVE SYSTEM</span>
          </div>
        </div>
      </div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px animated-line"></div>
    </nav>
  );
}
