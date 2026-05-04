import createHttpError from 'http-errors';
import { TemplateVersionRepository } from '@/modules/template-versions/domain/template-version.repository';
import { CommunicationEntity } from '../domain/communication.entity';
import { CommunicationRepository } from '../domain/communication.repository';
import { CommunicationAttachmentEntity } from '../domain/communication-attachment.entity';
import { CommunicationDispatchEntity } from '../domain/communication-dispatch.entity';
import { CommunicationRecipientEntity } from '../domain/communication-recipient.entity';
import { FileStorage } from '../domain/file-storage';
import {
  CommunicationAttachmentOutput,
  CommunicationDispatchOutput,
  CommunicationRecipientOutput,
  CreateCommunicationInput,
  CreateCommunicationOutput,
  FindCommunicationAttachmentsOutput,
  FindCommunicationDispatchesOutput,
  FindCommunicationRecipientsOutput,
  FindCommunicationsOutput,
  FindPendingDispatchesOutput,
  GetCommunicationOutput,
  UpdateCommunicationInput,
  UpdateCommunicationOutput,
} from './communication.dto';

type AddAttachmentInput = {
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  content: Buffer;
};

type AddRecipientInput = {
  recipientType: 'to' | 'cc' | 'bcc';
  email: string;
};

const TEN_MEGABYTES = 10 * 1024 * 1024;

