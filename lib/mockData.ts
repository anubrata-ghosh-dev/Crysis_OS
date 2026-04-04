export interface Disaster {
  id: string;
  title: string;
  summary: string;
  lat: number;
  lng: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
  sources: number;
  type: 'flood' | 'fire' | 'medical' | 'accident' | 'structural';
  affectedPeople: number;
  escalation?: number; // 0-100, increases over time
  suggestedActions?: string[];
  riskFactors?: string[];
}

export interface SOSSignal {
  id: string;
  lat: number;
  lng: number;
  type: 'flood' | 'fire' | 'medical' | 'other';
  status: 'pending' | 'acknowledged' | 'resolved';
  timestamp: string;
  description: string;
  userLocation: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
}

export const INITIAL_DISASTERS: Disaster[] = [
  {
    id: 'd1',
    title: 'Severe Monsoon Flooding - Andheri East, Mumbai',
    summary: 'Catastrophic waterlogging reported in Andheri East, Mumbai due to heavy monsoon rainfall. Water levels rising rapidly in residential areas. Multiple evacuations underway from low-lying colonies.',
    lat: 19.1136,
    lng: 72.8697,
    severity: 'HIGH',
    confidence: 'HIGH',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    sources: 47,
    type: 'flood',
    affectedPeople: 1200,
    escalation: 75,
    suggestedActions: [
      'Issue evacuation order for waterlogged zones',
      'Open government relief camps immediately',
      'Deploy NDRF rescue units to high-traffic areas',
      'Establish safe evacuation routes via higher ground',
    ],
    riskFactors: ['Rapid water rise', 'Urban congestion', 'Monsoon intensity'],
  },
  {
    id: 'd2',
    title: 'Cyclonic Storm Impact - Odisha Coast, Bhubaneswar',
    summary: 'Severe cyclonic storm affecting coastal areas of Odisha. High-speed winds causing structural damage and power outages. Fishing communities urgently need evacuation. Storm surge warnings in effect.',
    lat: 20.2961,
    lng: 85.8245,
    severity: 'HIGH',
    confidence: 'HIGH',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    sources: 34,
    type: 'fire',
    affectedPeople: 850,
    escalation: 65,
    suggestedActions: [
      'Evacuate all coastal settlements to inland relief centers',
      'Deploy IMD advanced weather monitoring',
      'Position additional rescue units in strategic locations',
      'Alert all hospitals for potential mass casualties from storm surge',
    ],
    riskFactors: ['High-speed winds', 'Storm surge', 'Coastal population density'],
  },
  {
    id: 'd3',
    title: 'Interstate Highway Pile-up - NH48 near Pune',
    summary: 'Major multi-vehicle collision on NH (National Highway) 48 near Pune involving 12 commercial trucks and passenger vehicles. Multiple casualties reported. Emergency services fully deployed.',
    lat: 18.5204,
    lng: 73.8567,
    severity: 'HIGH',
    confidence: 'MEDIUM',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    sources: 23,
    type: 'accident',
    affectedPeople: 15,
    escalation: 55,
    suggestedActions: [
      'Divert traffic to alternate highways via Shimoga route',
      'Deploy medical helicopters for critical patients',
      'Close multiple lanes for accident investigation',
      'Coordinate with highway authority for clearance',
    ],
    riskFactors: ['Heavy traffic volume', 'High-speed impact', 'Multiple injuries'],
  },
  {
    id: 'd4',
    title: 'Medical Emergency Surge - Government Hospital Delhi',
    summary: 'Unusual surge in heatwave-related medical cases at Government Hospital, Delhi. Multiple cases of heat exhaustion and dehydration reported. Hospital capacity reaching critical levels.',
    lat: 28.6139,
    lng: 77.2090,
    severity: 'MEDIUM',
    confidence: 'MEDIUM',
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    sources: 12,
    type: 'medical',
    affectedPeople: 28,
    escalation: 42,
    suggestedActions: [
      'Activate heat wave response protocol immediately',
      'Set up cooling centers in community areas',
      'Issue public advisory for heat safety measures',
      'Prepare overflow wards in nearby medical facilities',
    ],
    riskFactors: ['Record temperatures', 'Extreme heat', 'Hospital capacity'],
  },
  {
    id: 'd5',
    title: 'Structural Collapse Risk - Old Heritage Building Kolkata',
    summary: 'Structural engineers have evacuated residents from a heritage-listed residential building in Kolkata after detecting critical foundation damage. Building dates back to 1920s and requires immediate stabilization.',
    lat: 22.5726,
    lng: 88.3639,
    severity: 'MEDIUM',
    confidence: 'HIGH',
    timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
    sources: 8,
    type: 'structural',
    affectedPeople: 300,
    escalation: 38,
    suggestedActions: [
      'Establish 500m safety perimeter around building',
      'Alert nearby commercial establishments of potential collapse',
      'Deploy structural assessment and shoring teams',
      'Coordinate with heritage preservation authorities',
    ],
    riskFactors: ['Foundation failure', 'Heritage structure', 'Dense urban area'],
  },
];

