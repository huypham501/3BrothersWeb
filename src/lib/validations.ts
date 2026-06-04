/**
 * Validation Schemas
 * Zod 4 schemas for API route input validation
 */

import { z } from 'zod';

// ─── Newsletter ─────────────────────────────────────────────────────
export const newsletterSchema = z.object({
  fullname: z.string().min(1, { error: 'Full name is required.' }),
  email: z.email({ error: 'Please enter a valid email address.' }),
  occupation: z.string().min(1, { error: 'Occupation is required.' }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

// ─── Contact Form ───────────────────────────────────────────────────

export const CONTACT_FIELD_LIMITS = {
  fullname: 120,
  email: 254,
  phone: 40,
  message: 2000,
} as const;

export const CONTACTABILITY_ERROR_MESSAGE = 'Vui lòng nhập email hoặc số điện thoại.';

export type ContactFormValues = {
  fullname: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFormValues | 'contactChannel', string>>;

export const contactFormSchema = z.object({
  fullname: z.string().max(CONTACT_FIELD_LIMITS.fullname, { error: 'Full name is too long.' }),
  email: z
    .string()
    .max(CONTACT_FIELD_LIMITS.email, { error: 'Email is too long.' })
    .refine((value) => value === '' || z.email().safeParse(value).success, {
      error: 'Please enter a valid email address.',
    }),
  phone: z.string().max(CONTACT_FIELD_LIMITS.phone, { error: 'Phone is too long.' }),
  message: z.string().max(CONTACT_FIELD_LIMITS.message, { error: 'Message is too long.' }),
});

export function normalizeContactFormValues(input: unknown): ContactFormValues {
  const record = typeof input === 'object' && input !== null ? input as Record<string, unknown> : {};

  return {
    fullname: toTrimmedString(record.fullname),
    email: toTrimmedString(record.email),
    phone: toTrimmedString(record.phone),
    message: toTrimmedString(record.message),
  };
}

export function validateContactBasic(values: ContactFormValues): {
  success: true;
  data: ContactFormValues;
} | {
  success: false;
  fieldErrors: ContactFieldErrors;
} {
  const parsed = contactFormSchema.safeParse(values);

  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const fieldErrors: ContactFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && key in values && !fieldErrors[key as keyof ContactFormValues]) {
      fieldErrors[key as keyof ContactFormValues] = issue.message;
    }
  }

  return { success: false, fieldErrors };
}

export function validateContactability(values: Pick<ContactFormValues, 'email' | 'phone'>): boolean {
  return values.email.trim().length > 0 || values.phone.trim().length > 0;
}

function toTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}
