import cron from 'node-cron';
import { syncSoroRss } from './soroRssService';

export const startSoroScheduler = () => {
  console.log('🤖 Soro automatic sync scheduler started.');
  console.log('⏰ Soro RSS will be checked every hour.');

  // Run once when the backend starts.
  void syncSoroRss()
    .then((result) => {
      console.log(
        `🤖 Initial Soro sync complete — Imported: ${result.imported}, Skipped: ${result.skipped}`,
      );
    })
    .catch((error) => {
      console.error('❌ Initial Soro sync failed:', error);
    });

  // Run at the beginning of every hour.
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running scheduled Soro RSS sync...');

    try {
      const result = await syncSoroRss();

      console.log(
        `🤖 Scheduled Soro sync complete — Imported: ${result.imported}, Skipped: ${result.skipped}`,
      );
    } catch (error) {
      console.error('❌ Scheduled Soro RSS sync failed:', error);
    }
  });
};
