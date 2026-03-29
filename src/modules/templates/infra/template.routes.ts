import { Router } from 'express';
import { prisma } from '../../../infra/database/prisma.client';
import { TemplateRepositoryPrisma } from './template.repository.prisma';
import { TemplateService } from '../application/template.service';
import { TemplateController } from './template.controller';


export const templateRoutes = () => {
    const router = Router();


    const repository = new TemplateRepositoryPrisma(prisma);
    const service = new TemplateService(repository);
    const controller = new TemplateController(service);


    router.post('/', controller.create.bind(controller));
    router.get('/', controller.findAll.bind(controller));
    router.get('/:id', controller.findById.bind(controller));
    router.patch('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));


    router.patch('/:id/activate', controller.activate.bind(controller));
    router.patch('/:id/deactivate', controller.deactivate.bind(controller));

    return router;
};