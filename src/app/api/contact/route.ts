import { NextResponse } from 'next/server';
import { SCHEMA_KEYS, globalContactPageSchema } from '@/lib/cms';
import { getGlobalSetting } from '@/lib/cms/queries';
import type { CmsGlobalSetting, GlobalContactPagePayload } from '@/lib/cms/types';
import { DEFAULT_CONTACT_PAGE_CONFIG } from '@/lib/contact/contact-page-config';
import {
  checkContactRateLimit,
  createContactSpamGuardSetup,
  isContactHoneypotFilled,
  logContactSpamGuardWarning,
  recordContactHoneypotEvent,
  recordContactRateLimitEvent,
  recordContactSpamAttempt,
} from '@/lib/contact/contact-spam-guard';
import {
  normalizeContactFormValues,
  validateContactBasic,
  validateContactability,
  type ContactFormValues,
} from '@/lib/validations';
import {
  createContactSubmissionLog,
  type ContactErrorCategory,
  type ContactFieldSnapshot,
  type ContactMailStatus,
} from '@/lib/services/contact-submissions.service';
import { MissingContactSmtpConfigError, sendContactMail } from '@/lib/services/contact-mail.service';

export const runtime = 'nodejs';

const GENERIC_UNAVAILABLE_MESSAGE = 'Contact form is currently unavailable.';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const values = normalizeContactFormValues(body);

  const spamGuard = createContactSpamGuardSetup(request);
  if (spamGuard.ok) {
    try {
      await recordContactSpamAttempt(spamGuard.identity);
      const rateLimit = await checkContactRateLimit(spamGuard.identity);

      if (rateLimit.limited) {
        try {
          await recordContactRateLimitEvent(spamGuard.identity, rateLimit.attemptCount);
        } catch (error) {
          logContactSpamGuardWarning(toSafeReason(error));
        }

        return NextResponse.json(
          { ok: false, message: await resolveRateLimitMessage() },
          { status: 429 }
        );
      }

      if (isContactHoneypotFilled(body)) {
        try {
          await recordContactHoneypotEvent(spamGuard.identity);
        } catch (error) {
          logContactSpamGuardWarning(toSafeReason(error));
        }

        return NextResponse.json({ ok: true, message: await resolveHoneypotSuccessMessage() });
      }
    } catch (error) {
      logContactSpamGuardWarning(toSafeReason(error));
    }
  }

  const setting = await getGlobalSetting<GlobalContactPagePayload>(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE);

  const configResolution = resolveContactConfig(setting);
  if (!configResolution.success) {
    await persistContactLog({
      values,
      enabledFieldSnapshot: configResolution.snapshot,
      mailStatus: 'error',
      errorCategory: configResolution.errorCategory,
    });

    return NextResponse.json(
      { ok: false, message: GENERIC_UNAVAILABLE_MESSAGE },
      { status: 503 }
    );
  }

  const config = configResolution.config;
  const snapshot = buildEnabledFieldSnapshot(config);
  const basicValidation = validateContactBasic(values);

  if (!basicValidation.success) {
    await persistContactLog({
      values,
      enabledFieldSnapshot: snapshot,
      mailStatus: 'error',
      errorCategory: 'validation_error',
    });

    return NextResponse.json(
      { ok: false, message: config.error_message, fieldErrors: basicValidation.fieldErrors },
      { status: 400 }
    );
  }

  if (!validateContactability(basicValidation.data)) {
    await persistContactLog({
      values: basicValidation.data,
      enabledFieldSnapshot: snapshot,
      mailStatus: 'error',
      errorCategory: 'non_actionable_submission',
    });

    return NextResponse.json({ ok: true, message: config.success_message });
  }

  try {
    await sendContactMail({ values: basicValidation.data, config });
  } catch (error) {
    if (error instanceof MissingContactSmtpConfigError) {
      await persistContactLog({
        values: basicValidation.data,
        enabledFieldSnapshot: snapshot,
        mailStatus: 'error',
        errorCategory: 'missing_smtp_env',
      });

      return NextResponse.json({ ok: true, message: config.success_message });
    }

    await persistContactLog({
      values: basicValidation.data,
      enabledFieldSnapshot: snapshot,
      mailStatus: 'error',
      errorCategory: 'smtp_send_error',
    });

    return NextResponse.json(
      { ok: false, message: config.error_message },
      { status: 500 }
    );
  }

  await persistContactLog({
    values: basicValidation.data,
    enabledFieldSnapshot: snapshot,
    mailStatus: 'success',
    errorCategory: null,
  });

  return NextResponse.json({ ok: true, message: config.success_message });
}

