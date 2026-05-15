import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const MAY_GRID: (number | null)[][] = [
  [null, null, null, null, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
];

const TODAY = 6;
const TIME_SLOTS = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'];

interface MiniCalendarProps {
  selectedDate: number;
  onSelectDate: (date: number) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

function MiniCalendar({ selectedDate, onSelectDate, selectedTime, onSelectTime }: MiniCalendarProps) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', borderRadius: '6px', background: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={14} style={{ color: '#6B7280' }} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
          Tháng 5, 2026
        </span>
        <button style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', borderRadius: '6px', background: 'none', cursor: 'pointer' }}>
          <ChevronRight size={14} style={{ color: '#6B7280' }} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#9CA3AF', padding: '3px 0', fontFamily: 'DM Sans, sans-serif' }}>
            {weekday}
          </div>
        ))}
      </div>

      <div>
        {MAY_GRID.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '2px' }}>
            {row.map((day, colIndex) => {
              const isPast = day !== null && day < TODAY;
              const isToday = day === TODAY;
              const isSelected = day === selectedDate;

              let backgroundColor = 'transparent';
              let color = '#111111';
              let cursor = 'default';
              let fontWeight: string | number = '400';

              if (isSelected) {
                backgroundColor = '#111111';
                color = '#FFFFFF';
                fontWeight = '600';
                cursor = 'pointer';
              } else if (isToday) {
                backgroundColor = '#3B82F6';
                color = '#FFFFFF';
                fontWeight = '600';
                cursor = 'pointer';
              } else if (isPast) {
                color = '#D1D5DB';
                cursor = 'not-allowed';
              } else if (day !== null) {
                cursor = 'pointer';
              }

              return (
                <div key={colIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                  {day !== null ? (
                    <button
                      onClick={() => {
                        if (!isPast) onSelectDate(day);
                      }}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor,
                        color,
                        border: 'none',
                        fontSize: '12px',
                        fontWeight,
                        fontFamily: 'DM Sans, sans-serif',
                        cursor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(event) => {
                        if (!isPast && !isSelected && !isToday) event.currentTarget.style.backgroundColor = '#F3F4F6';
                      }}
                      onMouseLeave={(event) => {
                        if (!isPast && !isSelected && !isToday) event.currentTarget.style.backgroundColor = 'transparent';
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

      <div style={{ marginTop: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
        <p style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>
          Chọn giờ:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {TIME_SLOTS.map((time) => {
            const isSelected = time === selectedTime;

            return (
              <button
                key={time}
                onClick={() => onSelectTime(time)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: isSelected ? '600' : '400',
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#111111' : '#F9FAFB',
                  color: isSelected ? '#FFFFFF' : '#374151',
                  border: isSelected ? '1px solid #111111' : '1px solid #E5E7EB',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={(event) => {
                  if (!isSelected) event.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(event) => {
                  if (!isSelected) event.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface DateTimePickerProps {
  label: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  selectedDate: number;
  onSelectDate: (date: number) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

export function DateTimePicker({
  label,
  value,
  open,
  onToggle,
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
}: DateTimePickerProps) {
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>
        {label}
      </label>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          height: '44px',
          borderRadius: '8px',
          border: open ? '1.5px solid #3B82F6' : '1px solid #D1D5DB',
          boxShadow: open ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
          backgroundColor: '#FFFFFF',
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
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
          onSelectDate={onSelectDate}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
        />
      )}
    </div>
  );
}
