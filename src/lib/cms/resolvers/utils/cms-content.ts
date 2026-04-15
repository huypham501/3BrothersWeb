import type {
  CmsGlobalSchemaKey,
  CmsGlobalSetting,
  CmsSchemaPayloadMap,
  CmsSectionSchemaKey,
  CmsPageSection,
  CmsSharedSchemaKey,
  CmsSharedSection,
} from '../../types';
import { CMS_REGISTRY } from '../../schemas';

type CmsContentRecord<T> = {
  enabled: boolean;
  content: T;
  published_enabled?: boolean | null;
  published_content?: T | null;
};

function formatValidationIssues(issues: Array<{ path: PropertyKey[]; message: string }>) {
  return issues
    .map((issue) => {
      const normalizedPath = issue.path
        .map((segment) => (typeof segment === 'symbol' ? String(segment) : String(segment)))
        .join('.');
      return `${normalizedPath || '(root)'}: ${issue.message}`;
    })
    .join('; ');
}

export function validateCmsPayloadBySchemaKey<K extends keyof CmsSchemaPayloadMap>(
  schemaKey: K,
  payload: unknown,
  sourceLabel: string
): CmsSchemaPayloadMap[K] | null {
  const schema = CMS_REGISTRY[schemaKey];
  if (!schema) {
    console.warn(`[cms:read-validation] Missing schema for key=${schemaKey} source=${sourceLabel}`);
    return null;
  }

  const result = schema.safeParse(payload);
  if (!result.success) {
    const details = formatValidationIssues(result.error.issues);
    console.warn(
      `[cms:read-validation] Invalid payload key=${schemaKey} source=${sourceLabel}; ${details}`
    );
    return null;
  }

  return result.data as CmsSchemaPayloadMap[K];
}

export function resolveCmsContent<T>(
  record: CmsContentRecord<T> | null | undefined
): T | null {
  if (!record) return null;

  if (record.published_enabled === true) {
    return (record.published_content ?? record.content ?? null) as T | null;
  }

  // Plan rule: when publish flag is false or null, fallback to draft content if enabled.
  return record.enabled ? ((record.content ?? null) as T | null) : null;
}

export function findSectionRecordBySchemaKey<K extends CmsSectionSchemaKey>(
  sections: CmsPageSection[],
  schemaKey: K
): CmsPageSection<CmsSchemaPayloadMap[K]> | null {
  const section = sections.find((item) => item.schema_key === schemaKey);
  return (section ?? null) as CmsPageSection<CmsSchemaPayloadMap[K]> | null;
}

export function findSectionContentBySchemaKey<K extends CmsSectionSchemaKey>(
  sections: CmsPageSection[],
  schemaKey: K
): CmsSchemaPayloadMap[K] | null {
  return resolveCmsContent<CmsSchemaPayloadMap[K]>(
    findSectionRecordBySchemaKey<K>(sections, schemaKey)
  );
}

export function resolveSharedContentBySchemaKey<K extends CmsSharedSchemaKey>(
  record: CmsSharedSection | null | undefined
): CmsSchemaPayloadMap[K] | null {
  return resolveCmsContent<CmsSchemaPayloadMap[K]>(
    record as CmsSharedSection<CmsSchemaPayloadMap[K]> | null | undefined
  );
}

export function resolveGlobalContentBySchemaKey<K extends CmsGlobalSchemaKey>(
  record: CmsGlobalSetting | null | undefined
): CmsSchemaPayloadMap[K] | null {
  return resolveCmsContent<CmsSchemaPayloadMap[K]>(
    record as CmsGlobalSetting<CmsSchemaPayloadMap[K]> | null | undefined
  );
}
