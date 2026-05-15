import { useState } from 'react';
import { Wallet, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { vnd } from '../../utils/formatCurrency';

const QUICK_AMOUNTS = [50_000, 100_000, 200_000, 500_000];

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

interface TopUpModalProps {
  onClose: () => void;
  balance: number;
  selectedAmount: number;
  setSelectedAmount: (amount: number) => void;
  customAmount: string;
  setCustomAmount: (amount: string) => void;
  onTopUp: (amount: number) => Promise<void>;
}

export function TopUpModal({
  onClose,
  balance,
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  onTopUp,
}: TopUpModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const afterBalance = balance + selectedAmount;

  const pickQuickAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(vnd(amount));
  };

  const handleTopUp = async () => {
    if (selectedAmount <= 0) {
      setError('So tien nap phai lon hon 0');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onTopUp(selectedAmount);
      onClose();
    } catch (topUpError) {
      setError(topUpError instanceof Error ? topUpError.message : 'Nap tien that bai');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wallet size={18} style={{ color: '#3B82F6' }} />
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>Nap tien vao vi</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
              So du hien tai: <span style={{ color: '#111111', fontWeight: '600' }}>VND {vnd(balance)}</span>
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginBottom: '20px' }} />

      <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '10px' }}>Chon so tien nhanh</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => pickQuickAmount(amount)}
            style={{
              height: '38px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              backgroundColor: selectedAmount === amount ? '#111111' : '#F9FAFB',
              color: selectedAmount === amount ? '#FFFFFF' : '#374151',
              border: selectedAmount === amount ? '1.5px solid #111111' : '1.5px solid #E5E7EB',
              transition: 'all 0.12s',
            }}
          >
            {vnd(amount)}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Hoac nhap so tien khac</p>
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <span
          style={{
            position: 'absolute',
            left: '11px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '14px',
            color: '#6B7280',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          VND
        </span>
        <input
          value={customAmount}
          onChange={(event) => {
            const raw = event.target.value.replace(/\./g, '');
            const numberValue = parseInt(raw, 10);

            if (!Number.isNaN(numberValue)) {
              setSelectedAmount(numberValue);
              setCustomAmount(vnd(numberValue));
            } else if (raw === '') {
              setCustomAmount('');
              setSelectedAmount(0);
            }
          }}
          style={{ ...inputBase, height: '42px', paddingLeft: '46px', fontSize: '15px', fontWeight: '600' }}
          onFocus={(event) => {
            event.target.style.border = '1px solid #3B82F6';
            event.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
          }}
          onBlur={(event) => {
            event.target.style.border = '1px solid #D1D5DB';
            event.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div
        style={{
          backgroundColor: '#F0FDF4',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '13px', color: '#374151', fontFamily: 'DM Sans, sans-serif' }}>So du sau khi nap</span>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>VND {vnd(afterBalance)}</span>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px', color: '#B91C1C', fontSize: '13px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleTopUp}
        disabled={submitting || selectedAmount <= 0}
        style={{
          width: '100%',
          height: '44px',
          borderRadius: '8px',
          backgroundColor: submitting || selectedAmount <= 0 ? '#9CA3AF' : '#111111',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: '700',
          border: 'none',
          cursor: submitting || selectedAmount <= 0 ? 'not-allowed' : 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(event) => {
          if (!submitting) event.currentTarget.style.opacity = '0.85';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.opacity = '1';
        }}
      >
        {submitting ? 'Dang nap...' : `Nap VND ${vnd(selectedAmount)}`}
      </button>
    </Modal>
  );
}
