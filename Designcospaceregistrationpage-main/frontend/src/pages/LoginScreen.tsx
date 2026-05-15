import { useState } from 'react';
import { Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

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
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('member@cospace.vn');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLogin = async (nextEmail = email, nextPassword = password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await login(nextEmail, nextPassword);
      setSession(result.user, result.token);
      if (result.user.role === 'admin') {
        onAdminLogin();
      } else {
        onLogin();
      }
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Dang nhap that bai');
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Building2 size={28} strokeWidth={2} style={{ color: '#111111' }} />
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#111111', letterSpacing: '-0.5px' }}>
              CoSpace
            </span>
          </div>
          <p style={{ fontSize: '15px', color: '#6B7280' }}>Dang nhap bang backend Spring Boot</p>
        </div>

        <div style={{ ...card, padding: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111111', marginBottom: '24px' }}>
            Dang nhap
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@example.com"
                style={inputBase}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Mat khau
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhap mat khau"
                  style={{ ...inputBase, paddingRight: '40px' }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') void submitLogin();
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

            {error && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <button
              onClick={() => void submitLogin()}
              disabled={loading}
              style={{
                height: '44px',
                borderRadius: '8px',
                backgroundColor: loading ? '#9CA3AF' : '#111111',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading && <Loader2 size={16} />}
              {loading ? 'Dang dang nhap...' : 'Dang nhap'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>HOAC</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
            </div>

            <button
              onClick={() => void submitLogin('admin@cospace.vn', '123456')}
              disabled={loading}
              style={{
                height: '42px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: '13px',
                fontWeight: '600',
                border: '1px solid #D1D5DB',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Dang nhap Admin demo
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Chua co tai khoan?{' '}
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
            Dang ky ngay
          </button>
        </p>
      </div>
    </div>
  );
}
