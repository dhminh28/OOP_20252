import { useMemo, useState } from 'react';
import { Clock, MapPin, Monitor, Square, Users, Wifi, Wind, ChevronRight } from 'lucide-react';
import { BookingSummary } from '../components/booking/BookingSummary';
import { ConflictBanner } from '../components/booking/ConflictBanner';
import { DateTimePicker } from '../components/booking/DateTimePicker';
import { WorkspaceTypeBadge } from '../components/common/Badge';
import { createBooking } from '../services/bookingService';
import { calculatePrice } from '../utils/calculatePrice';
import { equipmentLabel, workspaceLocationLabel, workspaceNameLabel } from '../utils/displayText';
import type { Workspace } from '../types/workspace';

const EQUIPMENT_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={10} />,
  Projector: <Monitor size={10} />,
  'Air conditioner': <Wind size={10} />,
  Whiteboard: <Square size={10} />,
};

interface BookingFormScreenProps {
  workspace: Workspace | null;
  walletBalance: number;
  walletLoading?: boolean;
  onBookingCompleted: () => Promise<void>;
  onBack: () => void;
}

export function BookingFormScreen({
  workspace,
  walletBalance,
  walletLoading = false,
  onBookingCompleted,
  onBack,
}: BookingFormScreenProps) {
  const [startOpen, setStartOpen] = useState(true);
  const [endOpen, setEndOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().getDate());
  const [selectedStartTime, setSelectedStartTime] = useState('09:00');
  const [selectedEndTime, setSelectedEndTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const durationHours = useMemo(
    () => calculateDurationHours(selectedStartTime, selectedEndTime),
    [selectedStartTime, selectedEndTime],
  );

  if (!workspace) {
    return (
      <div style={{ maxWidth: '720px', margin: '80px auto', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Chưa chọn không gian</p>
        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '18px' }}>Hãy quay lại danh sách và chọn không gian cần đặt.</p>
        <button onClick={onBack} style={{ height: '38px', padding: '0 18px', borderRadius: '8px', backgroundColor: '#111111', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
          Quay lại
        </button>
      </div>
    );
  }

  const pricePerHour = workspace.pricePerHour;
  const subtotal = pricePerHour * durationHours;
  const discount = 0;
  const total = calculatePrice(pricePerHour, durationHours, discount);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const dateText = `${String(selectedDate).padStart(2, '0')}/${currentMonth}/${currentYear}`;

  const handleStartToggle = () => {
    setStartOpen((open) => !open);
    if (!startOpen) setEndOpen(false);
  };

  const handleEndToggle = () => {
    setEndOpen((open) => !open);
    if (!endOpen) setStartOpen(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const booking = await createBooking({
        workspaceId: workspace.id,
        startTime: toBackendLocalDateTime(selectedDate, selectedStartTime),
        endTime: toBackendLocalDateTime(selectedDate, selectedEndTime),
        note: notes || undefined,
      });

      await onBookingCompleted();
      setSuccessMessage(`Đặt chỗ thành công. Mã đặt chỗ: ${booking.id}`);
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Đặt chỗ không thành công.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 40px 72px' }}
      onClick={() => {
        setStartOpen(false);
        setEndOpen(false);
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
        {[
          { label: 'Không gian', onClick: onBack, active: false },
          { label: workspaceNameLabel(workspace.name), onClick: onBack, active: false },
          { label: 'Đặt chỗ', onClick: undefined, active: true },
        ].map((item, index, items) => (
          <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={item.onClick}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '13px',
                fontFamily: 'DM Sans, sans-serif',
                color: item.active ? '#111111' : '#6B7280',
                fontWeight: item.active ? '600' : '400',
                cursor: item.onClick ? 'pointer' : 'default',
              }}
            >
              {item.label}
            </button>
            {index < items.length - 1 && <ChevronRight size={13} style={{ color: '#D1D5DB' }} />}
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#E5E7EB' }}>
                <img
                  src={workspace.image}
                  alt={workspace.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
                    {workspaceNameLabel(workspace.name)}
                  </span>
                  <WorkspaceTypeBadge type={workspace.type} />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '4px' }}>
                  <MapPin size={12} style={{ color: '#9CA3AF', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
                    {workspaceLocationLabel(workspace.floor)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Users size={12} style={{ color: '#9CA3AF' }} />
                  <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
                    Sức chứa: {workspace.capacity} người
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {workspace.equipment.map((equipment) => (
                    <span
                      key={equipment}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '3px 8px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '5px',
                        fontSize: '11px',
                        color: '#6B7280',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      {EQUIPMENT_ICONS[equipment]} {equipmentLabel(equipment)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}
            onClick={(event) => event.stopPropagation()}
          >
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif', marginBottom: '16px' }}>
              Chọn thời gian
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <DateTimePicker
                label="Bắt đầu"
                value={`${dateText}  ${selectedStartTime}`}
                open={startOpen}
                onToggle={handleStartToggle}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedTime={selectedStartTime}
                onSelectTime={setSelectedStartTime}
              />
              <DateTimePicker
                label="Kết thúc"
                value={`${dateText}  ${selectedEndTime}`}
                open={endOpen}
                onToggle={handleEndToggle}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedTime={selectedEndTime}
                onSelectTime={setSelectedEndTime}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: durationHours > 0 ? '#EFF6FF' : '#FEF2F2',
                  color: durationHours > 0 ? '#3B82F6' : '#DC2626',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <Clock size={13} />
                Thời lượng: {durationHours} giờ
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
                Ghi chú
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="Yêu cầu đặc biệt..."
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  padding: '10px 12px',
                  fontSize: '14px',
                  color: '#111111',
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  lineHeight: '1.5',
                }}
              />
            </div>

            {error && <ConflictBanner message={error} />}
          </div>
        </div>

        <BookingSummary
          workspace={workspace}
          onCancel={onBack}
          onConfirm={handleSubmit}
          durationHours={durationHours}
          pricePerHour={pricePerHour}
          subtotal={subtotal}
          discount={discount}
          total={total}
          walletBalance={walletBalance}
          walletLoading={walletLoading}
          submitting={submitting}
          successMessage={successMessage}
        />
      </div>
    </div>
  );
}

function calculateDurationHours(start: string, end: string) {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const diffMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  return Math.max(Math.ceil(diffMinutes / 60), 0);
}

function toBackendLocalDateTime(day: number, time: string) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  return `${currentYear}-${currentMonth}-${String(day).padStart(2, '0')}T${time}:00`;
}
