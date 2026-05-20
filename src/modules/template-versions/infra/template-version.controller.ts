import { Request, Response } from 'express';
import { templateIdSchema } from '@/modules/templates/application/template.schemas';
import {
  activeFilterSchema,
  createTemplateVersionSchema,
  templateVersionIdSchema,
  updateTemplateVersionSchema,
} from '../application/template-version.schemas';
import { TemplateVersionService } from '../application/template-version.service';

export class TemplateVersionController {
  constructor(private readonly service: TemplateVersionService) {}

  public async create(request: Request, response: Response) {
    const input = createTemplateVersionSchema.parse(request.body);

    const output = await this.service.create(input);

    return response.status(201).json(output);
  }

  public async findAllByTemplateId(request: Request<{ id: string }>, response: Response) {
    const { id } = templateIdSchema.parse(request.params);
    const query = activeFilterSchema.parse(request.query);

    const output = await this.service.findAllByTemplateId(id, query);

    return response.status(200).json(output);
  }

  public async findById(request: Request<{ id: string }>, response: Response) {
    const { id } = templateVersionIdSchema.parse(request.params);

    const output = await this.service.findById(id);

    return response.status(200).json(output);
  }

  public async update(request: Request<{ id: string }>, response: Response) {
    const { id } = templateVersionIdSchema.parse(request.params);

    const input = updateTemplateVersionSchema.parse({
      subject: request.body.subject,
      body: request.body.body,
      variablesSchemaJson: request.body.variablesSchemaJson,
    });

    const output = await this.service.update(id, input);

    return response.status(200).json(output);
  }

  public async activate(request: Request<{ id: string }>, response: Response) {
    const { id } = templateVersionIdSchema.parse(request.params);

    const output = await this.service.activate(id);

    return response.status(200).json(output);
  }

  public async deactivate(request: Request<{ id: string }>, response: Response) {
    const { id } = templateVersionIdSchema.parse(request.params);

    const output = await this.service.deactivate(id);

    return response.status(200).json(output);
  }

  public async delete(request: Request<{ id: string }>, response: Response) {
    const { id } = templateVersionIdSchema.parse(request.params);

    await this.service.delete(id);

    return response.status(204).send();
  }
}
