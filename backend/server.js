import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeFirebase } from './config/firebase.js';
import incidentsRouter from './routes/incidents.js';
import reportsRouter from './routes/reports.js';
import resourcesRouter from './routes/resources.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase
initializeFirebase();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/incidents', incidentsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/resources', resourcesRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
