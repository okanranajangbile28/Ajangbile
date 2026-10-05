import express from 'express';
import { syncSoroRss } from '../services/soroRssService';

const router = express.Router();

// Temporary/manual Soro RSS sync
router.post('/sync', async (_req, res) => {
  try {
    const result = await syncSoroRss();

    res.status(200).json({
      success: true,
      message: 'Soro RSS sync completed.',
      ...result,
    });
  } catch (error: any) {
    console.error('❌ Soro RSS sync failed:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Soro RSS sync failed.',
    });
  }
});

export default router;
