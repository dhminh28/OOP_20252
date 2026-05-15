import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Briefcase,
  DollarSign,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { BookingStatsChart } from '../components/dashboard/BookingStatsChart';
import { KPICard } from '../components/dashboard/KPICard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { getDashboardSummary, type DashboardSummary } from '../services/adminService';
import { vnd } from '../utils/formatCurrency';

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

const inputBase: React.CSSProperties = {
  height: '38px',
  borderRadius: '6px',
  border: '1px solid #D1D5DB',
  padding: '0 10px',
  fontSize: '14px',
  color: '#111111',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const WORKSPACE_ROWS = [
  {
    name: 'Meeting Room A',
    type: 'Meeting Room',
    typeBg: '#F5F3FF',
    typeColor: '#7C3AED',
    address: '3F, BMT Building, 32 Le Duan',
    capacity: '8 people',
    price: 'VND 150.000',
    status: 'Available',
    statusBg: '#DCFCE7',
    statusColor: '#16A34A',
  },
  {
    name: 'Desk 101',
    type: 'Hot Desk',
    typeBg: '#EFF6FF',
    typeColor: '#3B82F6',
    address: '2F, BMT Building, 32 Le Duan',
    capacity: '1 person',
    price: 'VND 50.000',
    status: 'Available',
    statusBg: '#DCFCE7',
    statusColor: '#16A34A',
  },
  {
    name: 'Private Office 01',
    type: 'Private Office',
    typeBg: '#FFFBEB',
    typeColor: '#D97706',
    address: '4F, BMT Building, 32 Le Duan',
    capacity: '4 people',
    price: 'VND 200.000',
    status: 'Available',
    statusBg: '#DCFCE7',
    statusColor: '#16A34A',
  },
  {
    name: 'Meeting Room B',
    type: 'Meeting Room',
    typeBg: '#F5F3FF',
    typeColor: '#7C3AED',
    address: '3F, BMT Building, 32 Le Duan',
    capacity: '6 people',
    price: 'VND 120.000',
    status: 'Maintenance',
    statusBg: '#F3F4F6',
    statusColor: '#6B7280',
  },
];

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [amenities, setAmenities] = useState({
    wifi: true,
    projector: true,
    ac: true,
    whiteboard: true,
    tv: false,
    printer: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      setSummaryLoading(true);
      setSummaryError(null);

      try {
        const data = await getDashboardSummary();
        if (isMounted) {
          setSummary(data);
        }
      } catch (error) {
        if (isMounted) {
          setSummaryError(error instanceof Error ? error.message : 'Unable to load dashboard metrics');
        }
      } finally {
        if (isMounted) {
          setSummaryLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const kpiItems = useMemo(
    () => [
      {
        label: 'Total revenue',
        value: `VND ${vnd(summary?.revenue ?? 0)}`,
        trend: summaryLoading ? 'Loading live metrics' : 'Wallet payment transactions',
        trendColor: '#10B981',
        iconBg: '#EFF6FF',
        icon: DollarSign,
        iconColor: '#3B82F6',
      },
      {
        label: 'Successful bookings',
        value: String(summary?.totalBookings ?? 0),
        trend: summaryLoading ? 'Loading live metrics' : 'Paid bookings in database',
        trendColor: '#10B981',
        iconBg: '#F5F3FF',
        icon: Briefcase,
        iconColor: '#A855F7',
      },
      {
        label: 'Registered users',
        value: String(summary?.activeMembers ?? 0),
        trend: summaryLoading ? 'Loading live metrics' : 'All accounts in users table',
        trendColor: '#10B981',
        iconBg: '#F0FDF4',
        icon: UserCheck,
        iconColor: '#22C55E',
      },
      {
        label: 'Occupancy rate',
        value: `${Math.round(summary?.occupancyRate ?? 0)}%`,
        trend: summaryLoading ? 'Loading live metrics' : 'Successful bookings per workspace',
        trendColor: '#F59E0B',
        iconBg: '#FFFBEB',
        icon: TrendingUp,
        iconColor: '#F59E0B',
      },
    ],
    [summary, summaryLoading],
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'DM Sans, sans-serif' }}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} onLogout={onLogout} />

      <main style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            ...card,
            borderRadius: 0,
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111111' }}>Admin Overview</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Bell size={20} style={{ color: '#6B7280', cursor: 'pointer' }} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            </div>
            <div style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', color: '#6B7280' }}>
              14/05/2026
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>Admin</p>
          </div>
        </header>

        <div style={{ padding: '24px' }}>
          {summaryLoading && (
            <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', marginBottom: '16px', color: '#4B5563', fontSize: '13px' }}>
              <Loader2 size={16} />
              Loading admin metrics...
            </div>
          )}

          {summaryError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', marginBottom: '16px', border: '1px solid #FCA5A5', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '13px' }}>
              <AlertTriangle size={16} />
              {summaryError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {kpiItems.map((kpi) => (
              <KPICard key={kpi.label} {...kpi} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(320px, 2fr)', gap: '20px', marginBottom: '20px' }}>
            <RevenueChart data={summary?.monthlyRevenue ?? []} />
            <BookingStatsChart data={summary?.bookingStatusSummary ?? []} />
          </div>

          <div style={{ ...card, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>Workspace Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '36px',
                  padding: '0 16px',
                  borderRadius: '8px',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <Plus size={16} />
                Add workspace
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Name', 'Type', 'Address', 'Capacity', 'Price/hour', 'Status', 'Actions'].map((heading) => (
                      <th key={heading} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280', borderBottom: '1px solid #F3F4F6' }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WORKSPACE_ROWS.map((room, index) => (
                    <tr key={room.name} style={{ borderBottom: index < WORKSPACE_ROWS.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#111111' }}>{room.name}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: room.typeBg, color: room.typeColor, whiteSpace: 'nowrap' }}>
                          {room.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#6B7280' }}>{room.address}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#111111' }}>{room.capacity}</td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#111111', whiteSpace: 'nowrap' }}>{room.price}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: room.statusBg, color: room.statusColor, whiteSpace: 'nowrap' }}>
                          {room.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', borderRadius: '6px', background: '#FFFFFF', cursor: 'pointer', color: '#6B7280' }}>
                            <Edit2 size={14} />
                          </button>
                          <button style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', borderRadius: '6px', background: '#FFFFFF', cursor: 'pointer', color: '#6B7280' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{ width: '580px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111111' }}>Add workspace</h2>
              <button onClick={() => setShowAddModal(false)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginBottom: '20px' }} />

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Workspace name</label>
                <input placeholder="Example: Meeting Room A" style={inputBase} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Type</label>
                  <select style={{ ...inputBase, cursor: 'pointer' }}>
                    <option>Meeting Room</option>
                    <option>Hot Desk</option>
                    <option>Private Office</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Capacity</label>
                  <input type="number" defaultValue="8" style={inputBase} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Price/hour</label>
                  <input type="number" defaultValue="150000" style={inputBase} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Floor</label>
                  <input defaultValue="3" style={inputBase} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '10px' }}>Amenities</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { key: 'wifi', label: 'WiFi' },
                    { key: 'projector', label: 'Projector' },
                    { key: 'ac', label: 'Air conditioner' },
                    { key: 'whiteboard', label: 'Whiteboard' },
                    { key: 'tv', label: 'TV' },
                    { key: 'printer', label: 'Printer' },
                  ].map((item) => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={amenities[item.key as keyof typeof amenities]}
                        onChange={(event) => setAmenities({ ...amenities, [item.key]: event.target.checked })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Description</label>
                <textarea placeholder="Workspace details, equipment, or location notes..." style={{ ...inputBase, height: '80px', resize: 'none', padding: '10px' }} />
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '24px 0 20px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowAddModal(false)} style={{ height: '36px', padding: '0 18px', borderRadius: '8px', backgroundColor: '#FFFFFF', color: '#374151', fontSize: '13px', fontWeight: '600', border: '1px solid #D1D5DB', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Cancel
              </button>
              <button style={{ height: '36px', padding: '0 18px', borderRadius: '8px', backgroundColor: '#111111', color: '#FFFFFF', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Create workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
