import { Request, Response } from 'express';
import {
  createTemplateSchema,
  templateIdSchema,
  templateNameSchema,
  updateTemplateSchema,
} from '../application/template.schemas';
import { TemplateService } from '../application/template.service';

export class TemplateController {
  constructor(private readonly service: TemplateService) {}

  public async create(request: Request, response: Response) {
    const input = createTemplateSchema.parse(request.body);

    const output = await this.service.create(input);

    return response.status(201).json(output);
  }

  public async findAll(_request: Request, response: Response) {
    const output = await this.service.findAll();

    return response.status(200).json(output);
  }

  public async findById(request: Request<{ id: string }>, response: Response) {
    const { id } = templateIdSchema.parse(request.params);

    const output = await this.service.findById(id);

    return response.status(200).json(output);
  }

  public async findByName(request: Request<{ name: string }>, response: Response) {
    const { name } = templateNameSchema.parse(request.params);

    const output = await this.service.findByName(name);

    return response.status(200).json(output);
  }

  public async update(request: Request<{ id: string }>, response: Response) {
    const { id } = templateIdSchema.parse(request.params);
    const input = updateTemplateSchema.parse({
      name: request.body.name,
      description: request.body.description,
      isActive: request.body.isActive,
    });

    const output = await this.service.update(id, input);

    return response.status(200).json(output);
  }

  public async delete(request: Request<{ id: string }>, response: Response) {
    const { id } = templateIdSchema.parse(request.params);

    await this.service.delete(id);

    return response.status(204).send();
  }
}
