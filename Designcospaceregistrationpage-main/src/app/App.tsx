import { useState } from 'react';
import {
  Building2, Wallet, X, Calendar, ChevronLeft, ChevronRight, Camera, ChevronDown,
} from 'lucide-react';
import { RegisterScreen } from './components/RegisterScreen';
import { LoginScreen } from './components/LoginScreen';
import { SpacesScreen } from './components/SpacesScreen';
import { BookingFormScreen } from './components/BookingFormScreen';
import { AdminDashboard } from './components/AdminDashboard';

// ── Donut chart helpers ───────────────────────────────────────────────────────

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutArc(cx: number, cy: number, ro: number, ri: number, a1: number, a2: number) {
  const A = polar(cx, cy, ro, a1), B = polar(cx, cy, ro, a2);
  const C = polar(cx, cy, ri, a2), D = polar(cx, cy, ri, a1);
  const lg = a2 - a1 > 180 ? 1 : 0;
  return [
    `M${A.x.toFixed(2)},${A.y.toFixed(2)}`,
    `A${ro},${ro} 0 ${lg} 1 ${B.x.toFixed(2)},${B.y.toFixed(2)}`,
    `L${C.x.toFixed(2)},${C.y.toFixed(2)}`,
    `A${ri},${ri} 0 ${lg} 0 ${D.x.toFixed(2)},${D.y.toFixed(2)}Z`,
  ].join(' ');
}

// ── Static data ───────────────────────────────────────────────────────────────

const CHART_SEGS = [
  { key: 'meeting',  label: 'Phòng họp',    color: '#7C3AED', pct: 50, a1: 1,   a2: 179 },
  { key: 'private',  label: 'VP Riêng',     color: '#D97706', pct: 30, a1: 181, a2: 287 },
  { key: 'hotdesk',  label: 'Hot Desk',     color: '#3B82F6', pct: 20, a1: 289, a2: 359 },
];

const BOOKINGS = [
  { room: 'Phòng họp A', addr: 'Tầng 3, BMT', time: '14/05 09:00–12:00', dur: '3 giờ', amt: '₫405.000', status: 'confirmed' },
  { room: 'Desk 101',    addr: 'Tầng 2, BMT', time: '10/05 08:00–10:00', dur: '2 giờ', amt: '₫100.000', status: 'confirmed' },
  { room: 'VP Riêng 01', addr: 'Tầng 4, BMT', time: '05/05 13:00–17:00', dur: '4 giờ', amt: '₫720.000', status: 'confirmed' },
  { room: 'Phòng họp B', addr: 'Tầng 3, BMT', time: '01/05 10:00–12:00', dur: '2 giờ', amt: '₫300.000', status: 'pending'   },
  { room: 'Desk 102',    addr: 'Tầng 2, BMT', time: '28/04 09:00–11:00', dur: '2 giờ', amt: '₫100.000', status: 'cancelled' },
];

const QUICK_AMTS = [50_000, 100_000, 200_000, 500_000];

