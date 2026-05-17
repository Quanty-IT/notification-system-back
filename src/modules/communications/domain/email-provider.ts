export const EMAIL_PROVIDERS = {
  RESEND: 'resend',
  MAILTRAP: 'mailtrap',
} as const;

export type EmailProviderName = (typeof EMAIL_PROVIDERS)[keyof typeof EMAIL_PROVIDERS];
export const EMAIL_PROVIDER_FALLBACK_ORDER: EmailProviderName[] = Object.values(EMAIL_PROVIDERS);

export type SendEmailAttachment = {
  filename: string;
  content: string;
  contentType?: string;
};

export type SendEmailInput = {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  attachments?: SendEmailAttachment[];
};

export interface EmailProvider {
  send(input: SendEmailInput): Promise<void>;
}
