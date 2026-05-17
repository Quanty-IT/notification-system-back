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
      console.log('[CRON] Rodou em:', new Date().toISOString());
      console.log('[CRON] Horário local:', new Date().toLocaleString('pt-BR'));

      await this.processPendingCommunications();
    });
  }

  private async processPendingCommunications(): Promise<void> {
    try {
      console.log('[CRON] Buscando comunicações pendentes...');

      const pendingCommunications = await this.communicationService.getPendingCommunications();

      console.log('[CRON] Comunicações encontradas:', pendingCommunications.communications.length);

      if (pendingCommunications.communications.length === 0) {
        return;
      }

      for (const communication of pendingCommunications.communications) {
        try {
          console.log('[CRON] Processando comunicação:', communication.id);

          await this.communicationService.processCommunication(communication.id);

          console.log('[CRON] Comunicação processada:', communication.id);

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('[CRON] Erro ao processar comunicação:', communication.id, error);
        }
      }
    } catch (error) {
      console.error('[CRON] Erro geral:', error);
    }
  }
}
