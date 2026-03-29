import { Request, Response } from 'express';
import { TemplateService } from '../application/template.service';

export class TemplateController {
    constructor(private readonly templateService: TemplateService) { }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const template = await this.templateService.create(req.body);
            return res.status(201).json(template);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        const templates = await this.templateService.listAll();
        return res.status(200).json(templates);
    }


    private getId(req: Request): string {
        const { id } = req.params;
        return String(id);
    }

    async findById(req: Request, res: Response): Promise<Response> {
        try {
            const template = await this.templateService.findById(this.getId(req));
            return res.status(200).json(template);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const template = await this.templateService.update(this.getId(req), req.body);
            return res.status(200).json(template);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            await this.templateService.delete(this.getId(req));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async activate(req: Request, res: Response): Promise<Response> {
        try {
            const template = await this.templateService.activate(this.getId(req));
            return res.status(200).json(template);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deactivate(req: Request, res: Response): Promise<Response> {
        try {
            const template = await this.templateService.deactivate(this.getId(req));
            return res.status(200).json(template);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}