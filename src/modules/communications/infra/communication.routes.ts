import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';

import { prisma } from '@/infra/database/prisma.client';
import { registry } from '@/infra/swagger/swagger.registry';
import { TemplateVersionRepositoryPrisma } from '@/modules/template-versions/infra/template-version.repository.prisma';

import {
  communicationAttachmentIdSchema,
  communicationDispatchIdSchema,
  communicationIdSchema,
  communicationRecipientIdSchema,
  createCommunicationSchema,
  createRecipientSchema,
  updateCommunicationSchema,
} from '../application/communication.schemas';
import { CommunicationService } from '../application/communication.service';
import {
  COMMUNICATION_CHANNELS,
  COMMUNICATION_DISPATCH_STATUSES,
  COMMUNICATION_SOURCE_TYPES,
  COMMUNICATION_STATUSES,
} from '../domain/communication.constants';
import { EMAIL_PROVIDERS } from '../domain/email-provider';
import { CommunicationController } from './communication.controller';
import { CommunicationRepositoryPrisma } from './communication.repository.prisma';
import { R2FileStorage } from './file-storage.r2';

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
  storageProvider: z.enum(['r2']),
  storageKey: z.string(),
  mimeType: z.string(),
  fileSizeBytes: z.number(),
  createdAt: z.string(),
});

const communicationRecipientResponseSchema = z.object({
  id: z.uuid(),
  communicationId: z.uuid(),
  recipientType: z.enum(['to', 'cc', 'bcc']),
  email: z.string(),
  createdAt: z.string(),
});

const communicationRecipientListResponseSchema = z.object({
  recipients: z.array(communicationRecipientResponseSchema),
});

const communicationAttachmentListResponseSchema = z.object({
  attachments: z.array(communicationAttachmentResponseSchema),
});

const communicationDispatchResponseSchema = z.object({
  id: z.uuid(),
  communicationId: z.uuid(),
  attemptNumber: z.number(),
  provider: z.enum(EMAIL_PROVIDERS),
  status: z.enum(COMMUNICATION_DISPATCH_STATUSES),
  startedAt: z.string(),
  finishedAt: z.string().nullable(),
});

const communicationDispatchListResponseSchema = z.object({
  dispatches: z.array(communicationDispatchResponseSchema),
});

const communicationResponseSchema = z.object({
  id: z.uuid(),
  channel: z.enum(COMMUNICATION_CHANNELS),
  sourceType: z.enum(COMMUNICATION_SOURCE_TYPES),
  status: z.enum(COMMUNICATION_STATUSES),
  subject: z.string().nullable(),
  body: z.string().nullable(),
  templateVersionId: z.string().nullable(),
  templateVariablesJson: z.record(z.string(), z.unknown()).nullable(),
  scheduledAt: z.string().nullable(),
  processingAt: z.string().nullable(),
  sentAt: z.string().nullable(),
  createdByUserId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  recipients: z.array(communicationRecipientResponseSchema),
});

const communicationWithAttachmentsResponseSchema = communicationResponseSchema.extend({
  attachments: z.array(communicationAttachmentResponseSchema),
});

const communicationListResponseSchema = z.object({
  communications: z.array(communicationResponseSchema),
});

const communicationResponseExample = {
  id: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
  channel: COMMUNICATION_CHANNELS.EMAIL,
  sourceType: COMMUNICATION_SOURCE_TYPES.TEMPLATE,
  status: COMMUNICATION_STATUSES.SCHEDULED,
  subject: null,
  body: null,
  templateVersionId: '4e73dc89-c44e-4f89-bb31-f93eec4c264d',
  templateVariablesJson: {
    name: 'João Silva',
  },
  scheduledAt: '2026-05-16T14:15:22.000Z',
  processingAt: '2026-05-16T14:15:22.000Z',
  sentAt: null,
  createdByUserId: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: '2026-04-06T14:15:22.000Z',
  updatedAt: '2026-04-06T14:15:22.000Z',
};

const communicationAttachmentResponseExample = {
  id: 'dc2610a8-1702-4722-a5e7-a14ded2b64ba',
  communicationId: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
  originalFileName: 'contrato.pdf',
  storageProvider: 'r2',
  storageKey: 'communications/9a4dcf08-1060-4c48-bf13-e2e8498e7fca/8b6244ce-71d6-45cd-8f88-98b5f5f94d4b',
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
      storageProvider: 'r2',
      storageKey: 'communications/9a4dcf08-1060-4c48-bf13-e2e8498e7fca/f1e2d3c4-b5a6-7890-abcd-ef1234567890',
      mimeType: 'image/png',
      fileSizeBytes: 112233,
      createdAt: '2026-04-06T14:16:40.000Z',
    },
  ],
};

const communicationListResponseExample = {
  communications: [communicationResponseExample],
};

const communicationAttachmentListResponseExample = {
  attachments: [
    communicationAttachmentResponseExample,
    {
      id: 'dc2610a8-1702-4722-a5e7-a14ded2b64bb',
      communicationId: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
      originalFileName: 'banner.png',
      storageProvider: 'r2',
      storageKey: 'communications/9a4dcf08-1060-4c48-bf13-e2e8498e7fca/f1e2d3c4-b5a6-7890-abcd-ef1234567890',
      mimeType: 'image/png',
      fileSizeBytes: 112233,
      createdAt: '2026-04-06T14:16:40.000Z',
    },
  ],
};

