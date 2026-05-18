export const COMMUNICATION_CHANNELS = {
  EMAIL: 'email',
} as const;

export type CommunicationChannel = (typeof COMMUNICATION_CHANNELS)[keyof typeof COMMUNICATION_CHANNELS];

export const COMMUNICATION_SOURCE_TYPES = {
  MANUAL: 'manual',
  TEMPLATE: 'template',
} as const;

export type CommunicationSourceType = (typeof COMMUNICATION_SOURCE_TYPES)[keyof typeof COMMUNICATION_SOURCE_TYPES];

export const COMMUNICATION_STATUSES = {
  SCHEDULED: 'scheduled',
  PROCESSING: 'processing',
  SENT: 'sent',
  FAILED: 'failed',
  CANCELED: 'canceled',
} as const;

export type CommunicationStatus = (typeof COMMUNICATION_STATUSES)[keyof typeof COMMUNICATION_STATUSES];

export const COMMUNICATION_DISPATCH_STATUSES = {
  PROCESSING: 'processing',
  SENT: 'sent',
  FAILED: 'failed',
} as const;

export type CommunicationDispatchStatus =
  (typeof COMMUNICATION_DISPATCH_STATUSES)[keyof typeof COMMUNICATION_DISPATCH_STATUSES];
