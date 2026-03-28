import { Template } from '@prisma/client';

export interface ITemplateRepository {
    create(data: CreateTemplateDTO): Promise<Template>;
    findByName(name: string): Promise<Template | null>;
    findById(id: string): Promise<Template | null>;
    listAll(): Promise<Template[]>;
    update(id: string, data: UpdateTemplateDTO): Promise<Template | null>;
    delete(id: string): Promise<Template | null>;
}

export type CreateTemplateDTO = {
    name: string;
    description?: string;
};

export type UpdateTemplateDTO = {
    name?: string;
    description?: string;
    is_active?: boolean;
};