import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@/infra/database/prisma.client';
import { registry } from '@/infra/swagger/swagger.registry';
import { TemplateVersionRepositoryPrisma } from '@/modules/template-versions/infra/template-version.repository.prisma';
import { UserRepositoryPrisma } from '@/modules/users/infra/user.repository.prisma';
import {
  communicationIdSchema,
  createCommunicationSchema,
  updateCommunicationSchema,
} from '../application/communication.schemas';
import { CommunicationService } from '../application/communication.service';
import { CommunicationController } from './communication.controller';
import { CommunicationRepositoryPrisma } from './communication.repository.primsa';

const BASE_PATH = '/communications';
const TAG = 'Communications';

const communicationResponseSchema = z.object({
  id: z.uuid(),
  channel: z.enum(['email', 'whatsapp', 'sms', 'teams']),
  sourceType: z.enum(['manual', 'template']),
  status: z.enum(['draft', 'scheduled', 'processing', 'sent', 'failed', 'canceled']),
  subject: z.string().nullable(),
  body: z.string().nullable(),
  bodyType: z.enum(['text', 'html']).nullable(),
  templateVersionId: z.string().nullable(),
  templateVariablesJson: z.record(z.string(), z.unknown()).nullable(),
  scheduledAt: z.string().nullable(),
  processingAt: z.string(),
  sentAt: z.string(),
  createdByUserId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const communicationListResponseSchema = z.object({
  communications: z.array(communicationResponseSchema),
});

const communicationResponseExample = {
  id: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
  channel: 'email',
  sourceType: 'template',
  status: 'draft',
  subject: 'Bem-vindo ao sistema',
  body: '<p>Olá {{name}}, seja bem-vindo!</p>',
  bodyType: 'html',
  templateVersionId: '4e73dc89-c44e-4f89-bb31-f93eec4c264d',
  templateVariablesJson: {
    name: 'João Silva',
  },
  scheduledAt: null,
  queuedAt: null,
  processingAt: null,
  sentAt: null,
  createdByUserId: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: '2026-04-06T14:15:22.000Z',
  updatedAt: '2026-04-06T14:15:22.000Z',
};

const communicationListResponseExample = {
  communications: [
    communicationResponseExample,
    {
      ...communicationResponseExample,
      id: 'dd9258c6-18a8-44b0-8842-6c5a7881f065',
      channel: 'whatsapp',
      subject: 'Confirmação de pedido',
      body: 'Seu pedido #{{orderId}} foi confirmado!',
      bodyType: 'text',
      sourceType: 'manual',
      templateVersionId: null,
      templateVariablesJson: null,
    },
  ],
};

// Registry dos schemas
registry.register('CreateCommunication', createCommunicationSchema);
registry.register('UpdateCommunication', updateCommunicationSchema);
registry.register('CommunicationId', communicationIdSchema);
registry.register('CommunicationResponse', communicationResponseSchema);
registry.register('CommunicationListResponse', communicationListResponseSchema);

// Registry dos paths para Swagger
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
          schema: createCommunicationSchema,
          example: {
            channel: 'email',
            sourceType: 'template',
            subject: 'Bem-vindo ao sistema',
            body: '<p>Olá {{name}}, seja bem-vindo!</p>',
            bodyType: 'html',
            templateVersionId: '4e73dc89-c44e-4f89-bb31-f93eec4c264d',
            templateVariablesJson: {
              name: 'João Silva',
            },
            scheduledAt: null,
            processingAt: null,
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Communication created',
      content: {
        'application/json': {
          schema: communicationResponseSchema,
          example: communicationResponseExample,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: BASE_PATH,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: 'List communications',
      content: {
        'application/json': {
          schema: communicationListResponseSchema,
          example: communicationListResponseExample,
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
    params: communicationIdSchema,
  },
  responses: {
    200: {
      description: 'Communication found',
      content: {
        'application/json': {
          schema: communicationResponseSchema,
          example: communicationResponseExample,
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
    params: communicationIdSchema,
    body: {
      content: {
        'application/json': {
          schema: updateCommunicationSchema,
          example: {
            subject: 'Assunto atualizado',
            body: '<p>Conteúdo atualizado</p>',
            bodyType: 'html',
            templateVariablesJson: {
              name: 'Maria Silva',
            },
            scheduledAt: '2026-04-10T15:00:00.000Z',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Communication updated',
      content: {
        'application/json': {
          schema: communicationResponseSchema,
          example: communicationResponseExample,
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
    params: communicationIdSchema,
  },
  responses: {
    204: {
      description: 'Communication deleted',
    },
  },
});

export const communicationRoutes = () => {
  const router = Router();

  const repository = new CommunicationRepositoryPrisma(prisma);
  const templateVersionRepository = new TemplateVersionRepositoryPrisma(prisma);
  const userRepository = new UserRepositoryPrisma(prisma);
  const service = new CommunicationService(repository, templateVersionRepository, userRepository);
  const controller = new CommunicationController(service);

  router.post('/', controller.create.bind(controller));
  router.get('/', controller.findAll.bind(controller));
  router.get('/:id', controller.findById.bind(controller));
  router.patch('/:id', controller.update.bind(controller));
  router.delete('/:id', controller.delete.bind(controller));

  return router;
};
