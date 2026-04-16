import { Request, Response } from 'express';
import {
  createCommunicationSchema,
  communicationIdSchema,
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

  public async findAll(request: Request, response: Response) {
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
}