import { useState } from 'react';
import { Building2, Eye, EyeOff, CheckCircle2, Zap, Shield, Users } from 'lucide-react';

const inputBase: React.CSSProperties = {
  height: '42px',
  borderRadius: '6px',
  border: '1px solid #D1D5DB',
  padding: '0 12px',
  fontSize: '14px',
  color: '#111111',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#FFFFFF',
};

const focusStyle = {
  border: '1px solid #3B82F6',
  boxShadow: '0 0 0 3px rgba(59,130,246,0.1)',
};

const blurStyle = {
  border: '1px solid #D1D5DB',
  boxShadow: 'none',
};

interface RegisterScreenProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Đặt chỗ tức thì',
    desc: 'Chọn phòng, chọn giờ, xác nhận ngay — không cần chờ duyệt.',
  },
  {
    icon: Shield,
    title: 'Thanh toán an toàn',
    desc: 'Ví nội bộ bảo mật, lịch sử giao dịch minh bạch rõ ràng.',
  },
  {
    icon: Users,
    title: 'Cộng đồng năng động',
    desc: 'Kết nối cùng hàng trăm chuyên gia và doanh nghiệp tại CoSpace.',
  },
];

export function RegisterScreen({ onRegister, onSwitchToLogin }: RegisterScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    Object.assign(e.target.style, focusStyle);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    Object.assign(e.target.style, blurStyle);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily: 'DM Sans, sans-serif',
        backgroundColor: '#F9FAFB',
      }}
    >
      {/* ── LEFT BRAND PANEL ─────────────────────────────────────────────────── */}
      <div
        style={{
          width: '420px',
          flexShrink: 0,
          backgroundColor: '#111827',
          display: 'flex',
          flexDirection: 'column',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle circle decoration */}
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          backgroundColor: 'rgba(59,130,246,0.07)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '-60px', left: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          backgroundColor: 'rgba(59,130,246,0.05)', pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '56px', position: 'relative' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={20} strokeWidth={2.5} style={{ color: '#FFFFFF' }} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.4px' }}>
            CoSpace
          </span>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '30px', fontWeight: '700', color: '#FFFFFF',
            lineHeight: 1.25, letterSpacing: '-0.6px', margin: 0, marginBottom: '14px',
          }}>
            Không gian làm việc lý tưởng cho bạn
          </h2>
          <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>
            Tham gia cùng hơn <span style={{ color: '#FFFFFF', fontWeight: '600' }}>500+ thành viên</span> đang làm việc hiệu quả tại CoSpace mỗi ngày.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', flex: 1 }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                backgroundColor: 'rgba(59,130,246,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={17} style={{ color: '#60A5FA' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '3px' }}>{title}</p>
                <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial card */}
        <div style={{
          position: 'relative',
          marginTop: '40px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '18px 20px',
        }}>
          <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.6, marginBottom: '12px', fontStyle: 'italic' }}>
            "CoSpace giúp tôi có không gian tập trung để làm việc mà không cần văn phòng cố định. Rất tiện lợi!"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: '#FFFFFF',
            }}>
              T
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>Trần Minh Tú</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Freelance Designer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ─────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 60px',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '520px' }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111111', letterSpacing: '-0.4px', marginBottom: '6px' }}>
              Tạo tài khoản
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Điền thông tin bên dưới để bắt đầu sử dụng CoSpace
            </p>
          </div>

          {/* Form card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '28px 32px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Row 1: Full name + Phone (two columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Họ và tên <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    placeholder="Nguyễn Văn A"
                    style={inputBase}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="0912 345 678"
                    style={inputBase}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Email <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  style={inputBase}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Ngày sinh
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.3fr', gap: '8px' }}>
                  {/* Ngày */}
                  <div style={{ position: 'relative' }}>
                    <select
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                      style={{
                        ...inputBase,
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        paddingRight: '28px',
                        color: dobDay ? '#111111' : '#9CA3AF',
                        cursor: 'pointer',
                        backgroundColor: '#FFFFFF',
                      }}
                      onFocus={(e) => { e.target.style.border = '1px solid #3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                      onBlur={(e) => { e.target.style.border = '1px solid #D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="" disabled>Ngày</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={String(d).padStart(2, '0')}>
                          {String(d).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF', fontSize: '10px' }}>▼</span>
                  </div>

                  {/* Tháng */}
                  <div style={{ position: 'relative' }}>
                    <select
                      value={dobMonth}
                      onChange={(e) => setDobMonth(e.target.value)}
                      style={{
                        ...inputBase,
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        paddingRight: '28px',
                        color: dobMonth ? '#111111' : '#9CA3AF',
                        cursor: 'pointer',
                        backgroundColor: '#FFFFFF',
                      }}
                      onFocus={(e) => { e.target.style.border = '1px solid #3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                      onBlur={(e) => { e.target.style.border = '1px solid #D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="" disabled>Tháng</option>
                      {[
                        'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                        'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
                      ].map((m, i) => (
                        <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF', fontSize: '10px' }}>▼</span>
                  </div>

                  {/* Năm */}
                  <div style={{ position: 'relative' }}>
                    <select
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                      style={{
                        ...inputBase,
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        paddingRight: '28px',
                        color: dobYear ? '#111111' : '#9CA3AF',
                        cursor: 'pointer',
                        backgroundColor: '#FFFFFF',
                      }}
                      onFocus={(e) => { e.target.style.border = '1px solid #3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                      onBlur={(e) => { e.target.style.border = '1px solid #D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="" disabled>Năm</option>
                      {Array.from({ length: 70 }, (_, i) => 2008 - i).map((y) => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF', fontSize: '10px' }}>▼</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Password + Confirm (two columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Mật khẩu <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tối thiểu 8 ký tự"
                      style={{ ...inputBase, paddingRight: '40px' }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)',
                        border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF',
                        display: 'flex', alignItems: 'center', padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Xác nhận mật khẩu <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Nhập lại mật khẩu"
                      style={{ ...inputBase, paddingRight: '40px' }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                    <button
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{
                        position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)',
                        border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF',
                        display: 'flex', alignItems: 'center', padding: 0,
                      }}
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength hints */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '-6px' }}>
                {['8+ ký tự', 'Chữ hoa', 'Số/Ký hiệu'].map((hint) => (
                  <div key={hint} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} style={{ color: '#D1D5DB' }} />
                    <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'DM Sans, sans-serif' }}>{hint}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '2px 0' }} />

              {/* Terms checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <div style={{ position: 'relative', flexShrink: 0, marginTop: '1px' }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#111111' }}
                  />
                </div>
                <span style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.55 }}>
                  Tôi đã đọc và đồng ý với{' '}
                  <a href="#" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: '500' }}>
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="#" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: '500' }}>
                    Chính sách bảo mật
                  </a>{' '}
                  của CoSpace
                </span>
              </label>

              {/* Register button */}
              <button
                onClick={onRegister}
                disabled={!agreed}
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: agreed ? '#111111' : '#D1D5DB',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: agreed ? 'pointer' : 'not-allowed',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'opacity 0.2s',
                  marginTop: '4px',
                }}
                onMouseEnter={(e) => { if (agreed) e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={(e) => { if (agreed) e.currentTarget.style.opacity = '1'; }}
              >
                Tạo tài khoản
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'DM Sans, sans-serif' }}>HOẶC</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
              </div>

              {/* Google button (decorative) */}
              <button
                style={{
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '1px solid #D1D5DB',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                {/* Google G icon */}
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Tiếp tục với Google
              </button>
            </div>
          </div>

          {/* Login link */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
            Đã có tài khoản?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{
                color: '#3B82F6', fontWeight: '600', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', padding: 0,
              }}
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}