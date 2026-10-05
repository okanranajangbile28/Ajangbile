import express from 'express';
import BlogV2 from '../models/BlogV2';
import { syncSoroRss, cleanSoroContent } from '../services/soroRssService';

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

// Repair the two Soro articles that were imported before
// source and soroGuid were added to the BlogV2 model.
router.post('/repair', async (_req, res) => {
  try {
    const repairs = [
      {
        title: 'Okanran Ajangbile Meaning and Cultural Context',
        guid: 'ff1effe8-3aed-415f-9eeb-14e5a29f72c9',
      },
      {
        title: 'Ajangbile Family History and Living Memory',
        guid: 'a9d43b8b-d5e5-4457-8673-6ba7924be077',
      },
    ];

    let repaired = 0;

    for (const repair of repairs) {
      const article = await BlogV2.findOne({
        title: repair.title,
      });

      if (!article) {
        console.log(`⚠️ Article not found: ${repair.title}`);
        continue;
      }

      article.content = cleanSoroContent(article.content || '');
      article.source = 'soro';
      article.soroGuid = repair.guid;

      await article.save();

      repaired++;

      console.log(`🔧 Repaired Soro article: ${article.title}`);
    }

    res.status(200).json({
      success: true,
      message: 'Existing Soro articles repaired successfully.',
      repaired,
    });
  } catch (error: any) {
    console.error('❌ Soro repair failed:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Soro repair failed.',
    });
  }
});

export default router;
