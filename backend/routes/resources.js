import express from 'express';

const router = express.Router();

/**
 * GET /api/resources - Fetch available resources (hospitals, shelters, etc.)
 */
router.get('/', (req, res) => {
  // Return resource locations from data
  const resources = {
    hospitals: [
      { id: 'h1', name: 'Apollo Hospitals', lat: 28.5355, lng: 77.3910, type: 'hospital' },
      { id: 'h2', name: 'Max Healthcare', lat: 28.5244, lng: 77.1855, type: 'hospital' },
      { id: 'h3', name: 'Fortis Hospital', lat: 28.4595, lng: 77.2480, type: 'hospital' },
    ],
    shelters: [
      { id: 's1', name: 'Red Cross Shelter', lat: 28.6139, lng: 77.2090, type: 'shelter' },
      { id: 's2', name: 'Community Center', lat: 28.5244, lng: 77.1855, type: 'shelter' },
      { id: 's3', name: 'School Gymnasium', lat: 28.4595, lng: 77.2480, type: 'shelter' },
    ],
  };

  res.json({ success: true, data: resources });
});

export default router;
