import { Router } from 'express';
import { prisma } from '@/infra/database/prisma.client';
import { bearerAuth, registry } from '@/infra/swagger/swagger.registry';
import {
  createTemplateVersionSchema,
  templateVersionIdSchema,
  templateVersionTemplateIdSchema,
  updateTemplateVersionSchema,
} from '../application/template-version.schemas';
import { TemplateVersionService } from '../application/template-version.service';
import { TemplateVersionController } from './template-version.controller';
import { TemplateVersionRepositoryPrisma } from './template-version.repository.prisma';

const BASE_PATH = '/template-versions';
const TAG = 'TemplateVersions';

registry.register('CreateTemplateVersion', createTemplateVersionSchema);
registry.register('UpdateTemplateVersion', updateTemplateVersionSchema);
registry.register('TemplateVersionId', templateVersionIdSchema);
registry.register('TemplateVersionTemplateId', templateVersionTemplateIdSchema);

registry.registerPath({
  method: 'post',
  path: BASE_PATH,
  tags: [TAG],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createTemplateVersionSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Template version created',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/template/{templateId}`,
  tags: [TAG],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: templateVersionTemplateIdSchema,
  },
  responses: {
    200: {
      description: 'List template versions by template',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: templateVersionIdSchema,
  },
  responses: {
    200: {
      description: 'Template version found',
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: templateVersionIdSchema,
    body: {
      content: {
        'application/json': {
          schema: updateTemplateVersionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Template version updated',
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: `${BASE_PATH}/{id}/activate`,
  tags: [TAG],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: templateVersionIdSchema,
  },
  responses: {
    200: {
      description: 'Template version activated',
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: `${BASE_PATH}/{id}/deactivate`,
  tags: [TAG],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: templateVersionIdSchema,
  },
  responses: {
    200: {
      description: 'Template version deactivated',
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: templateVersionIdSchema,
  },
  responses: {
    204: {
      description: 'Template version deleted',
    },
  },
});

export const templateVersionRoutes = () => {
  const router = Router();

  const repository = new TemplateVersionRepositoryPrisma(prisma);
  const service = new TemplateVersionService(repository);
  const controller = new TemplateVersionController(service);

  router.post('/', controller.create.bind(controller));
  router.get('/template/:templateId', controller.findAllByTemplateId.bind(controller));
  router.get('/:id', controller.findById.bind(controller));
  router.patch('/:id', controller.update.bind(controller));
  router.patch('/:id/activate', controller.activate.bind(controller));
  router.patch('/:id/deactivate', controller.deactivate.bind(controller));
  router.delete('/:id', controller.delete.bind(controller));

  return router;
};
