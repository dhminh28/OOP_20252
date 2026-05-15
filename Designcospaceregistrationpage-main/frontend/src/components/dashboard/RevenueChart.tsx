import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { vnd } from '../../utils/formatCurrency';
import type { MonthlyRevenue } from '../../services/adminService';

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.length > 0 ? data : [{ period: 'No data', revenue: 0 }];

  return (
    <div style={{ ...card, padding: '20px', minHeight: '320px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>Revenue by month</h2>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>Wallet PAYMENT transactions</span>
      </div>

      <div style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${Math.round(Number(value) / 1_000_000)}m`}
            />
            <Tooltip formatter={(value) => [`VND ${vnd(Number(value))}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
