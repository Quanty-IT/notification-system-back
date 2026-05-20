import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/infra/database/prisma.client';
import { registry } from '@/infra/swagger/swagger.registry';
import { TemplateRepositoryPrisma } from '@/modules/templates/infra/template.repository.prisma';
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

const templateVersionResponseSchema = z.object({
  id: z.uuid(),
  templateId: z.uuid(),
  version: z.number().int(),
  subject: z.string(),
  body: z.string(),
  variablesSchemaJson: z.record(z.string(), z.unknown()).nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const templateVersionListResponseSchema = z.object({
  templateVersions: z.array(templateVersionResponseSchema),
});

const templateVersionResponseExample = {
  id: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
  templateId: '4e73dc89-c44e-4f89-bb31-f93eec4c264d',
  version: 2,
  subject: 'Confirme seu cadastro',
  body: '<p>Ola {{name}}, confirme seu cadastro no link abaixo.</p>',
  variablesSchemaJson: {
    name: 'string',
  },
  isActive: true,
  createdAt: '2026-04-06T14:15:22.000Z',
  updatedAt: '2026-04-06T14:15:22.000Z',
};

registry.register('CreateTemplateVersion', createTemplateVersionSchema);
registry.register('UpdateTemplateVersion', updateTemplateVersionSchema);
registry.register('TemplateVersionId', templateVersionIdSchema);
registry.register('TemplateVersionTemplateId', templateVersionTemplateIdSchema);
registry.register('TemplateVersionResponse', templateVersionResponseSchema);
registry.register('TemplateVersionListResponse', templateVersionListResponseSchema);

registry.registerPath({
  method: 'post',
  path: BASE_PATH,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createTemplateVersionSchema,
          example: {
            templateId: '4e73dc89-c44e-4f89-bb31-f93eec4c264d',
            subject: 'Confirme seu cadastro',
            body: '<p>Ola {{name}}, confirme seu cadastro no link abaixo.</p>',
            variablesSchemaJson: {
              name: 'string',
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Template version created',
      content: {
        'application/json': {
          schema: templateVersionResponseSchema,
          example: templateVersionResponseExample,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    params: templateVersionIdSchema,
  },
  responses: {
    200: {
      description: 'Template version found',
      content: {
        'application/json': {
          schema: templateVersionResponseSchema,
          example: templateVersionResponseExample,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    params: templateVersionIdSchema,
    body: {
      content: {
        'application/json': {
          schema: updateTemplateVersionSchema,
          example: {
            subject: 'Confirme seu cadastro agora',
            body: '<p>Ola {{name}}, confirme seu cadastro no botao abaixo.</p>',
            variablesSchemaJson: {
              name: 'string',
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Template version updated',
      content: {
        'application/json': {
          schema: templateVersionResponseSchema,
          example: templateVersionResponseExample,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: `${BASE_PATH}/{id}/activate`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    params: templateVersionIdSchema,
  },
  responses: {
    200: {
      description: 'Template version activated',
      content: {
        'application/json': {
          schema: templateVersionResponseSchema,
          example: {
            ...templateVersionResponseExample,
            isActive: true,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: `${BASE_PATH}/{id}/deactivate`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    params: templateVersionIdSchema,
  },
  responses: {
    200: {
      description: 'Template version deactivated',
      content: {
        'application/json': {
          schema: templateVersionResponseSchema,
          example: {
            ...templateVersionResponseExample,
            isActive: false,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
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
  const templateRepository = new TemplateRepositoryPrisma(prisma);
  const service = new TemplateVersionService(repository, templateRepository);
  const controller = new TemplateVersionController(service);

  router.post('/', controller.create.bind(controller));
  router.get('/:id', controller.findById.bind(controller));
  router.patch('/:id', controller.update.bind(controller));
  router.patch('/:id/activate', controller.activate.bind(controller));
  router.patch('/:id/deactivate', controller.deactivate.bind(controller));
  router.delete('/:id', controller.delete.bind(controller));

  return router;
};
