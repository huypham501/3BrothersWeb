import nodemailer from 'nodemailer';
import type { GlobalContactPagePayload } from '@/lib/cms/types';
import type { ContactFormValues } from '@/lib/validations';

export class MissingContactSmtpConfigError extends Error {
  constructor() {
    super('Missing contact SMTP configuration.');
    this.name = 'MissingContactSmtpConfigError';
  }
}

interface SendContactMailInput {
  values: ContactFormValues;
  config: GlobalContactPagePayload;
}

export async function sendContactMail({ values, config }: SendContactMailInput): Promise<void> {
  const smtp = getContactSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  await transporter.sendMail({
    from: smtp.from,
    to: config.recipient_email,
    replyTo: values.email || undefined,
    subject: buildSubject(config.email_subject_prefix, values),
    text: buildTextBody(values),
    html: buildHtmlBody(values),
  });
}

function getContactSmtpConfig() {
  const host = process.env.CONTACT_SMTP_HOST;
  const port = Number(process.env.CONTACT_SMTP_PORT);
  const secure = process.env.CONTACT_SMTP_SECURE;
  const user = process.env.CONTACT_SMTP_USER;
  const pass = process.env.CONTACT_SMTP_PASS;
  const from = process.env.CONTACT_MAIL_FROM;

  if (!host || !Number.isInteger(port) || !secure || !user || !pass || !from) {
    throw new MissingContactSmtpConfigError();
  }

  return {
    host,
    port,
    secure: secure === 'true',
    user,
    pass,
    from,
  };
}

function buildSubject(prefix: string, values: ContactFormValues): string {
  const identity = values.fullname || values.email || values.phone || 'New contact submission';
  return `${prefix} ${identity}`;
}

function buildTextBody(values: ContactFormValues): string {
  return [
    `Full name: ${values.fullname || 'N/A'}`,
    `Email: ${values.email || 'N/A'}`,
    `Phone: ${values.phone || 'N/A'}`,
    '',
    'Message:',
    values.message || 'N/A',
  ].join('\n');
}

function buildHtmlBody(values: ContactFormValues): string {
  return `
    <table cellpadding="6" cellspacing="0" border="0">
      <tr><th align="left">Full name</th><td>${escapeHtml(values.fullname || 'N/A')}</td></tr>
      <tr><th align="left">Email</th><td>${escapeHtml(values.email || 'N/A')}</td></tr>
      <tr><th align="left">Phone</th><td>${escapeHtml(values.phone || 'N/A')}</td></tr>
      <tr><th align="left" valign="top">Message</th><td>${escapeHtml(values.message || 'N/A').replaceAll('\n', '<br />')}</td></tr>
    </table>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
