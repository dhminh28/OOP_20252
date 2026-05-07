import { useState } from 'react';
import {
  MapPin, Users, Wifi, Monitor, Wind, Square,
  ChevronLeft, ChevronRight, Clock, CreditCard,
  AlertTriangle, CheckCircle2, CalendarDays, ChevronDown,
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

function vnd(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ── Calendar data for May 2026 ────────────────────────────────────────────────
// Today = May 6, 2026 (Wednesday). May 1 = Friday → col index 4 in Mon-based grid.

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const MAY_GRID: (number | null)[][] = [
  [null, null, null, null, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
];

const TODAY = 6; // May 6, 2026

const TIME_SLOTS = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'];

const EQUIPMENT = [
  { label: 'WiFi', icon: <Wifi size={10} /> },
  { label: 'Máy chiếu', icon: <Monitor size={10} /> },
  { label: 'Điều hòa', icon: <Wind size={10} /> },
  { label: 'Bảng trắng', icon: <Square size={10} /> },
];

// ── Mini calendar ─────────────────────────────────────────────────────────────

function MiniCalendar({
  selectedDate,
  onSelect,
  selectedTime,
  onSelectTime,
}: {
  selectedDate: number;
  onSelect: (d: number) => void;
  selectedTime: string;
  onSelectTime: (t: string) => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '16px',
        width: '300px',
      }}
    >
      {/* Month header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          style={{
            width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #E5E7EB', borderRadius: '6px', background: 'none', cursor: 'pointer',
          }}
        >
          <ChevronLeft size={14} style={{ color: '#6B7280' }} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
          Tháng 5, 2026
        </span>
        <button
          style={{
            width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #E5E7EB', borderRadius: '6px', background: 'none', cursor: 'pointer',
          }}
        >
          <ChevronRight size={14} style={{ color: '#6B7280' }} />
        </button>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#9CA3AF', padding: '3px 0', fontFamily: 'DM Sans, sans-serif' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div>
        {MAY_GRID.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '2px' }}>
            {row.map((day, ci) => {
              const isPast = day !== null && day < TODAY;
              const isToday = day === TODAY;
              const isSelected = day === selectedDate;

              let bg = 'transparent';
              let color = '#111111';
              let border = 'none';
              let cursor = 'default';
              let fontWeight: string | number = '400';

              if (isSelected) {
                bg = '#111111'; color = '#FFFFFF'; fontWeight = '600'; cursor = 'pointer';
              } else if (isToday) {
                bg = '#3B82F6'; color = '#FFFFFF'; fontWeight = '600'; cursor = 'pointer';
              } else if (isPast) {
                color = '#D1D5DB'; cursor = 'not-allowed';
              } else if (day !== null) {
                cursor = 'pointer';
              }

              return (
                <div key={ci} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                  {day !== null ? (
                    <button
                      onClick={() => !isPast && onSelect(day)}
                      style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        backgroundColor: bg, color, border,
                        fontSize: '12px', fontWeight,
                        fontFamily: 'DM Sans, sans-serif',
                        cursor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isPast && !isSelected && !isToday) {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F3F4F6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isPast && !isSelected && !isToday) {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {day}
                    </button>
                  ) : (
                    <div style={{ width: '30px', height: '30px' }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div style={{ marginTop: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
        <p style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>
          Chọn giờ:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {TIME_SLOTS.map((t) => {
            const isSel = t === selectedTime;
            return (
              <button
                key={t}
                onClick={() => onSelectTime(t)}
                style={{
                  padding: '4px 10px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: isSel ? '600' : '400',
                  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                  backgroundColor: isSel ? '#111111' : '#F9FAFB',
                  color: isSel ? '#FFFFFF' : '#374151',
                  border: isSel ? '1px solid #111111' : '1px solid #E5E7EB',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!isSel) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  if (!isSel) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F9FAFB';
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── DateTimeInput ─────────────────────────────────────────────────────────────

function DateTimeInput({
  label,
  value,
  open,
  onToggle,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
}: {
  label: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  selectedDate: number;
  onSelectDate: (d: number) => void;
  selectedTime: string;
  onSelectTime: (t: string) => void;
}) {
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
        {label}
      </label>
      <button
        onClick={onToggle}
        style={{
          width: '100%', height: '44px', borderRadius: '8px',
          border: open ? '1.5px solid #3B82F6' : '1px solid #D1D5DB',
          boxShadow: open ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
          backgroundColor: '#FFFFFF', padding: '0 12px',
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          transition: 'border 0.15s',
        }}
      >
        <CalendarDays size={15} style={{ color: '#9CA3AF', flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#111111' }}>
          {value}
        </span>
        <ChevronDown size={14} style={{ color: '#9CA3AF', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <MiniCalendar
          selectedDate={selectedDate}
          onSelect={onSelectDate}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

export function BookingFormScreen({ onBack }: Props) {
  const [startOpen, setStartOpen] = useState(true);
  const [endOpen, setEndOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(14);
  const [selectedStartTime, setSelectedStartTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  const PRICE_PER_HOUR = 150_000;
  const DURATION_H = 3;
  const SUBTOTAL = PRICE_PER_HOUR * DURATION_H;
  const DISCOUNT = 0;
  const TOTAL = SUBTOTAL - DISCOUNT;
  const WALLET = 500_000;

  const dateStr = `${String(selectedDate).padStart(2, '0')}/05/2026`;
  const endTime = '12:00';

  const handleStartToggle = () => {
    setStartOpen((v) => !v);
    if (!startOpen) setEndOpen(false);
  };
  const handleEndToggle = () => {
    setEndOpen((v) => !v);
    if (!endOpen) setStartOpen(false);
  };

  return (
    <div
      style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 40px 72px' }}
      onClick={() => { setStartOpen(false); setEndOpen(false); }}
    >
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
        {[
          { label: 'Không gian', onClick: onBack, active: false },
          { label: 'Phòng họp A', onClick: onBack, active: false },
          { label: 'Đặt chỗ', onClick: undefined, active: true },
        ].map((item, i, arr) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={item.onClick}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                color: item.active ? '#111111' : '#6B7280',
                fontWeight: item.active ? '600' : '400',
                cursor: item.onClick ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => { if (item.onClick) (e.currentTarget as HTMLButtonElement).style.color = '#111111'; }}
              onMouseLeave={(e) => { if (item.onClick && !item.active) (e.currentTarget as HTMLButtonElement).style.color = '#6B7280'; }}
            >
              {item.label}
            </button>
            {i < arr.length - 1 && (
              <ChevronRight size={13} style={{ color: '#D1D5DB' }} />
            )}
          </span>
        ))}
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', alignItems: 'start' }}>

        {/* ══ LEFT COLUMN ════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ── Room Info Card ────────────────────────────────────────────── */}
          <div
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {/* Thumbnail */}
              <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#E5E7EB' }}>
                <img
                  src="https://images.unsplash.com/photo-1687945727613-a4d06cc41024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
                  alt="Phòng họp A"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
                    Phòng họp A
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: '600', padding: '2px 9px', borderRadius: '5px',
                    backgroundColor: '#7C3AED', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif',
                  }}>
                    Meeting Room
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '4px' }}>
                  <MapPin size={12} style={{ color: '#9CA3AF', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
                    Tầng 3, Tòa nhà BMT, 32 Lê Duẩn, Q.Hai Bà Trưng, Hà Nội
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <Users size={12} style={{ color: '#9CA3AF' }} />
                  <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
                    Sức chứa: 8 người
                  </span>
                </div>

                {/* Equipment pills */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {EQUIPMENT.map((eq) => (
                    <span key={eq.label} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '3px',
                      padding: '3px 8px', backgroundColor: '#F3F4F6', borderRadius: '5px',
                      fontSize: '11px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif',
                    }}>
                      {eq.icon} {eq.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Time Selection Card ───────────────────────────────────────── */}
          <div
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif', marginBottom: '16px' }}>
              Chọn thời gian
            </p>

            {/* Two date inputs */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <DateTimeInput
                label="Bắt đầu"
                value={`${dateStr}  ${selectedStartTime}`}
                open={startOpen}
                onToggle={handleStartToggle}
                selectedDate={selectedDate}
                onSelectDate={(d) => { setSelectedDate(d); }}
                selectedTime={selectedStartTime}
                onSelectTime={setSelectedStartTime}
              />
              <DateTimeInput
                label="Kết thúc"
                value={`${dateStr}  ${endTime}`}
                open={endOpen}
                onToggle={handleEndToggle}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedTime={endTime}
                onSelectTime={() => {}}
              />
            </div>

            {/* Duration chip */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: '#EFF6FF', color: '#3B82F6',
                padding: '6px 14px', borderRadius: '8px',
                fontSize: '13px', fontWeight: '500', fontFamily: 'DM Sans, sans-serif',
              }}>
                <Clock size={13} />
                Thời lượng: {DURATION_H} giờ
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginTop: '20px' }}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: '500',
                color: '#374151', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif',
              }}>
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Yêu cầu đặc biệt, thiết bị thêm..."
                style={{
                  width: '100%', borderRadius: '8px', border: '1px solid #D1D5DB',
                  padding: '10px 12px', fontSize: '14px', color: '#111111',
                  fontFamily: 'DM Sans, sans-serif', outline: 'none', resize: 'vertical',
                  boxSizing: 'border-box', lineHeight: '1.5',
                }}
                onFocus={(e) => { e.target.style.border = '1px solid #3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.border = '1px solid #D1D5DB'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Conflict error banner */}
            <div style={{
              marginTop: '14px',
              backgroundColor: '#FEF2F2',
              borderLeft: '3px solid #EF4444',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}>
              <AlertTriangle size={15} style={{ color: '#EF4444', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', color: '#DC2626', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.45' }}>
                Phòng đã được đặt trong khung giờ này. Vui lòng chọn giờ khác.
              </span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT COLUMN — STICKY ══════════════════════════════════════════ */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>

            {/* Header */}
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif', marginBottom: '14px' }}>
              Tóm tắt đặt chỗ
            </p>
            <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginBottom: '14px' }} />

            {/* Room summary info */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
                  Phòng họp A
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '5px',
                  backgroundColor: '#7C3AED', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif',
                }}>
                  Meeting Room
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '4px' }}>
                <MapPin size={12} style={{ color: '#9CA3AF', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
                  Tầng 3, Tòa nhà BMT
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={12} style={{ color: '#9CA3AF' }} />
                <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
                  Sức chứa: 8 người
                </span>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginBottom: '14px' }} />

            {/* Price rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {[
                { label: 'Thời lượng', value: `${DURATION_H} giờ`, bold: false, gray: false },
                { label: 'Đơn giá', value: `₫ ${vnd(PRICE_PER_HOUR)}/giờ`, bold: false, gray: false },
                { label: 'Tạm tính', value: `₫ ${vnd(SUBTOTAL)}`, bold: false, gray: false },
                { label: 'Giảm giá (Meeting ≥4h)', value: `− ₫ 0`, bold: false, gray: true },
              ].map((row) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '7px 0',
                }}>
                  <span style={{ fontSize: '13px', color: row.gray ? '#9CA3AF' : '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: row.bold ? '600' : '500', color: row.gray ? '#9CA3AF' : '#374151', fontFamily: 'DM Sans, sans-serif' }}>
                    {row.value}
                  </span>
                </div>
              ))}

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '6px 0' }} />

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
                  TỔNG CỘNG
                </span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.5px' }}>
                  ₫ {vnd(TOTAL)}
                </span>
              </div>
            </div>

            {/* Wallet row */}
            <div style={{
              marginTop: '14px',
              backgroundColor: '#F0FDF4',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <CreditCard size={14} style={{ color: '#10B981' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981', fontFamily: 'DM Sans, sans-serif' }}>
                  Số dư ví: ₫ {vnd(WALLET)}
                </span>
              </div>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
            </div>

            {/* Insufficient warning */}
            <div style={{
              marginTop: '8px',
              backgroundColor: '#FFFBEB',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={13} style={{ color: '#D97706', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#92400E', fontFamily: 'DM Sans, sans-serif' }}>
                  Số dư không đủ. Cần nạp thêm ₫ 50.000
                </span>
              </div>
              <button style={{
                background: 'none', border: 'none', padding: '0 0 0 19px',
                fontSize: '12px', color: '#3B82F6', fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
              }}>
                Nạp tiền ngay →
              </button>
            </div>

            {/* Confirm button */}
            <button
              style={{
                width: '100%', height: '46px', borderRadius: '8px',
                backgroundColor: '#111111', color: '#FFFFFF',
                fontSize: '15px', fontWeight: '700',
                fontFamily: 'DM Sans, sans-serif',
                border: 'none', cursor: 'pointer', marginTop: '16px',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Xác nhận đặt chỗ
            </button>

            {/* Cancel link */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                onClick={onBack}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  fontSize: '13px', color: '#6B7280',
                  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
