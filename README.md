# CRYSIS_OS

A **high-fidelity real-time crisis intelligence platform** designed to convert chaotic, unverified data into structured, actionable intelligence for emergency response professionals.

## 🎯 Core Philosophy

> "From noise → to clarity → to action"

CRYSIS_OS is NOT a passive information dashboard. It is a **decision-support system** that empowers users to take immediate, informed action during crisis situations.

---

## ✨ Key Features

### 1. Signal Over Noise Engine
- Ingests raw, unverified data (citizen reports, sensors, feeds)
- AI-powered summarization converts chaos into structured alerts
- Each alert includes: Title, Summary, Severity, Timestamp, Source Count

### 2. Dual-Layer Architecture
- **Citizen Layer**: Raw SOS signals (🟡) - urgent, unfiltered reports
- **Intelligence Layer**: AI-processed alerts (🔴) - verified, actionable intelligence
- Both layers visible and distinguishable on the map

### 3. Confidence Scoring System
- Every alert displays confidence level: LOW / MEDIUM / HIGH
- Calculated based on number of sources and data consistency
- Visual indicators: badges + color-coded glow effects

### 4. Action-Oriented Interface
- No passive elements
- Every piece of information leads to an action
- Action buttons: "Find Hospital", "Find Shelter", "Evac Route"

### 5. Risk Heatmap
- Visual overlay showing predicted danger zones
- Dynamic and responsive
- Rule-based intensity calculation

---

## 🎨 Visual Design

**Inspired by:**
- Aviation command systems
- Military operation centers
- Space mission control

**Color Palette:**
- Background: `#0B1220` (deep navy)
- Primary: Neon cyan + blue
- Danger: Red
- Warning: Amber
- Safe: Green

**Aesthetic:**
- Glassmorphism panels
- Soft glow effects
- Subtle gradients
- Smooth animations

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps**: Leaflet.js
- **Backend**: Next.js API Routes
- **AI**: OpenAI (summarization)
- **State**: React Hooks

### Folder Structure
```
crysis-os/
├── app/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Command center
│   ├── sos/
│   │   └── page.tsx              # SOS dispatch interface
│   ├── dashboard/
│   │   └── page.tsx              # KPI monitoring
│   └── api/
│       ├── summarize/route.ts    # AI summarization
│       ├── sos/route.ts          # SOS submission
│       └── disasters/route.ts    # Disaster data
├── components/
│   ├── Navbar.tsx                # Top navigation bar
│   ├── IconSidebar.tsx           # Left icon navigation
│   ├── MapView.tsx               # Leaflet map
│   ├── IntelligenceFeed.tsx      # Alert feed (right panel)
│   ├── AlertCard.tsx             # Alert card component
│   ├── SOSButton.tsx             # Pulsing SOS button
│   ├── ResourceBar.tsx           # Action buttons bar
│   └── HeatmapLayer.tsx          # Risk heatmap
├── lib/
│   ├── openai.ts                 # OpenAI integration
│   ├── mockData.ts               # Mock crisis data
│   └── utils.ts                  # Utility functions
├── styles/
│   └── globals.css               # Global styles + animations
├── public/                        # Static assets
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
echo "OPENAI_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📖 Usage

### Command Center (`/`)
- **Left Sidebar**: Navigation icons (Map, Alerts, SOS, Dashboard)
- **Center**: Interactive Leaflet map with disaster markers (🔴) and SOS signals (🟡)
- **Right Panel**: Intelligence feed showing all active incidents
- **Bottom**: Action bar with "Find Hospital", "Find Shelter", "Evac Route" buttons
- **Bottom-Right**: Pulsing SOS button for emergency dispatch

### SOS Interface (`/sos`)
- Emergency type selection (Medical, Fire, Flood, etc.)
- Auto-detect location (GPS simulation)
- Description field for situational details
- Instant dispatch to emergency services
- Live marker update on map

### Dashboard (`/dashboard`)
- KPI cards: Active Incidents, People Affected, Response Time, Success Rate
- Live incidents table with sorting
- Real-time status indicators

---

## 🔄 Real-Time Features

- **Live Alert Updates**: Simulated alert feed with confidence scoring
- **Dynamic SOS Signals**: New citizen reports appear in real-time
- **Affected Population**: Numbers update as situations evolve
- **Confidence Degradation**: Alerts' confidence shifts as new data arrives

---

## 🧪 Demo Data

The system includes realistic mock data:
- **5 active disasters** with varying severity levels
- **3 SOS signals** from citizens
- **Multiple resource locations**: hospitals, shelters, evacuation routes
- **Heatmap data**: risk zone predictions

---

## 📝 API Endpoints

### `POST /api/sos`
Submit an emergency signal
```json
{
  "type": "medical|fire|flood|accident|other",
  "description": "Emergency description",
  "location": { "lat": 40.7505, "lng": -73.9972 },
  "timestamp": "ISO8601"
}
```

### `GET /api/disasters`
Fetch active disasters
```json
{
  "disasters": [...],
  "timestamp": "ISO8601",
  "total": 5
}
```

### `POST /api/summarize`
Summarize raw crisis data
```json
{
  "text": "Raw report to summarize"
}
```

---

## 🎬 Demo Flow

1. **System Boot**: Dashboard shows 5 active incidents
2. **Map View**: Click any marker to see details
3. **Alert Details**: View title, summary, confidence, affected population
4. **Action**: Click "Find Hospital" to see nearest resource
5. **SOS Dispatch**: Click bottom-right button → submit emergency → instant map update
6. **Monitoring**: Dashboard shows real-time metrics and incident table

---

## 🎯 Design Principles

1. **Professional First**: Looks like real emergency ops, not a student project
2. **Clarity Over Simplicity**: Complex data, clear presentation
3. **Action-Driven**: Every UI element enables decision-making
4. **Real-Time Feel**: Animations and updates create urgency
5. **Visual Hierarchy**: Severity instantly visible at a glance

---

## 🔮 Future Enhancements

- [ ] Real satellite/OSM map data
- [ ] WebSocket integration for live updates
- [ ] Machine learning confidence scoring
- [ ] Multi-user collaboration
- [ ] Video feed integration
- [ ] Push notifications
- [ ] Historical incident analysis
- [ ] Automated response triggers

---

## 📜 License

MIT

---

## 👨‍💻 Credits

Built as a hackathon project to demonstrate:
- Professional-grade UI/UX
- Real-time data visualization
- Crisis decision support
- Emergency response technology

**Remember**: This is a demonstration system. In real emergencies, use official emergency services.
