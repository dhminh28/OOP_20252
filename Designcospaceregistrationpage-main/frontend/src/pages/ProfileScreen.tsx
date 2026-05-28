import { Calendar, Camera } from 'lucide-react';
import { WalletCard } from '../components/profile/WalletCard';
import { useAuth } from '../hooks/useAuth';

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

const inputBase: React.CSSProperties = {
  height: '38px',
  borderRadius: '6px',
  border: '1px solid #D1D5DB',
  padding: '0 10px',
  fontSize: '14px',
  color: '#111111',
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const readonlyInput: React.CSSProperties = {
  ...inputBase,
  backgroundColor: '#F9FAFB',
  color: '#6B7280',
  border: '1px solid #E5E7EB',
};

interface ProfileScreenProps {
  balance: number;
  onTopUp: () => void;
}

export function ProfileScreen({ balance, onTopUp }: ProfileScreenProps) {
  const { user } = useAuth();
  const initials = (user?.name ?? 'Member')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px 72px' }}>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111111', marginBottom: '6px' }}>
          Ho so ca nhan
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          Quan ly thong tin tai khoan va so du vi cua ban.
        </p>
      </div>

      <div style={{ ...card, padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>Thong tin ca nhan</span>
        </div>

        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {initials || 'M'}
            </div>
            <button
              style={{
                fontSize: '12px',
                color: '#3B82F6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Camera size={12} />
              Doi anh
            </button>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Ho va ten</label>
              <input defaultValue={user?.name ?? ''} style={inputBase} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Email</label>
              <input value={user?.email ?? ''} readOnly style={readonlyInput} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>So dien thoai</label>
              <input defaultValue={user?.phone ?? ''} style={inputBase} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '5px', fontWeight: '500' }}>Ngay tham gia</label>
              <div style={{ position: 'relative' }}>
                <input value="Backend account" readOnly style={{ ...readonlyInput, paddingRight: '32px' }} />
                <Calendar size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <WalletCard balance={balance} onTopUp={onTopUp} />
    </main>
  );
}
