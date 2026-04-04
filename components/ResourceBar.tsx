'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Home, AlertTriangle } from 'lucide-react';
import { RESOURCE_LOCATIONS } from '@/lib/mockData';

export default function ResourceBar() {
  const handleFindHospital = () => {
    alert(`Nearest Hospital: ${RESOURCE_LOCATIONS.hospitals[0].name}\n\nDistance: ~1.2 miles\nAvailable Beds: ${RESOURCE_LOCATIONS.hospitals[0].beds}`);
  };

  const handleFindShelter = () => {
    alert(`Evacuation Shelter: ${RESOURCE_LOCATIONS.shelters[0].name}\n\nDistance: ~0.8 miles\nCapacity: ${RESOURCE_LOCATIONS.shelters[0].capacity} people`);
  };

  const handleEvacRoute = () => {
    alert(`Recommended Evacuation Route: ${RESOURCE_LOCATIONS.evacRoutes[0].name}\n\nETA: ~12 minutes\nStatus: Clear`);
  };

  const buttonVariants = {
    animate: { opacity: 1, y: 0 },
    whileHover: { scale: 1.03, y: -1 },
    whileTap: { scale: 0.98 },
  };

  return (
    <div className="absolute left-24 bottom-4 w-max border border-crisis-edge glass-panel-dark rounded-xl z-[1200] flex items-center gap-3 px-4 py-3 hover:border-crisis-cyan/30 shadow-2xl transition-all duration-300 pointer-events-auto" style={{ pointerEvents: 'auto' }}>
      <motion.button
        onClick={handleFindHospital}
        variants={buttonVariants}
        initial={false}
        animate="animate"
        whileHover="whileHover"
        whileTap="whileTap"
        className="button-primary h-11 min-w-[130px] px-4 py-0 flex items-center justify-center gap-2 group"
      >
        <Heart size={18} className="group-hover:text-crisis-cyan transition" />
        <span className="tracking-wider">HOSPITAL</span>
      </motion.button>

      <motion.button
        onClick={handleFindShelter}
        variants={buttonVariants}
        initial={false}
        animate="animate"
        whileHover="whileHover"
        whileTap="whileTap"
        className="button-primary h-11 min-w-[130px] px-4 py-0 flex items-center justify-center gap-2 group font-bold text-sm"
      >
        <Home size={18} className="group-hover:text-crisis-cyan transition" />
        <span className="tracking-wider">SHELTER</span>
      </motion.button>

      <motion.button
        onClick={handleEvacRoute}
        variants={buttonVariants}
        initial={false}
        animate="animate"
        whileHover="whileHover"
        whileTap="whileTap"
        className="button-primary h-11 min-w-[130px] px-4 py-0 flex items-center justify-center gap-2 group font-bold text-sm"
      >
        <AlertTriangle size={18} className="group-hover:text-crisis-cyan transition" />
        <span className="tracking-wider">EVAC ROUTE</span>
      </motion.button>
    </div>
  );
}
