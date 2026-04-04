# CRYSIS_OS - Quick Start Guide

## 🚀 Installation (< 5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Setup
Create `.env.local` in the project root:
```
OPENAI_API_KEY=sk-...your-key...
```

### Step 3: Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📖 Usage Guide

### 🎯 Main Interface (`/`)
- **MAP (Center)**: Interactive map with disaster markers (red) and SOS signals (yellow)
- **FEED (Right)**: Real-time alert intelligence stream
- **TOP**: System status ("● LIVE SYSTEM") and alert count
- **LEFT**: Icon navigation (Map, Alerts, SOS, Dashboard)
- **BOTTOM**: Resource action buttons (Hospital, Shelter, Evacuation)
- **BOTTOM-RIGHT**: Pulsing SOS emergency button

### 🚨 SOS Emergency (`/sos`)
1. Emergency type selection
2. Auto-detected GPS location
3. Description input
4. Send to emergency services
5. Automatic map update

### 📊 Dashboard (`/dashboard`)
- KPI cards with real-time metrics
- Active incidents table
- Response time tracking
- Success rate monitoring

---

## 🎨 Customization

### Edit Colors (Tailwind)
File: `tailwind.config.js`
```js
'crisis-cyan': '#00D9FF',    // Primary
'crisis-danger': '#FF0033',  // Red alerts
'crisis-warning': '#FFB800', // Amber warnings
'crisis-safe': '#00DD66',    // Green safe
```

### Add New Alerts
File: `lib/mockData.ts`
```ts
export const INITIAL_DISASTERS: Disaster[] = [
  // Add here
];
```

### Customize Map
File: `components/MapView.tsx`
```ts
mapRef.current = L.map('map-container', {
  center: [40.7505, -73.9972], // Change coordinates
  zoom: 12,
});
```

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🔧 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Map Not Loading
- Ensure Leaflet CSS is included via Tailwind
- Check browser console for errors

### Styling Issues
```bash
npm run build
# Then restart dev server
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📝 API Reference

### Endpoints

#### POST /api/sos
Send emergency signal
```json
{
  "type": "medical|fire|flood|accident|other",
  "description": "Emergency details",
  "location": { "lat": 40.75, "lng": -73.99 },
  "timestamp": "2024-04-04T..."
}
```

#### GET /api/disasters
Fetch active incidents
```json
{
  "disasters": [...],
  "timestamp": "...",
  "total": 5
}
```

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet.js](https://leafletjs.com)
- [Framer Motion](https://www.framer.com/motion)

---

## ⚡ Performance Tips

- **Reduce Marker Clutter**: Filter alerts limit to top 10
- **Lazy Load Images**: Use Next.js Image component
- **Cache API Calls**: Implement React Query
- **Optimize Bundle**: Use dynamic imports for heavy components

---

## 🐛 Debug Mode

Add to URL: `?debug=true`

Shows:
- Component render counts
- API call logs
- Performance metrics

---

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Review Next.js error messages
3. Check `README.md` for architecture

---

## 📜 License

MIT - Feel free to clone and modify!
