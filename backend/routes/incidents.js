import express from 'express';
import { getFirestore } from '../config/firebase.js';

const router = express.Router();

/**
 * GET /api/incidents - Fetch all incidents
 */
router.get('/', async (req, res) => {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('incidents').orderBy('timestamp', 'desc').limit(100).get();
    
    const incidents = [];
    snapshot.forEach((doc) => {
      incidents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({ success: true, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/incidents/:id - Fetch single incident
 */
router.get('/:id', async (req, res) => {
  try {
    const db = getFirestore();
    const doc = await db.collection('incidents').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }

    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/incidents - Create new incident
 */
router.post('/', async (req, res) => {
  try {
    const { lat, lng, type, severity, description } = req.body;

    if (!lat || !lng || !type || !severity) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const db = getFirestore();
    const newIncident = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      type,
      severity,
      description: description || '',
      reports_count: 1,
      escalation: 0,
      affectedPeople: 0,
      sources: 1,
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    const docRef = await db.collection('incidents').add(newIncident);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...newIncident },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/incidents/:id - Update incident
 */
router.patch('/:id', async (req, res) => {
  try {
    const db = getFirestore();
    const { escalation, affectedPeople, sources, status } = req.body;

    const updateData = {};
    if (escalation !== undefined) updateData.escalation = escalation;
    if (affectedPeople !== undefined) updateData.affectedPeople = affectedPeople;
    if (sources !== undefined) updateData.sources = sources;
    if (status !== undefined) updateData.status = status;

    await db.collection('incidents').doc(req.params.id).update(updateData);

    res.json({ success: true, message: 'Incident updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/incidents/:id - Mark incident as resolved
 */
router.delete('/:id', async (req, res) => {
  try {
    const db = getFirestore();
    await db.collection('incidents').doc(req.params.id).update({
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Incident resolved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
