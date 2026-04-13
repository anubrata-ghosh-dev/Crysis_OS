# CRYSIS_OS Monorepo Architecture

## 🏗️ Overview

CRYSIS_OS is now a professional monorepo with two independent applications sharing a common Firebase backend:

1. **Admin Dashboard** (`/apps/admin`) - Read-only incident monitoring for emergency responders
2. **Citizen Reporting App** (`/apps/citizen`) - Public-facing incident reporting interface
3. **Shared Modules** (`/shared`) - Reusable Firebase, types, and utilities

---

## 📁 Directory Structure

```
crysis-os/
├── apps/
│   ├── admin/                    # Admin dashboard (READ-ONLY)
│   │   ├── app/                 # Next.js app router pages
│   │   ├── components/          # UI components (map, panels, etc.)
│   │   ├── lib/                 # Local imports from shared
│   │   ├── styles/              # Tailwind CSS
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── .env.local
│   │
│   └── citizen/                  # Citizen reporting app (WRITE-ENABLED)
│       ├── app/                 # Next.js app router pages
│       ├── components/          # UI components (form, etc.)
│       ├── lib/                 # Local imports from shared
│       ├── styles/              # Tailwind CSS
│       ├── next.config.js
│       ├── tsconfig.json
│       ├── package.json
│       └── .env.local
│
├── shared/                       # Shared modules (NO APP CODE)
│   ├── firebase/                # Firebase configuration
│   │   └── config.ts           # Single Firebase initialization
│   ├── api/                     # API services
│   │   ├── incidents.ts        # Incident CRUD (READ-ONLY in admin)
│   │   ├── reports.ts          # SOS reports
│   │   └── resources.ts        # Hospitals, shelters
│   ├── types/                   # Type definitions
│   │   └── mockData.ts         # Disaster, SafeZone types, mock data
│   └── utils/                   # Utility functions
│
├── package.json                 # Root monorepo config
└── .env.local                   # Shared Firebase credentials
```

---

## 🚀 Running the Applications

### Option 1: Run Both Apps
```bash
npm run dev
# Admin:   http://localhost:3000
# Citizen: http://localhost:3001
```

### Option 2: Run Admin Only
```bash
npm run dev:admin
# Admin:   http://localhost:3000
```

### Option 3: Run Citizen Only
```bash
npm run dev:citizen
# Citizen: http://localhost:3001
```

### First Time Setup
```bash
npm run install:all
npm run dev
```

---

## 🔐 Responsibility Matrix

| Operation | Admin App | Citizen App | Shared |
|-----------|-----------|-------------|--------|
| Read incidents | ✅ | ✗ | ✅ API |
| Create incidents | ✗ | ✅ | ✅ API |
| Update incidents | ✗ | ✗ | ✅ (deprecated) |
| Delete incidents | ✗ | ✗ | ✅ (deprecated) |
| Real-time listening | ✅ | ✗ | ✅ onSnapshot() |
| Geolocation capture | ✗ | ✅ | ✗ |
| Map rendering | ✅ | ✗ | ✗ |
| Firebase config | ✗ | ✗ | ✅ |

---

## 📦 Import Patterns

### In Admin App
```typescript
// Import from shared Firebase
import { db } from '@/lib/firebase';

// Which actually does:
import { db } from '@shared/firebase/config';

// Import from shared types
import { Disaster } from '@/lib/mockData';

// Which actually does:
import { Disaster } from '@shared/types/mockData';
```

### In Citizen App
```typescript
// Same import pattern
import { db } from '@/lib/firebase';
import type { Disaster } from '@/lib/mockData';
import { incidentService } from '@/lib/api';
```

### Path Resolution (tsconfig.json)
Both apps have:
```json
{
  "paths": {
    "@/*": ["./*"],
    "@shared/*": ["../../shared/*"]
  }
}
```

---

## 🔥 Firebase Configuration

### Shared Config Location
**File:** `shared/firebase/config.ts`

```typescript
export { app, db };
```

### Usage
Both apps import from the same config:
```typescript
import { db } from '@shared/firebase/config';
// or via re-export:
import { db } from '@/lib/firebase';
```