export const INITIAL_SOS: SOSSignal[] = [
  {
    id: 'sos1',
    lat: 19.1100,
    lng: 72.8710,
    type: 'flood',
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    description: 'Water entering apartment building ground floor, urgent evacuation needed',
    userLocation: 'Andheri East, Mumbai',
  },
  {
    id: 'sos2',
    lat: 28.6100,
    lng: 77.2050,
    type: 'medical',
    status: 'acknowledged',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    description: 'Severe heat stroke, elderly family member requiring immediate medical attention',
    userLocation: 'Laxmi Nagar, Delhi',
  },
  {
    id: 'sos3',
    lat: 20.3000,
    lng: 85.8300,
    type: 'fire',
    status: 'pending',
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    description: 'Roof damage and fire risk from storm, family trapped on upper floor',
    userLocation: 'Bhubaneswar, Odisha',
  },
];

export const HEATMAP_DATA: HeatmapPoint[] = [
  { lat: 19.1136, lng: 72.8697, intensity: 0.95 }, // Mumbai flood zone
  { lat: 19.1200, lng: 72.8600, intensity: 0.8 },
  { lat: 19.1050, lng: 72.8750, intensity: 0.7 },
  { lat: 19.1180, lng: 72.8750, intensity: 0.6 },
  
  { lat: 20.2961, lng: 85.8245, intensity: 0.92 }, // Odisha cyclone zone
  { lat: 20.3050, lng: 85.8300, intensity: 0.75 },
  { lat: 20.2850, lng: 85.8150, intensity: 0.65 },
  
  { lat: 28.6139, lng: 77.2090, intensity: 0.88 }, // Delhi heatwave zone
  { lat: 28.6200, lng: 77.2100, intensity: 0.7 },
  { lat: 28.6050, lng: 77.2050, intensity: 0.6 },
];

export const RESOURCE_LOCATIONS = {
  hospitals: [
    { id: 'h1', name: 'Government Hospital Delhi', lat: 28.6139, lng: 77.2090, beds: 450 },
    { id: 'h2', name: 'Lilavati Hospital Mumbai', lat: 19.1136, lng: 72.8697, beds: 600 },
    { id: 'h3', name: 'Kalinga Hospital Bhubaneswar', lat: 20.2961, lng: 85.8245, beds: 350 },
  ],
  shelters: [
    { id: 's1', name: 'Relief Camp Andheri', lat: 19.1136, lng: 72.8697, capacity: 2000 },
    { id: 's2', name: 'Community Shelter Odisha', lat: 20.2961, lng: 85.8245, capacity: 1500 },
    { id: 's3', name: 'Delhi Civic Center Relief', lat: 28.6139, lng: 77.2090, capacity: 1200 },
  ],
  evacRoutes: [
    { id: 'r1', name: 'Safe Route - Elevated North Passage', lat: 19.1200, lng: 72.8700 },
    { id: 'r2', name: 'Safe Route - Western Elevated Expressway', lat: 19.1000, lng: 72.8500 },
  ],
};

export function calculateConfidence(sources: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (sources >= 20) return 'HIGH';
  if (sources >= 10) return 'MEDIUM';
  return 'LOW';
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers (for India)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}
