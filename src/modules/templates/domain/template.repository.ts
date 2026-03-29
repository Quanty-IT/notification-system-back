import { Template } from '@prisma/client';
import { CreateTemplateDTO, UpdateTemplateDTO } from './template.dto';

export interface ITemplateRepository {
    create(data: CreateTemplateDTO): Promise<Template>;
    findByName(name: string): Promise<Template | null>;
    findById(id: string): Promise<Template | null>;
    listAll(): Promise<Template[]>;
    update(id: string, data: UpdateTemplateDTO): Promise<Template>;
    delete(id: string): Promise<Template>;
}