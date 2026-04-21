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
