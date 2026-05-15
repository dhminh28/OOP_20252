import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { BookingStatusSummary } from '../../services/adminService';

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

const COLORS: Record<BookingStatusSummary['status'], string> = {
  PENDING: '#F59E0B',
  SUCCESS: '#10B981',
  CONFIRMED: '#3B82F6',
  CANCELLED: '#EF4444',
};

interface BookingStatsChartProps {
  data: BookingStatusSummary[];
}

export function BookingStatsChart({ data }: BookingStatsChartProps) {
  const chartData = data.length > 0 ? data : [{ status: 'SUCCESS' as const, count: 0 }];

  return (
    <div style={{ ...card, padding: '20px', minHeight: '320px' }}>
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>Booking status</h2>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Grouped from live booking records</p>
      </div>

      <div style={{ height: '190px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={2}
            >
              {chartData.map((item) => (
                <Cell key={item.status} fill={COLORS[item.status]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, String(name)]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {chartData.map((item) => (
          <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#374151' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: COLORS[item.status] }} />
            <span>{item.status}</span>
            <strong style={{ marginLeft: 'auto' }}>{item.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
