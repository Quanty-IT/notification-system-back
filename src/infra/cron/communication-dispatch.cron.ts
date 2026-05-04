import * as cron from 'node-cron';
import { CommunicationService } from '../../modules/communications/application/communication.service';
import { CommunicationRepositoryPrisma } from '../../modules/communications/infra/communication.repository.prisma';
import { R2FileStorage } from '../../modules/communications/infra/file-storage.r2';
import { TemplateVersionRepositoryPrisma } from '../../modules/template-versions/infra/template-version.repository.prisma';
import { prisma } from '../database/prisma.client';

export class CommunicationDispatchCron {
  private communicationService: CommunicationService;

  constructor() {
    const repository = new CommunicationRepositoryPrisma(prisma);
    const templateVersionRepository = new TemplateVersionRepositoryPrisma(prisma);
    const fileStorage = new R2FileStorage();

    this.communicationService = new CommunicationService(repository, templateVersionRepository, fileStorage);
  }

  public start(): void {
    cron.schedule('* * * * *', async () => {
      await this.processPendingDispatches();
    });
  }

  private async processPendingDispatches(): Promise<void> {
    try {
      const pendingDispatches = await this.communicationService.getPendingDispatches();

      if (pendingDispatches.dispatches.length === 0) {
        return;
      }

      for (const dispatch of pendingDispatches.dispatches) {
        try {
          await this.communicationService.processDispatch(dispatch.id);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (_error) {
          // Continue processing other dispatches
        }
      }
    } catch (_error) {
      // Handle general error
    }
  }
}
