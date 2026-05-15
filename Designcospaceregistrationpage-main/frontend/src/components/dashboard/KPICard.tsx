import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  trend: string;
  trendColor: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

export function KPICard({ label, value, trend, trendColor, icon: Icon, iconBg, iconColor }: KPICardProps) {
  return (
    <div style={{ ...card, padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>{label}</p>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      <p style={{ fontSize: '26px', fontWeight: '700', color: '#111111', marginBottom: '6px' }}>{value}</p>
      <p style={{ fontSize: '12px', color: trendColor, fontWeight: '500' }}>{trend}</p>
    </div>
  );
}
