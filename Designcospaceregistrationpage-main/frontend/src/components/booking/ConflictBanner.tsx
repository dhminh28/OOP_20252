import { AlertTriangle } from 'lucide-react';

interface ConflictBannerProps {
  message: string;
}

export function ConflictBanner({ message }: ConflictBannerProps) {
  return (
    <div
      style={{
        marginTop: '14px',
        backgroundColor: '#FEF2F2',
        borderLeft: '3px solid #EF4444',
        borderRadius: '8px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
      }}
    >
      <AlertTriangle size={15} style={{ color: '#EF4444', flexShrink: 0, marginTop: '1px' }} />
      <span style={{ fontSize: '13px', color: '#DC2626', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.45' }}>
        {message}
      </span>
    </div>
  );
}
