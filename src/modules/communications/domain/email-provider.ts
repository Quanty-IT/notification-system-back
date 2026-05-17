export const EMAIL_PROVIDERS = {
  RESEND: 'resend',
  NODEMAILER: 'nodemailer',
} as const;

export type EmailProviderName = (typeof EMAIL_PROVIDERS)[keyof typeof EMAIL_PROVIDERS];

export type SendEmailInput = {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
};

export interface EmailProvider {
  send(input: SendEmailInput): Promise<void>;
}
