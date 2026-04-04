'use client';

import React, { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils';

interface RelativeTimeProps {
  value: string | number | Date;
  className?: string;
}

export default function RelativeTime({ value, className }: RelativeTimeProps) {
  const [label, setLabel] = useState('--');

  useEffect(() => {
    const update = () => {
      setLabel(formatTime(value));
    };

    update();
    const interval = setInterval(update, 60 * 1000);
    return () => clearInterval(interval);
  }, [value]);

  return <span className={className}>{label}</span>;
}