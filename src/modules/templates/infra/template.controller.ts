import { Request, Response } from 'express';
import { TemplateService } from '../application/template.service';
import { TemplateRepositoryPrisma } from './template.repository.prisma';

// Instancia as dependências (seguindo o fluxo que você definiu)
const repository = new TemplateRepositoryPrisma();
const service = new TemplateService(repository);

export class TemplateController {

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const result = await service.create(req.body);
            return res.status(201).json(result);
        } catch (error: any) {
            // Se o erro for o de "nome já existe", retorna 400 (Bad Request)
            return res.status(400).json({ message: error.message });
        }
    }

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const result = await service.listAll();
            return res.json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async show(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await service.findById(id);
            return res.json(result);
        } catch (error: any) {
            // Se não encontrar, o service joga o erro e aqui retorna 404
            return res.status(404).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await service.update(id, req.body);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await service.delete(id);
            return res.status(204).send(); // 204 No Content é o padrão para delete bem-sucedido
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}