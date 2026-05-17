import type { CreateEmailOptions } from 'resend';
import { Resend } from 'resend';
import { EmailProvider, SendEmailInput } from '../../domain/email-provider';

const getResendClient = (): Resend => {
  return new Resend(process.env.RESEND_API_KEY);
};

export class ResendEmailProvider implements EmailProvider {
  async send(input: SendEmailInput): Promise<void> {
    const resend = getResendClient();

    const emailPayload: CreateEmailOptions = {
      from: input.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.cc?.length ? { cc: input.cc } : {}),
      ...(input.bcc?.length ? { bcc: input.bcc } : {}),
    };

    const { error } = await resend.emails.send(emailPayload);

    if (error) {
      throw new Error(`Resend email error: ${error.message}`);
    }
  }
}
