import nodemailer from 'nodemailer';
import { EmailProvider, SendEmailInput } from '../../domain/email-provider';

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    secure: process.env.MAILTRAP_SECURE === 'true',
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
};

export class MailtrapEmailProvider implements EmailProvider {
  async send(input: SendEmailInput): Promise<void> {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: input.from,
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      html: input.html,
      attachments: input.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        encoding: 'base64',
        contentType: attachment.contentType,
      })),
    });
  }
}
