import type { StoragePlan } from '@/lib/cms/storage-stats';

type Props = {
  usedBytes: number;
  limitBytes: number;
  planName: StoragePlan;
  fileCount: number;
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(3)} GB`;
}

function formatGB(bytes: number): string {
  return `${(bytes / 1024 ** 3).toFixed(3)} GB`;
}

const PLAN_LABELS: Record<StoragePlan, string> = {
  free: 'Free (1 GB)',
  pro: 'Pro (100 GB)',
  team: 'Team (100 GB)',
  enterprise: 'Enterprise',
  unknown: 'Unknown',
};

export function StorageUsageBar({ usedBytes, limitBytes, planName, fileCount }: Props) {
  const pct = limitBytes > 0 ? Math.min((usedBytes / limitBytes) * 100, 100) : 0;
  const isWarning = pct >= 70;
  const isCritical = pct >= 90;

  const barColor = isCritical
    ? '#ef4444'
    : isWarning
    ? '#f59e0b'
    : '#7c5cff';

  return (
    <div style={styles.card}>
      {/* Header row */}
      <div style={styles.headerRow}>
        <div>
          <span style={styles.label}>Storage đang dùng</span>
          <span style={styles.plan}>{PLAN_LABELS[planName]}</span>
        </div>
        <div style={styles.stats}>
          <span style={styles.statItem}>
            <strong>{fileCount}</strong> files
          </span>
          <span style={styles.statItem}>
            <strong>{formatBytes(usedBytes)}</strong> / {formatGB(limitBytes)}
          </span>
          <span
            style={{
              ...styles.pctBadge,
              background: isCritical
                ? '#fee2e2'
                : isWarning
                ? '#fef3c7'
                : '#ede9fe',
              color: isCritical ? '#dc2626' : isWarning ? '#b45309' : '#7c3aed',
            }}
          >
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.barTrack}>
        <div
          style={{
            ...styles.barFill,
            width: `${pct}%`,
            background: barColor,
          }}
        />
      </div>

      {/* Warning messages */}
      {isCritical && (
        <p style={{ ...styles.hint, color: '#dc2626' }}>
          ⚠️ Dung lượng gần đầy! Xoá bớt ảnh không dùng hoặc nâng cấp plan.
        </p>
      )}
      {isWarning && !isCritical && (
        <p style={{ ...styles.hint, color: '#b45309' }}>
          ⚡ Đã dùng hơn 70% dung lượng. Cân nhắc dọn dẹp asset.
        </p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '16px 20px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111',
    marginRight: '8px',
  },
  plan: {
    fontSize: '12px',
    color: '#888',
    background: '#f3f4f6',
    padding: '2px 8px',
    borderRadius: '99px',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statItem: {
    fontSize: '13px',
    color: '#555',
  },
  pctBadge: {
    fontSize: '12px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '99px',
  },
  barTrack: {
    height: '8px',
    background: '#f3f4f6',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '99px',
    transition: 'width 0.4s ease',
  },
  hint: {
    margin: 0,
    fontSize: '12px',
  },
} as const;
