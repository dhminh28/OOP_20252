import { useState } from 'react';
import { Building2, Eye, EyeOff } from 'lucide-react';

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

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
};

interface LoginScreenProps {
  onLogin: () => void;
  onAdminLogin: () => void;
  onSwitchToRegister: () => void;
}

export function LoginScreen({ onLogin, onAdminLogin, onSwitchToRegister }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      fontFamily: 'DM Sans, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Building2 size={28} strokeWidth={2} style={{ color: '#111111' }} />
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#111111', letterSpacing: '-0.5px' }}>
              CoSpace
            </span>
          </div>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>Chào mừng trở lại!</p>
        </div>

        {/* Form card */}
        <div style={{ ...card, padding: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111111', marginBottom: '24px' }}>
            Đăng nhập
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                defaultValue="member@cospace.vn"
                style={inputBase}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #3B82F6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  defaultValue="password123"
                  style={{ ...inputBase, paddingRight: '40px' }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #3B82F6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" style={{ fontSize: '13px', color: '#3B82F6', textDecoration: 'none', fontWeight: '500' }}>
                Quên mật khẩu?
              </a>
            </div>

            {/* Login button */}
            <button
              onClick={onLogin}
              style={{
                height: '44px',
                borderRadius: '8px',
                backgroundColor: '#111111',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                marginTop: '8px',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Đăng nhập
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>HOẶC</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
            </div>

            {/* Admin login button */}
            <button
              onClick={onAdminLogin}
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
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              Đăng nhập với tư cách Admin
            </button>
          </div>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Chưa có tài khoản?{' '}
          <button
            onClick={onSwitchToRegister}
            style={{
              color: '#3B82F6',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            }}
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}