### Environment Variables
Create `.env.local` in project root and copy to both apps:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 🎯 Data Flow

### Citizen → Admin (Real-time)
```
1. Citizen submits form
   ↓
2. Citizen app calls: incidentService.addIncident()
   ↓
3. Data written to Firebase: collection("incidents")
   ↓
4. Admin app listens via: incidentService.getIncidentsRealtime()
   ↓
5. Admin map updates in real-time
```

### Architecture Guarantee
- ✅ Same Firebase backend
- ✅ Real-time sync via Firestore listeners
- ✅ No polling or manual refresh needed
- ✅ Read-only admin (no accidental writes)
- ✅ Write-protected citizen data

---

## 🛠️ Development

### Add a New Utility Function
1. Create in `shared/utils/myUtil.ts`
2. Import in apps:
   ```typescript
   import { myUtil } from '@shared/utils/myUtil';
   ```

### Add a New API Service
1. Create in `shared/api/myService.ts`
2. Re-export in `apps/[app]/lib/api/myService.ts`
3. Import in components

### Add a New Component
Only add to specific app (`apps/admin/components/` or `apps/citizen/components/`)

### Share a Component
1. Consider if it's truly shared
2. If yes, create in both apps (duplication is acceptable for isolation)
3. Or move to a `shared/components/` folder

---

## 🧪 Testing

### Admin App
```bash
cd apps/admin
npm run dev
# Test: http://localhost:3000
```

### Citizen App
```bash
cd apps/citizen
npm run dev
# Test: http://localhost:3001
```

### Test Real-time Sync
1. Open Admin: http://localhost:3000
2. Open Citizen: http://localhost:3001
3. Submit incident in Citizen app
4. Watch Admin app update in real-time

---

## 📋 Build & Deploy

### Build All Apps
```bash
npm run build
```

### Build Individual Apps
```bash
npm run build:admin
npm run build:citizen
```

### Deploy Admin
```bash
cd apps/admin
npm run build
npm run start
# Runs on port 3000
```

### Deploy Citizen
```bash
cd apps/citizen
npm run build
npm run start
# Runs on port 3001
```

---

## ⚠️ Important Rules

### Admin App
- ✅ Read from Firestore
- ✅ Use `getIncidentsRealtime()`, `getDocs()`
- ❌ NEVER use `addDoc()`, `updateDoc()`, `deleteDoc()`

### Citizen App
- ✅ Write to Firestore
- ✅ Use `incidentService.addIncident()`
- ✅ Capture user location
- ❌ NEVER create map or display incidents

### Shared Folder
- ✅ Firebase config
- ✅ Type definitions
- ✅ API services
- ❌ NO Next.js pages or components
- ❌ NO app-specific logic

---

## 🔄 Migrations

### Adding Firebase Features
1. Update `shared/firebase/config.ts`
2. Both apps automatically get the changes

### Synchronizing Dependencies
If both apps need a new dependency:
1. Add to both `apps/admin/package.json` and `apps/citizen/package.json`
2. Run `npm install` in each folder

---

## 📚 Documentation Files

- **MONOREPO_ARCHITECTURE.md** - This file
- **ADMIN_DASHBOARD_REFACTOR.md** - Admin-only refactoring history
- **apps/admin/README.md** - Admin app specifics
- **apps/citizen/README.md** - Citizen app specifics

---

## 🚨 Troubleshooting

### "Module not found" errors
- Ensure paths in `tsconfig.json` are correct
- Check that `@shared/` points to `../../shared/`

### Firebase not initializing
- Check `.env.local` for correct credentials
- App will fallback to mock data if Firebase unavailable

### Port already in use
- Admin: `cd apps/admin && npm run dev -- -p 3001`
- Citizen: `cd apps/citizen && npm run dev -- -p 3002`

### Couldn't resolve dependencies
Run: `npm run install:all`

---

## 📞 Support

For questions about the architecture:
1. Check this document
2. Review `app/page.tsx` in each app
3. Check `shared/firebase/config.ts` for Firebase setup
4. Review `shared/api/incidents.ts` for incident service

**Version:** 1.0.0  
**Last Updated:** April 12, 2026  
**Architecture:** Monorepo with Shared Firebase Backend
