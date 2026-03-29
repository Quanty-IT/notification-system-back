import { Router } from 'express';
import { prisma } from '@/infra/database/prisma.client';
import { registry } from '@/infra/swagger/swagger.registry';
import {
  createTemplateSchema,
  templateIdSchema,
  templateNameSchema,
  updateTemplateSchema,
} from '../application/template.schemas';
import { TemplateService } from '../application/template.service';
import { TemplateController } from './template.controller';
import { TemplateRepositoryPrisma } from './template.repository.prisma';

const BASE_PATH = '/templates';
const TAG = 'Templates';

registry.register('CreateTemplate', createTemplateSchema);
registry.register('UpdateTemplate', updateTemplateSchema);
registry.register('TemplateId', templateIdSchema);
registry.register('TemplateName', templateNameSchema);

registry.registerPath({
  method: 'post',
  path: BASE_PATH,
  tags: [TAG],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createTemplateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Template created',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: BASE_PATH,
  tags: [TAG],
  responses: {
    200: {
      description: 'List templates',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  request: {
    params: templateIdSchema,
  },
  responses: {
    200: {
      description: 'Template found',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/name/{name}`,
  tags: [TAG],
  request: {
    params: templateNameSchema,
  },
  responses: {
    200: {
      description: 'Template found by name',
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  request: {
    params: templateIdSchema,
    body: {
      content: {
        'application/json': {
          schema: updateTemplateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Template updated',
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  request: {
    params: templateIdSchema,
  },
  responses: {
    204: {
      description: 'Template deleted',
    },
  },
});

export const templateRoutes = () => {
  const router = Router();

  const repository = new TemplateRepositoryPrisma(prisma);
  const service = new TemplateService(repository);
  const controller = new TemplateController(service);

  router.post('/', controller.create.bind(controller));
  router.get('/', controller.findAll.bind(controller));
  router.get('/:id', controller.findById.bind(controller));
  router.get('/name/:name', controller.findByName.bind(controller));
  router.patch('/:id', controller.update.bind(controller));
  router.delete('/:id', controller.delete.bind(controller));

  return router;
};
