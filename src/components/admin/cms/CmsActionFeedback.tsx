'use client';

import * as React from 'react';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
} from '@/components/admin/layout/AdminPrimitives';

export type CmsActionFeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface CmsActionFeedbackState {
  type: CmsActionFeedbackType;
  message: string;
  title?: string;
}

interface CmsActionFeedbackProps {
  feedback: CmsActionFeedbackState | null;
}

const AUTO_DISMISS_MS = 3000;

export function CmsActionFeedback({ feedback }: CmsActionFeedbackProps) {
  if (!feedback) return null;

  const tone =
    feedback.type === 'error'
      ? 'destructive'
      : feedback.type === 'success'
        ? 'success'
        : feedback.type === 'warning'
          ? 'warning'
          : 'info';

  return (
    <AdminAlert
      tone={tone}
      message={feedback.title ? <AdminAlertTitle>{feedback.title}</AdminAlertTitle> : undefined}
      description={<AdminAlertDescription>{feedback.message}</AdminAlertDescription>}
    />
  );
}

export function useCmsActionFeedback() {
  const [feedback, setFeedback] = React.useState<CmsActionFeedbackState | null>(null);
  const dismissTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFeedback = React.useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setFeedback(null);
  }, []);

  const showFeedback = React.useCallback(
    (nextFeedback: CmsActionFeedbackState, options?: { autoDismiss?: boolean }) => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }

      setFeedback(nextFeedback);

      const shouldAutoDismiss =
        options?.autoDismiss ?? (nextFeedback.type === 'success' || nextFeedback.type === 'info');

      if (shouldAutoDismiss) {
        dismissTimerRef.current = setTimeout(() => {
          setFeedback(null);
          dismissTimerRef.current = null;
        }, AUTO_DISMISS_MS);
      }
    },
    []
  );

  React.useEffect(
    () => () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    },
    []
  );

  return {
    feedback,
    clearFeedback,
    showSuccess: React.useCallback(
      (message: string, title = 'Success') => showFeedback({ type: 'success', title, message }),
      [showFeedback]
    ),
    showError: React.useCallback(
      (error: unknown, fallback = 'Failed to complete action. Please try again.', title = 'Error') =>
        showFeedback(
          {
            type: 'error',
            title,
            message: error instanceof Error ? error.message : fallback,
          },
          { autoDismiss: false }
        ),
      [showFeedback]
    ),
    showWarning: React.useCallback(
      (message: string, title = 'Warning') =>
        showFeedback({ type: 'warning', title, message }, { autoDismiss: false }),
      [showFeedback]
    ),
    showInfo: React.useCallback(
      (message: string, title = 'Info') => showFeedback({ type: 'info', title, message }),
      [showFeedback]
    ),
  };
}
