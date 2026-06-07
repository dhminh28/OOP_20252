import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { BookingHistory } from '../components/profile/BookingHistory';
import { SpendingChart } from '../components/profile/SpendingChart';
import { cancelBooking, getMyBookings } from '../services/bookingService';
import { vnd } from '../utils/formatCurrency';
import { workspaceNameLabel } from '../utils/displayText';
import type { Booking, BookingHistoryItem } from '../types/booking';

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

const CHART_SEGMENTS = [
  { key: 'meeting', label: 'Phòng họp', color: '#7C3AED', pct: 50, a1: 1, a2: 179 },
  { key: 'private', label: 'Văn phòng riêng', color: '#D97706', pct: 30, a1: 181, a2: 287 },
  { key: 'hotdesk', label: 'Bàn làm việc chung', color: '#3B82F6', pct: 20, a1: 289, a2: 359 },
];

export function MyBookingsScreen() {
  const [activePage, setActivePage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(0);
  const [bookingTotalElements, setBookingTotalElements] = useState(0);
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookingHistoryItem | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);
    setBookingError(null);
    try {
      const result = await getMyBookings({ page: activePage - 1, size: 5 });
      setBookings(result.content.map(mapBookingHistory));
      setBookingTotalPages(result.totalPages);
      setBookingTotalElements(result.totalElements);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Không thể tải lịch sử đặt chỗ.');
    } finally {
      setLoadingBookings(false);
    }
  }, [activePage]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const openCancelForm = (booking: BookingHistoryItem) => {
    setCancelTarget(booking);
    setCancelReason('');
    setBookingError(null);
    setCancelMessage(null);
  };

  const closeCancelForm = () => {
    if (cancelLoading) {
      return;
    }
    setCancelTarget(null);
    setCancelReason('');
  };

  const submitCancel = async () => {
    if (!cancelTarget) {
      return;
    }

    setCancelLoading(true);
    setBookingError(null);
    setCancelMessage(null);
    try {
      await cancelBooking(cancelTarget.id, cancelReason.trim() || undefined);
      setCancelTarget(null);
      setCancelReason('');
      setCancelMessage('Đã hủy lịch thành công.');
      await loadBookings();
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Không thể hủy lịch đặt chỗ.');
    } finally {
      setCancelLoading(false);
    }
  };

  const totalSpent = bookings.reduce((sum, booking) => sum + parseVnd(booking.amt), 0);

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px 72px' }}>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111111', marginBottom: '6px' }}>
          Đặt chỗ của tôi
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          Theo dõi lịch sử đặt chỗ, trạng thái thanh toán và chi tiêu gần đây.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', alignItems: 'start' }}>
        <div>
          {bookingError && (
            <div style={{ ...card, padding: '12px 14px', color: '#B91C1C', backgroundColor: '#FEF2F2', marginBottom: '12px', fontSize: '13px' }}>
              {bookingError}
            </div>
          )}
          {cancelMessage && (
            <div style={{ ...card, padding: '12px 14px', color: '#047857', backgroundColor: '#ECFDF5', marginBottom: '12px', fontSize: '13px' }}>
              {cancelMessage}
            </div>
          )}
          {loadingBookings ? (
            <div style={{ ...card, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#6B7280' }}>
              <Loader2 size={16} />
              Đang tải lịch sử đặt chỗ...
            </div>
          ) : (
            <BookingHistory
              bookings={bookings}
              activePage={activePage}
              totalPages={bookingTotalPages}
              onPageChange={setActivePage}
              onCancel={openCancelForm}
            />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SpendingChart segments={CHART_SEGMENTS} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Tổng lượt đặt chỗ', main: String(bookingTotalElements) },
              { label: 'Chi tiêu trong trang', main: `${vnd(totalSpent)} ₫` },
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

      {cancelTarget && (
        <Modal onClose={closeCancelForm} width="460px">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '18px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111111', marginBottom: '5px' }}>
                Hủy lịch đặt chỗ
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>
                Xác nhận hủy lịch tại {cancelTarget.room}. Sau khi hủy, hệ thống sẽ không tiếp tục giữ chỗ này.
              </p>
            </div>
          </div>

          <div style={{ ...card, padding: '12px', marginBottom: '14px', backgroundColor: '#F9FAFB' }}>
            <div style={{ fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
              <strong>Thời gian:</strong> {cancelTarget.time}
            </div>
            <div style={{ fontSize: '13px', color: '#374151' }}>
              <strong>Chi phí:</strong> {cancelTarget.amt}
            </div>
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '7px' }}>
            Lý do hủy
          </label>
          <textarea
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            placeholder="Ví dụ: Đổi lịch họp, không còn nhu cầu..."
            rows={4}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              padding: '10px 12px',
              fontSize: '13px',
              fontFamily: 'DM Sans, sans-serif',
              color: '#111111',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '16px',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={closeCancelForm}
              disabled={cancelLoading}
              style={{
                height: '38px',
                padding: '0 16px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                cursor: cancelLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              Giữ lịch
            </button>
            <button
              onClick={submitCancel}
              disabled={cancelLoading}
              style={{
                height: '38px',
                padding: '0 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: cancelLoading ? '#FCA5A5' : '#B91C1C',
                color: '#FFFFFF',
                cursor: cancelLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {cancelLoading && <Loader2 size={15} />}
              {cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function mapBookingHistory(booking: Booking): BookingHistoryItem {
  return {
    id: booking.id,
    room: workspaceNameLabel(booking.workspaceName ?? `Không gian #${booking.workspaceId}`),
    addr: `Không gian #${booking.workspaceId}`,
    time: `${formatDateTime(booking.startTime)}-${formatTime(booking.endTime)}`,
    dur: `${calculateDurationHours(booking.startTime, booking.endTime)} giờ`,
    amt: `${vnd(booking.totalAmount)} ₫`,
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
