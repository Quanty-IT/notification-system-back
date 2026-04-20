import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';

import { prisma } from '@/infra/database/prisma.client';
import { registry } from '@/infra/swagger/swagger.registry';
import { TemplateVersionRepositoryPrisma } from '@/modules/template-versions/infra/template-version.repository.prisma';

import {
  communicationAttachmentIdSchema,
  communicationIdSchema,
  createCommunicationSchema,
  updateCommunicationSchema,
} from '../application/communication.schemas';
import { CommunicationService } from '../application/communication.service';
import { CommunicationController } from './communication.controller';
import { CommunicationRepositoryPrisma } from './communication.repository.prisma';
import { InMemoryFileStorage } from './file-storage.memory';

const TEN_MEGABYTES = 10 * 1024 * 1024;

const BASE_PATH = '/communications';
const TAG = 'Communications';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: TEN_MEGABYTES,
  },
});

const communicationAttachmentResponseSchema = z.object({
  id: z.uuid(),
  communicationId: z.uuid(),
  originalFileName: z.string(),
  storageProvider: z.enum(['s3', 'r2']),
  storageKey: z.string(),
  mimeType: z.string(),
  fileSizeBytes: z.number(),
  createdAt: z.string(),
});

const communicationAttachmentListResponseSchema = z.object({
  attachments: z.array(communicationAttachmentResponseSchema),
});

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
  processingAt: z.string().nullable(),
  sentAt: z.string().nullable(),
  createdByUserId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const communicationWithAttachmentsResponseSchema = communicationResponseSchema.extend({
  attachments: z.array(communicationAttachmentResponseSchema),
});

const communicationListResponseSchema = z.object({
  communications: z.array(communicationResponseSchema),
});

const communicationResponseExample = {
  id: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
  channel: 'email',
  sourceType: 'template',
  status: 'draft',
  subject: null,
  body: null,
  bodyType: null,
  templateVersionId: '4e73dc89-c44e-4f89-bb31-f93eec4c264d',
  templateVariablesJson: {
    name: 'João Silva',
  },
  scheduledAt: null,
  processingAt: null,
  sentAt: null,
  createdByUserId: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: '2026-04-06T14:15:22.000Z',
  updatedAt: '2026-04-06T14:15:22.000Z',
};

const communicationAttachmentResponseExample = {
  id: 'dc2610a8-1702-4722-a5e7-a14ded2b64ba',
  communicationId: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
  originalFileName: 'contrato.pdf',
  storageProvider: 's3',
  storageKey: 'communications/9a4dcf08-1060-4c48-bf13-e2e8498e7fca/8b6244ce-71d6-45cd-8f88-98b5f5f94d4b-contrato.pdf',
  mimeType: 'application/pdf',
  fileSizeBytes: 345678,
  createdAt: '2026-04-06T14:16:10.000Z',
};

const communicationWithAttachmentsResponseExample = {
  ...communicationResponseExample,
  attachments: [
    communicationAttachmentResponseExample,
    {
      id: 'dc2610a8-1702-4722-a5e7-a14ded2b64bb',
      communicationId: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
      originalFileName: 'banner.png',
      storageProvider: 's3',
      storageKey: 'communications/9a4dcf08-1060-4c48-bf13-e2e8498e7fca/f1e2d3c4-b5a6-7890-abcd-ef1234567890-banner.png',
      mimeType: 'image/png',
      fileSizeBytes: 112233,
      createdAt: '2026-04-06T14:16:40.000Z',
    },
  ],
};

const communicationListResponseExample = {
  communications: [
    communicationResponseExample,
    {
      ...communicationResponseExample,
      id: 'dd9258c6-18a8-44b0-8842-6c5a7881f065',
      channel: 'whatsapp',
      sourceType: 'manual',
      subject: null,
      body: 'Seu pedido #123 foi confirmado!',
      bodyType: 'text',
      templateVersionId: null,
      templateVariablesJson: null,
    },
  ],
};

const communicationAttachmentListResponseExample = {
  attachments: [
    communicationAttachmentResponseExample,
    {
      id: 'dc2610a8-1702-4722-a5e7-a14ded2b64bb',
      communicationId: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
      originalFileName: 'banner.png',
      storageProvider: 's3',
      storageKey: 'communications/9a4dcf08-1060-4c48-bf13-e2e8498e7fca/f1e2d3c4-b5a6-7890-abcd-ef1234567890-banner.png',
      mimeType: 'image/png',
      fileSizeBytes: 112233,
      createdAt: '2026-04-06T14:16:40.000Z',
    },
  ],
};

registry.register('CreateCommunication', createCommunicationSchema);
registry.register('UpdateCommunication', updateCommunicationSchema);
registry.register('CommunicationId', communicationIdSchema);
registry.register('CommunicationAttachmentId', communicationAttachmentIdSchema);
registry.register('CommunicationResponse', communicationResponseSchema);
registry.register('CommunicationWithAttachmentsResponse', communicationWithAttachmentsResponseSchema);
registry.register('CommunicationListResponse', communicationListResponseSchema);
registry.register('CommunicationAttachmentResponse', communicationAttachmentResponseSchema);
registry.register('CommunicationAttachmentListResponse', communicationAttachmentListResponseSchema);

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
            templateVersionId: '4e73dc89-c44e-4f89-bb31-f93eec4c264d',
            templateVariablesJson: {
              name: 'João Silva',
            },
            scheduledAt: null,
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
          schema: communicationWithAttachmentsResponseSchema,
          example: communicationWithAttachmentsResponseExample,
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

registry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/{id}/attachments`,
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
        'multipart/form-data': {
          schema: z.object({
            file: z.any(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Attachment created',
      content: {
        'application/json': {
          schema: communicationAttachmentResponseSchema,
          example: communicationAttachmentResponseExample,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/{id}/attachments`,
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
      description: 'List communication attachments',
      content: {
        'application/json': {
          schema: communicationAttachmentListResponseSchema,
          example: communicationAttachmentListResponseExample,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: `${BASE_PATH}/{id}/attachments/{attachmentId}`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    params: communicationAttachmentIdSchema,
  },
  responses: {
    204: {
      description: 'Attachment deleted',
    },
  },
});

export const communicationRoutes = () => {
  const router = Router();

  const repository = new CommunicationRepositoryPrisma(prisma);
  const templateVersionRepository = new TemplateVersionRepositoryPrisma(prisma);
  const fileStorage = new InMemoryFileStorage();

  const service = new CommunicationService(repository, templateVersionRepository, fileStorage);
  const controller = new CommunicationController(service);

  router.post('/', controller.create.bind(controller));
  router.get('/', controller.findAll.bind(controller));
  router.get('/:id', controller.findById.bind(controller));
  router.patch('/:id', controller.update.bind(controller));
  router.delete('/:id', controller.delete.bind(controller));

  router.post('/:id/attachments', upload.single('file'), controller.addAttachment.bind(controller));
  router.get('/:id/attachments', controller.findAttachments.bind(controller));
  router.delete('/:id/attachments/:attachmentId', controller.removeAttachment.bind(controller));

  return router;
};