function resolveContactConfig(setting: CmsGlobalSetting<GlobalContactPagePayload> | null): {
  success: true;
  config: GlobalContactPagePayload;
} | {
  success: false;
  errorCategory: ContactErrorCategory;
  snapshot: ContactFieldSnapshot | null;
} {
  if (!setting?.published_enabled || !setting.published_content) {
    return { success: false, errorCategory: 'missing_config', snapshot: null };
  }

  const publishedContent = withRateLimitMessageDefault(setting.published_content) as Partial<GlobalContactPagePayload>;
  const snapshot = buildPartialEnabledFieldSnapshot(publishedContent);
  const content = publishedContent;

  if (!content.recipient_email) {
    return { success: false, errorCategory: 'missing_recipient', snapshot };
  }

  if (content.fields?.email?.enabled === false && content.fields?.phone?.enabled === false) {
    return { success: false, errorCategory: 'invalid_contact_channel_config', snapshot };
  }

  const parsed = globalContactPageSchema.safeParse(publishedContent);
  if (!parsed.success) {
    return { success: false, errorCategory: 'missing_config', snapshot };
  }

  return { success: true, config: parsed.data };
}

async function resolveRateLimitMessage(): Promise<string> {
  try {
    const setting = await getGlobalSetting<GlobalContactPagePayload>(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE);
    if (!setting?.published_enabled || !setting.published_content) return '';

    const parsed = globalContactPageSchema.safeParse(withRateLimitMessageDefault(setting.published_content));
    return parsed.success ? parsed.data.rate_limit_message : '';
  } catch (error) {
    logContactSpamGuardWarning(toSafeReason(error));
    return '';
  }
}

async function resolveHoneypotSuccessMessage(): Promise<string> {
  try {
    const setting = await getGlobalSetting<GlobalContactPagePayload>(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE);
    if (!setting?.published_enabled || !setting.published_content) {
      return DEFAULT_CONTACT_PAGE_CONFIG.success_message;
    }

    const parsed = globalContactPageSchema.safeParse(withRateLimitMessageDefault(setting.published_content));
    return parsed.success ? parsed.data.success_message : DEFAULT_CONTACT_PAGE_CONFIG.success_message;
  } catch (error) {
    logContactSpamGuardWarning(toSafeReason(error));
    return DEFAULT_CONTACT_PAGE_CONFIG.success_message;
  }
}

function withRateLimitMessageDefault(content: unknown): unknown {
  if (!content || typeof content !== 'object') return content;
  return {
    rate_limit_message: DEFAULT_CONTACT_PAGE_CONFIG.rate_limit_message,
    ...(content as Record<string, unknown>),
  };
}

function buildEnabledFieldSnapshot(config: GlobalContactPagePayload): ContactFieldSnapshot {
  return {
    fullname: pickFieldSnapshot(config.fields.fullname),
    email: pickFieldSnapshot(config.fields.email),
    phone: pickFieldSnapshot(config.fields.phone),
    message: pickFieldSnapshot(config.fields.message),
  };
}

function buildPartialEnabledFieldSnapshot(config: Partial<GlobalContactPagePayload>): ContactFieldSnapshot | null {
  const fields = config.fields;
  if (!fields?.fullname || !fields.email || !fields.phone || !fields.message) {
    return null;
  }

  return {
    fullname: pickFieldSnapshot(fields.fullname),
    email: pickFieldSnapshot(fields.email),
    phone: pickFieldSnapshot(fields.phone),
    message: pickFieldSnapshot(fields.message),
  };
}

function pickFieldSnapshot(field: { enabled?: boolean; required?: boolean }) {
  return {
    enabled: field.enabled === true,
    required: field.required === true,
  };
}

async function persistContactLog(input: {
  values: ContactFormValues;
  enabledFieldSnapshot: ContactFieldSnapshot | null;
  mailStatus: ContactMailStatus;
  errorCategory: ContactErrorCategory | null;
}) {
  try {
    await createContactSubmissionLog(input);
  } catch (error) {
    const reason = error instanceof Error ? error.name : 'UnknownError';
    console.error(`Contact submission protected log failed: ${reason}`);
  }
}

function toSafeReason(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError';
}
