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
  recommendedActions?: string[]; // Specific, actionable guidance for decision-makers
  riskFactors?: string[];
  prediction?: string; // Forward-looking intelligence about how situation may evolve
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

export interface SafeZone {
  id: string;
  title: string;
  lat: number;
  lng: number;
  type: 'shelter' | 'hospital' | 'safe-area';
  description: string;
  relatedAlertId?: string; // Which alert this is safe from
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
    recommendedActions: [
      'DO NOT use Andheri Link Road - severe waterlogging',
      'Avoid the 2km radius zone. Use alternate routes via elevated expressway',
      'Stay indoors if currently in affected area. Move to upper floors',
      'Do not attempt to drive - visibility is low, road damage unknown',
      'Open Relief Camp Andheri for emergency intake of 2,000+ people',
      'Deploy NDRF rescue units to Andheri Station & Eastern suburbs',
      'Issue evacuation alerts via SMS/sirens for surrounding 3km zone',
      'Activate hospital mass casualty protocols',
    ],
    prediction: 'Water levels expected to rise another 0.5m in next 30 minutes. Flooding risk will spread eastward. Situation critical until 02:30 AM.',
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
    recommendedActions: [
      'IMMEDIATE: Evacuate all coastal fishing settlements to Odisha Community Shelter',
      'Do NOT venture into open areas - wind speeds 100+ kmph, flying debris hazard',
      'Secure all structures with structural damage reporting to BMC',
      'Deploy rescue teams in protected equipment only',
      'Alert all marine vessels - return to harbor immediately',
      'Activate hospital surge protocols for trauma cases',
      'Block affected sections of coastal highway NH16 to all traffic',
      'Maintain 24h emergency response at Kalinga Hospital',
    ],
    prediction: 'Storm peak intensity expected in 20 minutes. Coastal surge possibility in 35-45 minutes. Situation will improve significantly after 04:00 AM.',
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
    recommendedActions: [
      'DETOUR: Redirect all traffic to NH44 via Shimoga route - expect 45min delay',
      'Close NH48 northbound for 5km around accident zone',
      'Deploy medical helicopters to National Institute of Virology helipad (7km away)',
      'Send trauma teams & 20-bed mobile ICU to accident site immediately',
      'Activate 24hr traffic management at Highway Authority',
      'Do NOT allow civilian approach - hazmat cleanup required',
      'Secure area for accident investigation - expect 3-4 hour clearance',
      'Alert nearby hospitals (60km radius) for incoming 10+ critical cases',
    ],
    prediction: 'Clearance expected in 3.5 hours. Vehicle recovery will continue through morning peak. Expect traffic disruptions until 08:00 AM.',
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
    recommendedActions: [
      'Activate heatwave response protocol - deploy additional cooling centers now',
      'Set up 5+ misting & hydration stations across Laxmi Nagar zone',
      'Divert incoming patients to nearby Fortis & Max hospitals',
      'Prepare overflow 50-bed wards in Government Hospital annex',
      'Issue public advisory via radio/SMS - peak heat: 12-5pm, stay indoors',
      'Activate special transport for elderly & vulnerable populations',
      'Stock medical supplies: 500L IV fluids, electrolyte packets',
      'Position additional ambulances (10+) across high-risk zones',
    ],
    prediction: 'Peak heat expected 2-5pm today (41°C). Case influx will peak in next 4 hours. Situation stabilizes after sunset.',
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
    recommendedActions: [
      'Establish 500m NO ENTRY exclusion zone around building perimeter',
      'Evacuate all residents within 300m radius to nearby shelters immediately',
      'Alert 200+ surrounding commercial establishments - possible closure needed',
      'Deploy structural shoring & stabilization teams with specialized equipment',
      'Initiate heritage building stabilization assessment with survey teams',
      'Route all foot & vehicle traffic away from building for next 3-7 days',
      'Prepare relocation support for evacuated residents (2-3 weeks minimum)',
      'Institute 24hr perimeter monitoring & daily structural assessment',
    ],
    prediction: 'Building remains at moderate collapse risk for 48-72 hours. Shoring work critical in next 12 hours. Full stabilization estimated 1-2 weeks.',
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

export const INITIAL_SAFE_ZONES: SafeZone[] = [
  // Mumbai Flood (d1: 19.1136, 72.8697) - Safe zones NORTH and EAST (outside danger)
  {
    id: 'safe1',
    title: 'Relief Camp Andheri',
    lat: 19.1500,  // ~3.5 km north
    lng: 72.7900,  // ~8 km west (away from water)
    type: 'shelter',
    description: 'Emergency shelter with 2000+ capacity, elevated terrain',
    relatedAlertId: 'd1',
  },
  {
    id: 'safe2',
    title: 'Lilavati Hospital - Elevated Wing',
    lat: 19.0800,  // ~3.5 km south (but elevated, safe from flooding)
    lng: 72.8300,  // ~4 km west
    type: 'hospital',
    description: 'Advanced medical facility, backup power, safe floors 5+',
    relatedAlertId: 'd1',
  },
  // Odisha Cyclone (d2: 20.2961, 85.8245) - Safe zones INLAND away from coast
  {
    id: 'safe3',
    title: 'Community Shelter Odisha',
    lat: 20.1500,  // ~15 km inland (south)
    lng: 85.6500,  // ~18 km inland (west)
    type: 'shelter',
    description: 'Inland evacuation center, away from storm surge zone',
    relatedAlertId: 'd2',
  },
  {
    id: 'safe4',
    title: 'Kalinga Hospital - Secure Wing',
    lat: 20.1800,  // ~12 km inland
    lng: 85.5800,  // ~22 km inland
    type: 'hospital',
    description: 'Protected medical facility with reinforced structure',
    relatedAlertId: 'd2',
  },
  // Delhi Heatwave (d4: 28.6139, 77.2090) - Safe zones NORTH and SOUTH
  {
    id: 'safe5',
    title: 'AC Cooling Center - Laxmi Nagar',
    lat: 28.5500,  // ~6 km south
    lng: 77.1500,  // ~3 km west
    type: 'safe-area',
    description: 'Public cooling center with free water & rest facilities',
    relatedAlertId: 'd4',
  },
  {
    id: 'safe6',
    title: 'Government Hospital Delhi - ICU Wing',
    lat: 28.6500,  // ~4 km north
    lng: 77.2800,  // ~7 km east
    type: 'hospital',
    description: 'Hospital with emergency cooling & medical support',
    relatedAlertId: 'd4',
  },
  // Pune Accident (d3: 18.5204, 73.8567) - Safe zones on ALTERNATE ROUTE
  {
    id: 'safe7',
    title: 'Safe Route Junction - NH44',
    lat: 18.4500,  // ~8 km south (alternate route)
    lng: 73.7200,  // ~12 km west
    type: 'safe-area',
    description: 'Alternate highway route, clear traffic, medical support',
    relatedAlertId: 'd3',
  },
  // Kolkata Building (d5: 22.5726, 88.3639) - Safe zones AWAY from building
  {
    id: 'safe8',
    title: 'Municipal Relief Center - Kolkata',
    lat: 22.5000,  // ~8 km south
    lng: 88.2500,  // ~14 km west
    type: 'shelter',
    description: 'Safe evacuation center for displaced residents',
    relatedAlertId: 'd5',
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