const communicationDispatchResponseExample = {
  id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  communicationId: '9a4dcf08-1060-4c48-bf13-e2e8498e7fca',
  attemptNumber: 1,
  provider: EMAIL_PROVIDERS.RESEND,
  status: COMMUNICATION_DISPATCH_STATUSES.PROCESSING,
  startedAt: '2026-04-28T15:30:00.000Z',
  finishedAt: null,
};

const communicationDispatchListResponseExample = {
  dispatches: [
    communicationDispatchResponseExample,
    {
      ...communicationDispatchResponseExample,
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      attemptNumber: 2,
      provider: EMAIL_PROVIDERS.NODEMAILER,
      status: COMMUNICATION_DISPATCH_STATUSES.FAILED,
      finishedAt: '2026-04-28T15:32:15.000Z',
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
registry.register('CreateRecipient', createRecipientSchema);
registry.register('CommunicationRecipientId', communicationRecipientIdSchema);
registry.register('CommunicationRecipientResponse', communicationRecipientResponseSchema);
registry.register('CommunicationRecipientListResponse', communicationRecipientListResponseSchema);
registry.register('CommunicationDispatchId', communicationDispatchIdSchema);
registry.register('CommunicationDispatchResponse', communicationDispatchResponseSchema);
registry.register('CommunicationDispatchListResponse', communicationDispatchListResponseSchema);

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
            channel: COMMUNICATION_CHANNELS.EMAIL,
            sourceType: COMMUNICATION_SOURCE_TYPES.TEMPLATE,
            templateVersionId: '4e73dc89-c44e-4f89-bb31-f93eec4c264d',
            templateVariablesJson: {
              name: 'João Silva',
            },
            scheduledAt: '2026-05-16T14:15:22.000Z',
            recipients: [
              {
                recipientType: 'to',
                email: 'joao@exemplo.com',
              },
            ],
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

registry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/{id}/recipients`,
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
          schema: createRecipientSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Recipient added successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CommunicationRecipientResponse' },
        },
      },
    },
    400: {
      description: 'Bad request',
    },
    404: {
      description: 'Communication not found',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/{id}/recipients`,
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
      description: 'Recipients retrieved successfully',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CommunicationRecipientListResponse' },
        },
      },
    },
    404: {
      description: 'Communication not found',
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: `${BASE_PATH}/{id}/recipients/{recipientId}`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    params: communicationRecipientIdSchema,
  },
  responses: {
    204: {
      description: 'Recipient deleted successfully',
    },
    400: {
      description: 'Bad request',
    },
    404: {
      description: 'Communication or recipient not found',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/{id}/dispatches`,
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
    201: {
      description: 'Dispatch created successfully',
    },
    404: {
      description: 'Communication not found',
    },
    400: {
      description: 'Bad request',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/{id}/dispatches`,
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
      description: 'Dispatches retrieved successfully',
      content: {
        'application/json': {
          schema: communicationDispatchListResponseSchema,
          example: communicationDispatchListResponseExample,
        },
      },
    },
    404: {
      description: 'Communication not found',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/{id}/dispatches/{dispatchId}`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    params: communicationDispatchIdSchema,
  },
  responses: {
    200: {
      description: 'Dispatch retrieved successfully',
      content: {
        'application/json': {
          schema: communicationDispatchResponseSchema,
          example: communicationDispatchResponseExample,
        },
      },
    },
    404: {
      description: 'Dispatch not found',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/{id}/dispatches/{dispatchId}/process`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  request: {
    params: communicationDispatchIdSchema,
  },
  responses: {
    204: {
      description: 'Dispatch processed successfully',
    },
    404: {
      description: 'Dispatch not found',
    },
    400: {
      description: 'Bad request',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: `${BASE_PATH}/dispatches/pending`,
  tags: [TAG],
  security: [
    {
      bearerAuth: [],
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: 'Pending dispatches retrieved successfully',
      content: {
        'application/json': {
          schema: communicationDispatchListResponseSchema,
          example: communicationDispatchListResponseExample,
        },
      },
    },
  },
});

export const communicationRoutes = () => {
  const router = Router();

  const repository = new CommunicationRepositoryPrisma(prisma);
  const templateVersionRepository = new TemplateVersionRepositoryPrisma(prisma);
  const fileStorage = new R2FileStorage();

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

  router.post('/:id/recipients', controller.addRecipient.bind(controller));
  router.get('/:id/recipients', controller.findRecipients.bind(controller));
  router.delete('/:id/recipients/:recipientId', controller.removeRecipient.bind(controller));

  router.post('/:id/dispatches', controller.createInitialDispatch.bind(controller));
  router.get('/:id/dispatches', controller.findDispatches.bind(controller));
  router.get('/:id/dispatches/:dispatchId', controller.findDispatchById.bind(controller));

  return router;
};
