import { Wallet } from 'lucide-react';
import { vnd } from '../../utils/formatCurrency';

interface WalletCardProps {
  balance: number;
  onTopUp: () => void;
}

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

export function WalletCard({ balance, onTopUp }: WalletCardProps) {
  return (
    <div
      style={{
        ...card,
        padding: '20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Wallet size={22} style={{ color: '#3B82F6' }} />
        </div>
        <div>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Số dư ví</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '30px', fontWeight: '700', color: '#111111', letterSpacing: '-1px', lineHeight: 1 }}>
              ₫ {vnd(balance)}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onTopUp}
        style={{
          height: '36px',
          padding: '0 18px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          color: '#111111',
          fontSize: '13px',
          fontWeight: '600',
          border: '1.5px solid #111111',
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = '#F9FAFB';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = '#FFFFFF';
        }}
      >
        Nạp tiền
      </button>
    </div>
  );
}
