import express from 'express';
import { getFirestore } from '../config/firebase.js';

const router = express.Router();

/**
 * POST /api/reports - Create a citizen SOS report
 */
router.post('/', async (req, res) => {
  try {
    const { lat, lng, type, description, userLocation } = req.body;

    if (!lat || !lng || !type) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const db = getFirestore();
    const newReport = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      type,
      description: description || '',
      userLocation: userLocation || '',
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    const docRef = await db.collection('sos_reports').add(newReport);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...newReport },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/reports - Fetch all reports
 */
router.get('/', async (req, res) => {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('sos_reports').orderBy('timestamp', 'desc').limit(50).get();
    
    const reports = [];
    snapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
