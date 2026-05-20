import { Request, Response } from 'express';
import {
  communicationAttachmentIdSchema,
  communicationDispatchIdSchema,
  communicationIdSchema,
  communicationRecipientIdSchema,
  createCommunicationSchema,
  createRecipientSchema,
  updateCommunicationSchema,
} from '../application/communication.schemas';
import { CommunicationService } from '../application/communication.service';

export class CommunicationController {
  constructor(private readonly service: CommunicationService) {}

  public async create(request: Request, response: Response) {
    const input = createCommunicationSchema.parse(request.body);

    if (!request.user?.id) {
      throw new Error('User not authenticated');
    }

    const output = await this.service.create(input, request.user.id);

    return response.status(201).json(output);
  }

  public async findAll(_request: Request, response: Response) {
    const output = await this.service.findAll();

    return response.status(200).json(output);
  }

  public async findById(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    const output = await this.service.findById(id);

    return response.status(200).json(output);
  }

  public async update(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);
    const input = updateCommunicationSchema.parse(request.body);

    const output = await this.service.update(id, input);

    return response.status(200).json(output);
  }

  public async delete(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    await this.service.delete(id);

    return response.status(204).send();
  }

  public async sendNow(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    await this.service.sendNow(id);

    return response.status(204).send();
  }

  public async addAttachment(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    const file = request.file;

    if (!file) {
      throw new Error('File is required');
    }

    const output = await this.service.addAttachment(id, {
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      content: file.buffer,
    });

    return response.status(201).json(output);
  }

  public async findAttachments(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    const output = await this.service.findAttachmentsByCommunicationId(id);

    return response.status(200).json(output);
  }

  public async removeAttachment(request: Request<{ id: string; attachmentId: string }>, response: Response) {
    const { id, attachmentId } = communicationAttachmentIdSchema.parse(request.params);

    await this.service.removeAttachment(id, attachmentId);

    return response.status(204).send();
  }

  public async addRecipient(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    const input = createRecipientSchema.parse(request.body);
    const output = await this.service.addRecipient(id, input);

    return response.status(201).json(output);
  }

  public async findRecipients(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    const output = await this.service.findRecipientsByCommunicationId(id);

    return response.status(200).json(output);
  }

  public async removeRecipient(request: Request<{ id: string; recipientId: string }>, response: Response) {
    const { id, recipientId } = communicationRecipientIdSchema.parse(request.params);

    await this.service.removeRecipient(id, recipientId);

    return response.status(204).send();
  }

  public async createInitialDispatch(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    await this.service.createInitialDispatch(id);

    return response.status(201).send();
  }

  public async findDispatches(request: Request<{ id: string }>, response: Response) {
    const { id } = communicationIdSchema.parse(request.params);

    const output = await this.service.getDispatchesByCommunicationId(id);

    return response.status(200).json(output);
  }

  public async findDispatchById(request: Request<{ id: string; dispatchId: string }>, response: Response) {
    const { dispatchId } = communicationDispatchIdSchema.parse(request.params);

    const output = await this.service.getDispatchById(dispatchId);

    return response.status(200).json(output);
  }

  public async processCommunication(request: Request<{ id: string; dispatchId: string }>, response: Response) {
    const { dispatchId } = communicationDispatchIdSchema.parse(request.params);

    await this.service.processCommunication(dispatchId);

    return response.status(204).send();
  }

  public async findPendingCommunications(_request: Request, response: Response) {
    const output = await this.service.getPendingCommunications();

    return response.status(200).json(output);
  }
}
