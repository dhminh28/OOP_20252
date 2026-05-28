import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingStatusBadge } from '../common/Badge';
import type { BookingHistoryItem } from '../../types/booking';

interface BookingHistoryProps {
  bookings: BookingHistoryItem[];
  activePage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCancel?: (booking: BookingHistoryItem) => void;
}

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

const pageButtonStyle = (active: boolean, disabled = false): React.CSSProperties => ({
  width: '28px',
  height: '28px',
  borderRadius: '5px',
  fontSize: '13px',
  fontWeight: active ? '600' : '400',
  backgroundColor: active ? '#111111' : '#FFFFFF',
  color: disabled ? '#D1D5DB' : active ? '#FFFFFF' : '#374151',
  border: active ? 'none' : '1px solid #E5E7EB',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'DM Sans, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export function BookingHistory({ bookings, activePage, totalPages, onPageChange, onCancel }: BookingHistoryProps) {
  const safeTotalPages = Math.max(totalPages, 0);

  return (
    <div style={{ ...card, padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>Booking history</span>
        <span style={{ fontSize: '12px', color: '#6B7280' }}>
          Page {safeTotalPages === 0 ? 0 : activePage} of {safeTotalPages}
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Room', 'Address', 'Time', 'Duration', 'Amount', 'Status', 'Action'].map((heading) => (
                <th
                  key={heading}
                  style={{
                    padding: '8px 10px',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    color: '#9CA3AF',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.id} style={{ borderBottom: index < bookings.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <td style={{ padding: '11px 10px', fontSize: '13px', fontWeight: '500', color: '#111111', whiteSpace: 'nowrap' }}>
                  {booking.room}
                </td>
                <td style={{ padding: '11px 10px', fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap' }}>{booking.addr}</td>
                <td style={{ padding: '11px 10px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>{booking.time}</td>
                <td style={{ padding: '11px 10px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>{booking.dur}</td>
                <td
                  style={{
                    padding: '11px 10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    color: booking.status === 'cancelled' ? '#9CA3AF' : '#111111',
                    textDecoration: booking.status === 'cancelled' ? 'line-through' : 'none',
                  }}
                >
                  {booking.amt}
                </td>
                <td style={{ padding: '11px 10px', whiteSpace: 'nowrap' }}>
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td style={{ padding: '11px 10px', whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => onCancel?.(booking)}
                    disabled={!onCancel || booking.status === 'cancelled'}
                    style={{
                      height: '30px',
                      padding: '0 11px',
                      borderRadius: '6px',
                      border: booking.status === 'cancelled' ? '1px solid #E5E7EB' : '1px solid #FCA5A5',
                      backgroundColor: booking.status === 'cancelled' ? '#F9FAFB' : '#FFFFFF',
                      color: booking.status === 'cancelled' ? '#9CA3AF' : '#B91C1C',
                      cursor: !onCancel || booking.status === 'cancelled' ? 'not-allowed' : 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {booking.status === 'cancelled' ? 'Da huy' : 'Huy lich'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div style={{ padding: '36px 0', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
          No bookings found.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px', marginTop: '14px' }}>
        <button
          disabled={activePage <= 1}
          onClick={() => onPageChange(activePage - 1)}
          style={pageButtonStyle(false, activePage <= 1)}
        >
          <ChevronLeft size={13} />
        </button>
        <button style={pageButtonStyle(true)}>{safeTotalPages === 0 ? 0 : activePage}</button>
        <button
          disabled={activePage >= safeTotalPages}
          onClick={() => onPageChange(activePage + 1)}
          style={pageButtonStyle(false, activePage >= safeTotalPages)}
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
