export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getColorBySeverity(severity: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (severity) {
    case 'HIGH':
      return '#FF0033';
    case 'MEDIUM':
      return '#FFB800';
    case 'LOW':
      return '#00DD66';
    default:
      return '#00D9FF';
  }
}

export function getTailwindClassBySeverity(severity: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (severity) {
    case 'HIGH':
      return 'border-crisis-danger text-crisis-danger glow-danger';
    case 'MEDIUM':
      return 'border-crisis-warning text-crisis-warning glow-warning';
    case 'LOW':
      return 'border-crisis-safe text-crisis-safe';
    default:
      return 'border-crisis-cyan text-crisis-cyan glow-cyan';
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getSOSIcon(type: string): string {
  switch (type) {
    case 'flood':
      return '💧';
    case 'fire':
      return '🔥';
    case 'medical':
      return '🏥';
    case 'accident':
      return '🚨';
    default:
      return '⚠️';
  }
}

export function formatTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return 'Unknown';
  }
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString();
}

export function getEmergencyTypeLabel(type: string): string {
  switch (type) {
    case 'flood':
      return 'Flood';
    case 'fire':
      return 'Fire';
    case 'medical':
      return 'Medical';
    case 'accident':
      return 'Accident';
    case 'structural':
      return 'Structural';
    default:
      return 'Other';
  }
}
