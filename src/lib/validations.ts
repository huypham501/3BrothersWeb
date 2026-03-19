/**
 * Validation Schemas
 * Zod 4 schemas for API route input validation
 */

import { z } from 'zod';

// ─── Get In Touch: Creator ──────────────────────────────────────────
export const getInTouchCreatorSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address.' }),
  channelLink: z.string().min(1, { error: 'Channel link is required.' }),
  content: z.string().min(1, { error: 'Please tell us your concern.' }),
  isCreator: z.literal(1),
});

export type GetInTouchCreatorInput = z.infer<typeof getInTouchCreatorSchema>;

// ─── Get In Touch: Brand / Partner ──────────────────────────────────
export const getInTouchBrandSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address.' }),
  content: z.string().min(1, { error: 'Please tell us your concern.' }),
  isCreator: z.literal(0).optional(),
});

export type GetInTouchBrandInput = z.infer<typeof getInTouchBrandSchema>;

// ─── Newsletter ─────────────────────────────────────────────────────
export const newsletterSchema = z.object({
  fullname: z.string().min(1, { error: 'Full name is required.' }),
  email: z.email({ error: 'Please enter a valid email address.' }),
  occupation: z.string().min(1, { error: 'Occupation is required.' }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
