import { CommunicationDispatchCron } from './communication-dispatch.cron';

export class CronJobs {
  private communicationDispatchCron: CommunicationDispatchCron;

  constructor() {
    this.communicationDispatchCron = new CommunicationDispatchCron();
  }

  public start(): void {
    this.communicationDispatchCron.start();
  }

  public stop(): void {
    // Stop all CRON jobs
  }
}

export const cronJobs = new CronJobs();