function vnd(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BookingBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    confirmed: { bg: '#D1FAE5', color: '#065F46', label: 'Đã xác nhận' },
    pending:   { bg: '#FEF3C7', color: '#92400E', label: 'Chờ xử lý'   },
    cancelled: { bg: '#FEE2E2', color: '#991B1B', label: 'Đã hủy'      },
  };
  const s = map[status];
  return (
    <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '500', backgroundColor: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ── Shared style atoms ────────────────────────────────────────────────────────

const card: React.CSSProperties = { backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' };

const inputBase: React.CSSProperties = {
  height: '38px', borderRadius: '6px', border: '1px solid #D1D5DB',
  padding: '0 10px', fontSize: '14px', color: '#111111',
  fontFamily: 'DM Sans, sans-serif', outline: 'none', width: '100%',
  boxSizing: 'border-box',
};

const readonlyInput: React.CSSProperties = {
  ...inputBase, backgroundColor: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB',
};

const pageBtn = (active: boolean): React.CSSProperties => ({
  width: '28px', height: '28px', borderRadius: '5px', fontSize: '13px',
  fontWeight: active ? '600' : '400',
  backgroundColor: active ? '#111111' : 'transparent',
  color: active ? '#FFFFFF' : '#374151',
  border: active ? 'none' : '1px solid transparent',
  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

// ── Top-up Modal ──────────────────────────────────────────────────────────────

function TopUpModal({
  onClose,
  balance,
  selAmt,
  setSelAmt,
  customAmt,
  setCustomAmt,
}: {
  onClose: () => void;
  balance: number;
  selAmt: number;
  setSelAmt: (n: number) => void;
  customAmt: string;
  setCustomAmt: (s: string) => void;
}) {
  const afterBalance = balance + selAmt;

  const pickQuick = (n: number) => {
    setSelAmt(n);
    setCustomAmt(vnd(n));
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '440px', backgroundColor: '#FFFFFF', borderRadius: '16px',
          padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={18} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>Nạp tiền vào ví</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Số dư hiện tại: <span style={{ color: '#111111', fontWeight: '600' }}>₫ {vnd(balance)}</span></p>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginBottom: '20px' }} />

        {/* Quick amounts */}
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '10px' }}>Chọn số tiền nhanh</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {QUICK_AMTS.map((n) => (
            <button
              key={n}
              onClick={() => pickQuick(n)}
              style={{
                height: '38px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                backgroundColor: selAmt === n ? '#111111' : '#F9FAFB',
                color: selAmt === n ? '#FFFFFF' : '#374151',
                border: selAmt === n ? '1.5px solid #111111' : '1.5px solid #E5E7EB',
                transition: 'all 0.12s',
              }}
            >
              {vnd(n)}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Hoặc nhập số tiền khác</p>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>₫</span>
          <input
            value={customAmt}
            onChange={(e) => {
              const raw = e.target.value.replace(/\./g, '');
              const num = parseInt(raw, 10);
              if (!isNaN(num)) {
                setSelAmt(num);
                setCustomAmt(vnd(num));
              } else if (raw === '') {
                setCustomAmt('');
                setSelAmt(0);
              }
            }}
            style={{ ...inputBase, height: '42px', paddingLeft: '28px', fontSize: '15px', fontWeight: '600' }}
            onFocus={(e) => { e.target.style.border = '1px solid #3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
            onBlur={(e) => { e.target.style.border = '1px solid #D1D5DB'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Preview */}
        <div style={{ backgroundColor: '#F0FDF4', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#374151', fontFamily: 'DM Sans, sans-serif' }}>Số dư sau khi nạp</span>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>₫ {vnd(afterBalance)}</span>
        </div>

        {/* Payment method (decorative) */}
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '10px' }}>Phương thức thanh toán</p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['Chuyển khoản', 'Momo', 'VNPay'].map((m, i) => (
            <button key={m} style={{
              flex: 1, height: '36px', borderRadius: '8px', fontSize: '12px', fontWeight: '500',
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
              backgroundColor: i === 0 ? '#EFF6FF' : '#FFFFFF',
              color: i === 0 ? '#3B82F6' : '#6B7280',
              border: i === 0 ? '1.5px solid #3B82F6' : '1.5px solid #E5E7EB',
            }}>
              {m}
            </button>
          ))}
        </div>

        {/* Confirm */}
        <button
          onClick={onClose}
          style={{
            width: '100%', height: '44px', borderRadius: '8px',
            backgroundColor: '#111111', color: '#FFFFFF',
            fontSize: '14px', fontWeight: '700', border: 'none',
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Nạp ₫ {vnd(selAmt)}
        </button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [gender, setGender]           = useState('Nam');
  const [showModal, setShowModal]     = useState(false);
  const [selAmt, setSelAmt]           = useState(500_000);
  const [customAmt, setCustomAmt]     = useState('500.000');
  const [activePage, setActivePage]   = useState(1);
  const [activeScreen, setActiveScreen] = useState<'register' | 'login' | 'spaces' | 'profile' | 'booking-form' | 'admin'>('register');

  // Derive which nav item is "active" for underline styling
  const activeNav = activeScreen === 'profile' ? 'booking' : activeScreen === 'booking-form' ? 'booking' : 'spaces';

  const balance = 320_000;

  return (
    <>
      {/* Register Screen */}
      {activeScreen === 'register' && (
        <RegisterScreen
          onRegister={() => setActiveScreen('login')}
          onSwitchToLogin={() => setActiveScreen('login')}
        />
      )}

      {/* Login Screen */}
      {activeScreen === 'login' && (
        <LoginScreen
          onLogin={() => setActiveScreen('spaces')}
          onAdminLogin={() => setActiveScreen('admin')}
          onSwitchToRegister={() => setActiveScreen('register')}
        />
      )}

      {/* Admin Dashboard - completely separate layout */}
      {activeScreen === 'admin' && (
        <AdminDashboard onLogout={() => setActiveScreen('login')} />
      )}

      {/* Member screens - with navbar */}
      {activeScreen !== 'admin' && activeScreen !== 'register' && activeScreen !== 'login' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'DM Sans, sans-serif' }}>

          {/* ── Navbar ───────────────────────────────────────────────────────── */}
          <nav style={{
            ...card, borderRadius: 0, borderLeft: 'none', borderRight: 'none',
            borderTop: 'none', padding: '0 40px', height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 40,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }} onClick={() => setActiveScreen('spaces')}>
                <Building2 size={22} strokeWidth={2} style={{ color: '#111111' }} />
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#111111', letterSpacing: '-0.3px' }}>CoSpace</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[{ k: 'spaces', l: 'Không gian' }, { k: 'booking', l: 'Đặt chỗ của tôi' }].map(({ k, l }) => (
                  <button key={k} onClick={() => setActiveScreen(k === 'spaces' ? 'spaces' : 'profile')} style={{
                    padding: '6px 16px', fontSize: '14px',
                    fontWeight: activeNav === k ? '600' : '400',
                    color: activeNav === k ? '#111111' : '#6B7280',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeNav === k ? '2px solid #111111' : '2px solid transparent',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                    height: '64px', display: 'flex', alignItems: 'center',
                    transition: 'color 0.15s',
                  }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Wallet chip */}
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 13px', borderRadius: '8px', border: '1px solid #D1D5DB',
                  backgroundColor: '#FFFFFF', fontSize: '13px', fontWeight: '500', color: '#111111',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', flexShrink: 0 }} />
                ₫ {vnd(balance)}
              </button>
              {/* Avatar + dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setActiveScreen('profile')}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#3B82F6', color: '#FFFFFF', fontSize: '14px',
                  fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  M
                </div>
                <ChevronDown size={14} style={{ color: '#6B7280' }} />
              </div>
            </div>
          </nav>

          {/* ── Content ──────────────────────────────────────────────────────── */}
          {activeScreen === 'spaces' && (
            <SpacesScreen onBook={() => setActiveScreen('booking-form')} />
          )}
          {activeScreen === 'booking-form' && (
            <BookingFormScreen onBack={() => setActiveScreen('spaces')} />
          )}
          {activeScreen === 'profile' && (
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px 72px' }}>

              {/* ── Personal info ──────────────────────────────────────────────── */}
              <div style={{ ...card, padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>Thông tin cá nhân</span>
                  <button style={{ fontSize: '13px', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: '500' }}>
                    Chỉnh sửa
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <div style={{
                      width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3B82F6',
                      color: '#FFFFFF', fontSize: '24px', fontWeight: '700',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      NVA
                    </div>
                    <button style={{
                      fontSize: '12px', color: '#3B82F6', background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: '500',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <Camera size={12} />
                      Đổi ảnh
                    </button>
                  </div>

                  {/* Fields */}
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Họ và tên</label>
                      <input defaultValue="Nguyễn Văn A" style={inputBase}
                        onFocus={(e) => { e.target.style.border = '1px solid #3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                        onBlur={(e) => { e.target.style.border = '1px solid #D1D5DB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                      <input defaultValue="member@cospace.vn" readOnly style={readonlyInput} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Số điện thoại</label>
                      <input defaultValue="0912 345 678" style={inputBase}
                        onFocus={(e) => { e.target.style.border = '1px solid #3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                        onBlur={(e) => { e.target.style.border = '1px solid #D1D5DB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Ngày sinh</label>
                      <div style={{ position: 'relative' }}>
                        <input defaultValue="01/01/1995" style={{ ...inputBase, paddingRight: '32px' }}
                          onFocus={(e) => { e.target.style.border = '1px solid #3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                          onBlur={(e) => { e.target.style.border = '1px solid #D1D5DB'; e.target.style.boxShadow = 'none'; }}
                        />
                        <Calendar size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Giới tính</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {['Nam', 'Nữ', 'Khác'].map((g) => (
                          <button key={g} onClick={() => setGender(g)} style={{
                            flex: 1, height: '38px', borderRadius: '6px', fontSize: '13px',
                            fontWeight: gender === g ? '600' : '400',
                            backgroundColor: gender === g ? '#111111' : '#FFFFFF',
                            color: gender === g ? '#FFFFFF' : '#6B7280',
                            border: gender === g ? '1px solid #111111' : '1px solid #D1D5DB',
                            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                          }}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Ngày tham gia</label>
                      <input defaultValue="01/09/2025" readOnly style={readonlyInput} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
                  <button style={{
                    height: '36px', padding: '0 20px', borderRadius: '8px', backgroundColor: '#111111',
                    color: '#FFFFFF', fontSize: '13px', fontWeight: '600', border: 'none',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>

              {/* ── Wallet ─────────────────────────────────────────────────────── */}
              <div style={{ ...card, padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet size={22} style={{ color: '#3B82F6' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Số dư ví</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: '30px', fontWeight: '700', color: '#111111', letterSpacing: '-1px', lineHeight: 1 }}>
                        ₫ {vnd(balance)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    height: '36px', padding: '0 18px', borderRadius: '8px',
                    backgroundColor: '#FFFFFF', color: '#111111', fontSize: '13px', fontWeight: '600',
                    border: '1.5px solid #111111', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  Nạp tiền
                </button>
              </div>

              {/* ── Two-column section ─────────────────────────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', alignItems: 'start' }}>

                {/* LEFT: Booking history */}
                <div style={{ ...card, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>Lịch sử đặt chỗ</span>
                    <select style={{
                      fontSize: '13px', color: '#374151', border: '1px solid #E5E7EB',
                      borderRadius: '6px', padding: '4px 10px', outline: 'none',
                      fontFamily: 'DM Sans, sans-serif', backgroundColor: '#FFFFFF', cursor: 'pointer',
                    }}>
                      <option>Tất cả</option>
                      <option>Đã xác nhận</option>
                      <option>Chờ xử lý</option>
                      <option>Đã hủy</option>
                    </select>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['Phòng', 'Địa chỉ', 'Thời gian', 'Thời lượng', 'Số tiền', 'Trạng thái'].map((h) => (
                            <th key={h} style={{
                              padding: '8px 10px', textAlign: 'left', whiteSpace: 'nowrap',
                              fontSize: '11.5px', fontWeight: '600', color: '#9CA3AF',
                              borderBottom: '1px solid #F3F4F6',
                            }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {BOOKINGS.map((b, i) => (
                          <tr key={i} style={{ borderBottom: i < BOOKINGS.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                            <td style={{ padding: '11px 10px', fontSize: '13px', fontWeight: '500', color: '#111111', whiteSpace: 'nowrap' }}>{b.room}</td>
                            <td style={{ padding: '11px 10px', fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap' }}>{b.addr}</td>
                            <td style={{ padding: '11px 10px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>{b.time}</td>
                            <td style={{ padding: '11px 10px', fontSize: '13px', color: '#374151', whiteSpace: 'nowrap' }}>{b.dur}</td>
                            <td style={{
                              padding: '11px 10px', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap',
                              color: b.status === 'cancelled' ? '#9CA3AF' : '#111111',
                              textDecoration: b.status === 'cancelled' ? 'line-through' : 'none',
                            }}>
                              {b.amt}
                            </td>
                            <td style={{ padding: '11px 10px', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <BookingBadge status={b.status} />
                                {b.status === 'pending' && (
                                  <button style={{
                                    fontSize: '11.5px', color: '#EF4444', border: '1px solid #EF4444',
                                    borderRadius: '4px', padding: '2px 8px', background: 'none',
                                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                                  }}>
                                    Hủy
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px', marginTop: '14px' }}>
                    <button style={pageBtn(false)}><ChevronLeft size={13} /></button>
                    {[1, 2, 3].map((p) => (
                      <button key={p} onClick={() => setActivePage(p)} style={pageBtn(activePage === p)}>{p}</button>
                    ))}
                    <button style={pageBtn(false)}><ChevronRight size={13} /></button>
                  </div>
                </div>

                {/* RIGHT column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Spending chart */}
                  <div style={{ ...card, padding: '20px' }}>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#111111', marginBottom: '16px' }}>
                      Chi phí theo loại phòng
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <svg viewBox="0 0 160 160" width="156" height="156">
                        {CHART_SEGS.map((seg) => (
                          <path key={seg.key} d={donutArc(80, 80, 70, 44, seg.a1, seg.a2)} fill={seg.color} />
                        ))}
                        <text x="80" y="76" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '700', fill: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
                          ₫ 1.625.000
                        </text>
                        <text x="80" y="92" textAnchor="middle" style={{ fontSize: '11px', fill: '#9CA3AF', fontFamily: 'DM Sans, sans-serif' }}>
                          Tổng
                        </text>
                      </svg>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '9px', marginTop: '8px' }}>
                        {CHART_SEGS.map((seg) => (
                          <div key={seg.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: seg.color, display: 'inline-block', flexShrink: 0 }} />
                              <span style={{ fontSize: '13px', color: '#374151' }}>{seg.label}</span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111111' }}>{seg.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Tổng đặt chỗ', main: '12', sub: 'lần', size: '24px' },
                      { label: 'Tổng chi tiêu', main: '₫ 1.625.000', sub: '', size: '12.5px' },
                      { label: 'Thời lượng TB', main: '2.5 giờ', sub: '', size: '17px' },
                    ].map((s) => (
                      <div key={s.label} style={{ ...card, padding: '14px', textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px', fontWeight: '500', lineHeight: 1.3 }}>{s.label}</p>
                        <p style={{ fontSize: s.size, fontWeight: '700', color: '#111111', lineHeight: 1.2 }}>
                          {s.main}
                          {s.sub && <span style={{ fontSize: '11px', fontWeight: '400', color: '#9CA3AF', marginLeft: '3px' }}>{s.sub}</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          )}
        </div>
      )}

      {/* ── Nạp tiền modal (global) ───────────────────────────────────────── */}
      {showModal && (
        <TopUpModal
          onClose={() => setShowModal(false)}
          balance={balance}
          selAmt={selAmt}
          setSelAmt={setSelAmt}
          customAmt={customAmt}
          setCustomAmt={setCustomAmt}
        />
      )}
    </>
  );
}
