import { useEffect, useState } from 'react';
import { Calendar, Camera, Loader2 } from 'lucide-react';
import { BookingHistory } from '../components/profile/BookingHistory';
import { SpendingChart } from '../components/profile/SpendingChart';
import { WalletCard } from '../components/profile/WalletCard';
import { getMyBookings } from '../services/bookingService';
import { useAuth } from '../hooks/useAuth';
import { vnd } from '../utils/formatCurrency';
import type { Booking, BookingHistoryItem } from '../types/booking';

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

const readonlyInput: React.CSSProperties = {
  ...inputBase,
  backgroundColor: '#F9FAFB',
  color: '#6B7280',
  border: '1px solid #E5E7EB',
};

const CHART_SEGMENTS = [
  { key: 'meeting', label: 'Meeting', color: '#7C3AED', pct: 50, a1: 1, a2: 179 },
  { key: 'private', label: 'Private', color: '#D97706', pct: 30, a1: 181, a2: 287 },
  { key: 'hotdesk', label: 'Hot Desk', color: '#3B82F6', pct: 20, a1: 289, a2: 359 },
];

interface ProfileScreenProps {
  balance: number;
  onTopUp: () => void;
}

export function ProfileScreen({ balance, onTopUp }: ProfileScreenProps) {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(0);
  const [bookingTotalElements, setBookingTotalElements] = useState(0);
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      setLoadingBookings(true);
      setBookingError(null);
      try {
        const result = await getMyBookings({ page: activePage - 1, size: 5 });
        setBookings(result.content.map(mapBookingHistory));
        setBookingTotalPages(result.totalPages);
        setBookingTotalElements(result.totalElements);
      } catch (error) {
        setBookingError(error instanceof Error ? error.message : 'Khong the tai lich su booking');
      } finally {
        setLoadingBookings(false);
      }
    };

    void loadBookings();
  }, [activePage]);

  const initials = (user?.name ?? 'Member')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const totalSpent = bookings.reduce((sum, booking) => sum + parseVnd(booking.amt), 0);

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px 72px' }}>
      <div style={{ ...card, padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>Thong tin ca nhan</span>
        </div>

        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {initials || 'M'}
            </div>
            <button
              style={{
                fontSize: '12px',
                color: '#3B82F6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Camera size={12} />
              Doi anh
            </button>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Ho va ten</label>
              <input defaultValue={user?.name ?? ''} style={inputBase} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Email</label>
              <input value={user?.email ?? ''} readOnly style={readonlyInput} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>So dien thoai</label>
              <input defaultValue={user?.phone ?? ''} style={inputBase} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Ngay tham gia</label>
              <div style={{ position: 'relative' }}>
                <input value="Backend account" readOnly style={{ ...readonlyInput, paddingRight: '32px' }} />
                <Calendar size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <WalletCard balance={balance} onTopUp={onTopUp} />

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', alignItems: 'start' }}>
        <div>
          {bookingError && (
            <div style={{ ...card, padding: '12px 14px', color: '#B91C1C', backgroundColor: '#FEF2F2', marginBottom: '12px', fontSize: '13px' }}>
              {bookingError}
            </div>
          )}
          {loadingBookings ? (
            <div style={{ ...card, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#6B7280' }}>
              <Loader2 size={16} />
              Dang tai lich su booking...
            </div>
          ) : (
            <BookingHistory
              bookings={bookings}
              activePage={activePage}
              totalPages={bookingTotalPages}
              onPageChange={setActivePage}
            />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SpendingChart segments={CHART_SEGMENTS} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Tong dat cho', main: String(bookingTotalElements) },
              { label: 'Chi tieu trang nay', main: `VND ${vnd(totalSpent)}` },
            ].map((stat) => (
              <div key={stat.label} style={{ ...card, padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px', fontWeight: '500', lineHeight: 1.3 }}>{stat.label}</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#111111', lineHeight: 1.2 }}>
                  {stat.main}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function mapBookingHistory(booking: Booking): BookingHistoryItem {
  return {
    room: booking.workspaceName ?? `Workspace #${booking.workspaceId}`,
    addr: `Workspace #${booking.workspaceId}`,
    time: `${formatDateTime(booking.startTime)}-${formatTime(booking.endTime)}`,
    dur: `${calculateDurationHours(booking.startTime, booking.endTime)} gio`,
    amt: `VND ${vnd(booking.totalAmount)}`,
    status: booking.status,
  };
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} ${formatTime(value)}`;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(11, 16);
  }
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function calculateDurationHours(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0;
  }
  return Math.max(Math.ceil((endDate.getTime() - startDate.getTime()) / 3_600_000), 0);
}

function parseVnd(value: string) {
  const numeric = value.replace(/\D/g, '');
  return numeric ? Number(numeric) : 0;
}
