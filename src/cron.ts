import { cronJobs } from './infra/cron';

async function startCronJobs(): Promise<void> {
  try {
    cronJobs.start();

    process.on('SIGINT', () => {
      cronJobs.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      cronJobs.stop();
      process.exit(0);
    });
  } catch (_error) {
    process.exit(1);
  }
}

startCronJobs().catch(() => {
  process.exit(1);
});
