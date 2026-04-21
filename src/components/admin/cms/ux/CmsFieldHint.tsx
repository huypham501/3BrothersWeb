'use client';

import * as React from 'react';
import { FormDescription } from '@/components/admin/controls/AdminForm';
import { getCmsFieldUxSpec, type CmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';

type CmsFieldHintProps = {
  formId?: string;
  fieldPath?: string;
  what?: string;
  why?: string;
  format?: string;
  validation?: string;
  impact?: string;
  example?: React.ReactNode;
};

function Segment({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <span>
      <strong>{label}:</strong> {value}
    </span>
  );
}

export function CmsFieldHint({
  formId,
  fieldPath,
  what,
  why,
  format,
  validation,
  impact,
  example,
}: CmsFieldHintProps) {
  const resolvedSpec: CmsFieldUxSpec =
    what || why || format || validation || impact || example
      ? {
          what,
          why,
          format,
          validation,
          impact,
          example: typeof example === 'string' ? example : undefined,
        }
      : {};

  const specFromRegistry =
    resolvedSpec.what || resolvedSpec.why || resolvedSpec.format || resolvedSpec.impact || resolvedSpec.example
      ? resolvedSpec
      : getCmsFieldUxSpec(formId ?? '', fieldPath ?? '');

  const resolvedExample = example ?? (specFromRegistry.example ? <code>{specFromRegistry.example}</code> : undefined);
  const hasAnyContent =
    specFromRegistry.what ||
    specFromRegistry.why ||
    specFromRegistry.format ||
    specFromRegistry.validation ||
    specFromRegistry.impact ||
    resolvedExample;

  if (!hasAnyContent) {
    return null;
  }

  return (
    <FormDescription>
      {specFromRegistry.what && <Segment label="What" value={specFromRegistry.what} />}
      {specFromRegistry.why && <> {' '}<Segment label="Why" value={specFromRegistry.why} /></>}
      {specFromRegistry.format && <> {' '}<Segment label="Format" value={specFromRegistry.format} /></>}
      {specFromRegistry.validation && <> {' '}<Segment label="Validation" value={specFromRegistry.validation} /></>}
      {specFromRegistry.impact && <> {' '}<Segment label="Impact" value={specFromRegistry.impact} /></>}
      {resolvedExample && <> {' '}<Segment label="Example" value={resolvedExample} /></>}
    </FormDescription>
  );
}
