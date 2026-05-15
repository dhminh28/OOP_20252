import { useState } from 'react';
import { Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { register } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

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

interface RegisterScreenProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterScreen({ onRegister, onSwitchToLogin }: RegisterScreenProps) {
  const { setSession } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!agreed) {
      setError('Ban can dong y dieu khoan');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mat khau xac nhan khong khop');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await register({ fullName, email, password, phone: phone || undefined });
      setSession(result.user, result.token);
      onRegister();
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Dang ky that bai');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif',
        backgroundColor: '#F9FAFB',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '24px', justifyContent: 'center' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            backgroundColor: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={20} strokeWidth={2.5} style={{ color: '#FFFFFF' }} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#111111', letterSpacing: '-0.4px' }}>
            CoSpace
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '28px 32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111111', letterSpacing: '-0.4px', marginBottom: '6px' }}>
            Tao tai khoan
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '22px' }}>
            Tai khoan moi se duoc tao tren backend va co vi mac dinh.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Ho va ten
                </label>
                <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nguyen Van A" style={inputBase} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  So dien thoai
                </label>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="0912345678" style={inputBase} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email
              </label>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="email@example.com" style={inputBase} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Mat khau
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="123456"
                    style={{ ...inputBase, paddingRight: '40px' }}
                  />
                  <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 0 }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Xac nhan
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Nhap lai mat khau"
                    style={{ ...inputBase, paddingRight: '40px' }}
                  />
                  <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 0 }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#111111', marginTop: '1px' }}
              />
              <span style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.55 }}>
                Toi dong y voi dieu khoan su dung CoSpace.
              </span>
            </label>

            {error && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={loading || !agreed}
              style={{
                height: '44px',
                borderRadius: '8px',
                backgroundColor: loading || !agreed ? '#9CA3AF' : '#111111',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: loading || !agreed ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading && <Loader2 size={16} />}
              {loading ? 'Dang tao...' : 'Tao tai khoan'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          Da co tai khoan?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              color: '#3B82F6', fontWeight: '600', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', padding: 0,
            }}
          >
            Dang nhap
          </button>
        </p>
      </div>
    </div>
  );
}