export class CommunicationService {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly templateVersionRepository: TemplateVersionRepository,
    private readonly fileStorage: FileStorage,
  ) {}

  async create(input: CreateCommunicationInput, createdByUserId: string): Promise<CreateCommunicationOutput> {
    if (input.sourceType === 'template') {
      if (!input.templateVersionId) {
        throw new createHttpError.BadRequest('Template version ID is required when source type is template');
      }

      const templateVersionExists = await this.templateVersionRepository.findById(input.templateVersionId);
      if (!templateVersionExists) {
        throw new createHttpError.NotFound(`Template version ${input.templateVersionId} not found`);
      }

      if (templateVersionExists.variablesSchemaJson && !input.templateVariablesJson) {
        throw new createHttpError.BadRequest('Template variables JSON is required when template has variables');
      }

      if (templateVersionExists.variablesSchemaJson && input.templateVariablesJson) {
        const templateVariables = Object.keys(templateVersionExists.variablesSchemaJson);
        const providedVariables = Object.keys(input.templateVariablesJson);

        const missingVariables = templateVariables.filter((variable) => !providedVariables.includes(variable));

        if (missingVariables.length > 0) {
          throw new createHttpError.BadRequest(`Missing required template variables: ${missingVariables.join(', ')}`);
        }
      }
    }

    const communication = CommunicationEntity.create(
      input.channel,
      input.sourceType,
      input.status,
      input.subject,
      input.body,
      input.bodyType,
      input.templateVersionId,
      input.templateVariablesJson,
      input.scheduledAt,
      createdByUserId,
    );

    await this.repository.create(communication);

    for (const recipientData of input.recipients) {
      const existingRecipient = await this.repository.findRecipientByEmailAndType(
        communication.id,
        recipientData.email,
        recipientData.recipientType,
      );

      if (existingRecipient) {
        throw new createHttpError.BadRequest(
          `Recipient with email ${recipientData.email} and type ${recipientData.recipientType} already exists for this communication`,
        );
      }

      const recipient = CommunicationRecipientEntity.create(
        communication.id,
        recipientData.recipientType,
        recipientData.email,
      );
      await this.repository.createRecipient(recipient);
    }

    return this.toOutput(communication);
  }

  async findAll(): Promise<FindCommunicationsOutput> {
    const communications = await this.repository.findAll();

    return {
      communications: communications.map((communication) => this.toOutput(communication)),
    };
  }

  async findById(id: string): Promise<GetCommunicationOutput> {
    const communication = await this.repository.findById(id);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${id} not found`);
    }

    const attachments = await this.repository.findAttachmentsByCommunicationId(id);
    const recipients = await this.repository.findRecipientsByCommunicationId(id);
    const dispatches = await this.repository.findDispatchesByCommunicationId(id);

    return {
      ...this.toOutput(communication),
      attachments: attachments.map((attachment) => this.toAttachmentOutput(attachment)),
      recipients: recipients.map((recipient) => this.toRecipientOutput(recipient)),
      dispatches: dispatches.map((dispatch) => this.toDispatchOutput(dispatch)),
    };
  }

  async update(id: string, input: UpdateCommunicationInput): Promise<UpdateCommunicationOutput> {
    const communication = await this.repository.findById(id);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${id} not found`);
    }

    if (input.templateVersionId !== undefined) {
      if (communication.sourceType === 'template' && !input.templateVersionId) {
        throw new createHttpError.BadRequest('Template version ID is required for template source type');
      }

      if (input.templateVersionId !== undefined && input.templateVersionId !== null) {
        const templateVersionExists = await this.templateVersionRepository.findById(input.templateVersionId);
        if (!templateVersionExists) {
          throw new createHttpError.NotFound(`Template version ${input.templateVersionId} not found`);
        }
      }
    }

    if (input.templateVariablesJson !== undefined) {
      if (communication.sourceType === 'template' && !input.templateVariablesJson && communication.templateVersionId) {
        throw new createHttpError.BadRequest('Template variables JSON is required for template source type');
      }
    }

    if (input.subject !== undefined) {
      if (input.subject !== null) {
        communication.updateSubject(input.subject);
      }
    }

    if (input.body !== undefined || input.bodyType !== undefined) {
      if (communication.sourceType === 'template') {
        throw new createHttpError.BadRequest('body and bodyType can only be updated for manual communications');
      }
    }

    if (input.body !== undefined) {
      if (input.body !== null) {
        communication.updateBody(input.body);
      }
    }

    if (input.bodyType !== undefined) {
      if (input.bodyType !== null) {
        communication.updateBodyType(input.bodyType);
      }
    }

    if (input.templateVariablesJson !== undefined) {
      if (communication.sourceType === 'manual') {
        throw new createHttpError.BadRequest('templateVariablesJson can only be updated for template communications');
      }
    }

    if (input.templateVariablesJson !== undefined) {
      if (input.templateVariablesJson !== null) {
        communication.updateTemplateVariables(input.templateVariablesJson);
      }
    }

    if (input.scheduledAt !== undefined) {
      communication.updateScheduledAt(input.scheduledAt);
    }

    await this.repository.update(communication);

    return this.toOutput(communication);
  }

  async delete(id: string): Promise<void> {
    const communication = await this.repository.findById(id);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${id} not found`);
    }

    const attachments = await this.repository.findAttachmentsByCommunicationId(id);

    for (const attachment of attachments) {
      await this.fileStorage.delete(attachment.storageKey);
      await this.repository.deleteAttachment(attachment.id);
    }

    await this.repository.delete(id);
  }

  async addAttachment(communicationId: string, input: AddAttachmentInput): Promise<CommunicationAttachmentOutput> {
    const communication = await this.repository.findById(communicationId);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    if (communication.status !== 'draft' && communication.status !== 'scheduled') {
      throw new createHttpError.BadRequest('Attachments can only be added to draft or scheduled communications');
    }

    if (input.fileSizeBytes <= 0) {
      throw new createHttpError.BadRequest('Invalid file size');
    }

    if (input.fileSizeBytes > TEN_MEGABYTES) {
      throw new createHttpError.BadRequest('File exceeds maximum allowed size of 10 MB');
    }

    const uploadedFile = await this.fileStorage.upload({
      fileName: input.originalFileName,
      mimeType: input.mimeType,
      content: input.content,
    });

    const attachment = CommunicationAttachmentEntity.create(
      communicationId,
      input.originalFileName,
      uploadedFile.storageProvider,
      uploadedFile.storageKey,
      input.mimeType,
      input.fileSizeBytes,
    );

    await this.repository.createAttachment(attachment);

    return this.toAttachmentOutput(attachment);
  }

  async findAttachmentsByCommunicationId(communicationId: string): Promise<FindCommunicationAttachmentsOutput> {
    const communication = await this.repository.findById(communicationId);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    const attachments = await this.repository.findAttachmentsByCommunicationId(communicationId);

    return {
      attachments: attachments.map((attachment) => this.toAttachmentOutput(attachment)),
    };
  }

  async removeAttachment(communicationId: string, attachmentId: string): Promise<void> {
    const communication = await this.repository.findById(communicationId);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    if (communication.status !== 'draft' && communication.status !== 'scheduled') {
      throw new createHttpError.BadRequest('Attachments can only be removed from draft or scheduled communications');
    }

    const attachment = await this.repository.findAttachmentById(attachmentId);

    if (!attachment || attachment.communicationId !== communicationId) {
      throw new createHttpError.NotFound(`Attachment ${attachmentId} not found for communication ${communicationId}`);
    }

    await this.fileStorage.delete(attachment.storageKey);
    await this.repository.deleteAttachment(attachmentId);
  }

  async addRecipient(communicationId: string, input: AddRecipientInput): Promise<CommunicationRecipientOutput> {
    const communication = await this.repository.findById(communicationId);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    if (communication.status !== 'draft' && communication.status !== 'scheduled') {
      throw new createHttpError.BadRequest('Recipients can only be added to draft or scheduled communications');
    }

    const existingRecipient = await this.repository.findRecipientByEmailAndType(
      communicationId,
      input.email,
      input.recipientType,
    );

    if (existingRecipient) {
      throw new createHttpError.BadRequest(
        `Recipient with email ${input.email} and type ${input.recipientType} already exists for this communication`,
      );
    }

    const recipient = CommunicationRecipientEntity.create(communicationId, input.recipientType, input.email);

    await this.repository.createRecipient(recipient);

    return this.toRecipientOutput(recipient);
  }

  async removeRecipient(communicationId: string, recipientId: string): Promise<void> {
    const communication = await this.repository.findById(communicationId);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    if (communication.status !== 'draft' && communication.status !== 'scheduled') {
      throw new createHttpError.BadRequest('Recipients can only be removed from draft or scheduled communications');
    }

    const recipient = await this.repository.findRecipientById(recipientId);

    if (!recipient || recipient.communicationId !== communicationId) {
      throw new createHttpError.NotFound(`Recipient ${recipientId} not found for communication ${communicationId}`);
    }

    await this.repository.deleteRecipient(recipientId);
  }

  async findRecipientsByCommunicationId(communicationId: string): Promise<FindCommunicationRecipientsOutput> {
    const communication = await this.repository.findById(communicationId);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    const recipients = await this.repository.findRecipientsByCommunicationId(communicationId);

    return {
      recipients: recipients.map((recipient) => this.toRecipientOutput(recipient)),
    };
  }

  private toOutput(communication: CommunicationEntity): UpdateCommunicationOutput {
    return {
      id: communication.id,
      channel: communication.channel,
      sourceType: communication.sourceType,
      status: communication.status,
      subject: communication.subject,
      body: communication.body,
      bodyType: communication.bodyType,
      templateVersionId: communication.templateVersionId,
      templateVariablesJson: communication.templateVariablesJson,
      scheduledAt: communication.scheduledAt,
      processingAt: communication.processingAt,
      sentAt: communication.sentAt,
      createdByUserId: communication.createdByUserId,
      createdAt: communication.createdAt,
      updatedAt: communication.updatedAt,
    };
  }

  private toAttachmentOutput(attachment: CommunicationAttachmentEntity): CommunicationAttachmentOutput {
    return {
      id: attachment.id,
      communicationId: attachment.communicationId,
      originalFileName: attachment.originalFileName,
      storageProvider: attachment.storageProvider,
      storageKey: attachment.storageKey,
      fileUrl: `${process.env.CLOUDFLARE_PUBLIC_URL}/${attachment.storageKey}`,
      mimeType: attachment.mimeType,
      fileSizeBytes: attachment.fileSizeBytes,
      createdAt: attachment.createdAt,
    };
  }

  private toRecipientOutput(recipient: CommunicationRecipientEntity): CommunicationRecipientOutput {
    return {
      id: recipient.id,
      communicationId: recipient.communicationId,
      recipientType: recipient.recipientType,
      email: recipient.email,
      createdAt: recipient.createdAt,
    };
  }

  private toDispatchOutput(dispatch: CommunicationDispatchEntity): CommunicationDispatchOutput {
    return {
      id: dispatch.id,
      communicationId: dispatch.communicationId,
      attemptNumber: dispatch.attemptNumber,
      provider: dispatch.provider,
      status: dispatch.status,
      startedAt: dispatch.startedAt,
      finishedAt: dispatch.finishedAt,
    };
  }

  async createInitialDispatch(communicationId: string): Promise<void> {
    const communication = await this.repository.findById(communicationId);
    if (!communication) {
      throw createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    const existingDispatch = await this.repository.findLastDispatchByCommunicationId(communicationId);
    if (existingDispatch?.isProcessing()) {
      throw createHttpError.BadRequest('Communication already has a dispatch in progress');
    }

    const dispatch = CommunicationDispatchEntity.create(communicationId);
    await this.repository.createDispatch(dispatch);
  }

  async processDispatch(dispatchId: string): Promise<void> {
    const dispatch = await this.repository.findDispatchById(dispatchId);
    if (!dispatch) {
      throw createHttpError.NotFound(`Dispatch ${dispatchId} not found`);
    }

    if (!dispatch.isProcessing()) {
      throw createHttpError.BadRequest('Dispatch is not in processing status');
    }

    try {
      await this.sendEmail(dispatch);

      dispatch.markAsSent();
      await this.repository.updateDispatch(dispatch);
    } catch (_error) {
      dispatch.markAsFailed();
      await this.repository.updateDispatch(dispatch);

      await this.handleRetry(dispatch);
    }
  }

  async createDispatchWithNewProvider(
    communicationId: string,
    provider: 'smtp' | 'nodemailer' | 'twilio',
  ): Promise<void> {
    const communication = await this.repository.findById(communicationId);
    if (!communication) {
      throw createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    const lastDispatch = await this.repository.findLastDispatchByCommunicationId(communicationId);
    if (!lastDispatch?.needsNewProvider()) {
      throw createHttpError.BadRequest('Cannot create dispatch with new provider');
    }

    const newDispatch = CommunicationDispatchEntity.createWithNewProvider(communicationId, provider);
    await this.repository.createDispatch(newDispatch);
  }

  async getPendingDispatches(): Promise<FindPendingDispatchesOutput> {
    const dispatches = await this.repository.findPendingDispatches();

    return {
      dispatches: dispatches.map((dispatch) => this.toDispatchOutput(dispatch)),
    };
  }

  async getDispatchesByCommunicationId(communicationId: string): Promise<FindCommunicationDispatchesOutput> {
    const communication = await this.repository.findById(communicationId);
    if (!communication) {
      throw createHttpError.NotFound(`Communication ${communicationId} not found`);
    }

    const dispatches = await this.repository.findDispatchesByCommunicationId(communicationId);

    return {
      dispatches: dispatches.map((dispatch) => this.toDispatchOutput(dispatch)),
    };
  }

  async getDispatchById(dispatchId: string): Promise<CommunicationDispatchOutput> {
    const dispatch = await this.repository.findDispatchById(dispatchId);
    if (!dispatch) {
      throw createHttpError.NotFound(`Dispatch ${dispatchId} not found`);
    }

    return this.toDispatchOutput(dispatch);
  }

  private async handleRetry(dispatch: CommunicationDispatchEntity): Promise<void> {
    if (dispatch.canIncrementAttempt()) {
      dispatch.incrementAttempt();
      await this.repository.updateDispatch(dispatch);
    } else if (dispatch.needsNewProvider()) {
      const nextProvider = this.getNextProvider(dispatch.provider);
      if (nextProvider) {
        const newDispatch = CommunicationDispatchEntity.createWithNewProvider(dispatch.communicationId, nextProvider);
        await this.repository.createDispatch(newDispatch);
      }
    }
  }

  private getNextProvider(currentProvider: 'smtp' | 'nodemailer' | 'twilio'): 'smtp' | 'nodemailer' | 'twilio' | null {
    const providers: ('smtp' | 'nodemailer' | 'twilio')[] = ['smtp', 'nodemailer', 'twilio'];
    const currentIndex = providers.indexOf(currentProvider);

    if (currentIndex < providers.length - 1) {
      const nextProvider = providers[currentIndex + 1];
      return nextProvider ?? null;
    }

    return null;
  }

  private async sendEmail(dispatch: CommunicationDispatchEntity): Promise<void> {
    if (dispatch.provider === 'smtp') {
      // SMTP
    } else if (dispatch.provider === 'nodemailer') {
      // Nodemailer
    } else if (dispatch.provider === 'twilio') {
      // Twilio
    }
  }
}
