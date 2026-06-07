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
  onTopUp: (amount: number) => Promise<void>;
}

export function TopUpModal({
  onClose,
  balance,
  onTopUp,
}: TopUpModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(500_000);
  const [customAmount, setCustomAmount] = useState('500.000');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const pickQuickAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(vnd(amount));
  };

  const handleTopUp = async () => {
    if (selectedAmount <= 0) {
      setError('Số tiền nạp phải lớn hơn 0.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onTopUp(selectedAmount);
      setSubmitted(true);
    } catch (topUpError) {
      setError(topUpError instanceof Error ? topUpError.message : 'Nạp tiền không thành công.');
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
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>Nạp tiền vào ví</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
              Số dư hiện tại: <span style={{ color: '#111111', fontWeight: '600' }}>{vnd(balance)} ₫</span>
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginBottom: '20px' }} />

      {submitted ? (
        <>
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #BFDBFE',
              backgroundColor: '#EFF6FF',
              color: '#1E3A8A',
              fontSize: '13px',
              lineHeight: 1.6,
              marginBottom: '18px',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '4px' }}>Đã gửi yêu cầu nạp tiền</strong>
            Yêu cầu nạp {vnd(selectedAmount)} ₫ đang chờ Admin phê duyệt. Số dư ví chỉ thay đổi sau khi yêu cầu được duyệt.
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Đóng
          </button>
        </>
      ) : (
        <>
      <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '10px' }}>Chọn số tiền nhanh</p>
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

      <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Hoặc nhập số tiền khác</p>
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
          ₫
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
          backgroundColor: '#FFFBEB',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '16px',
          color: '#92400E',
          fontSize: '12px',
          lineHeight: 1.5,
        }}
      >
        Sau khi gửi yêu cầu, vui lòng thực hiện chuyển khoản và chờ Admin xác nhận. Tiền chưa được cộng ngay vào ví.
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
        {submitting ? 'Đang gửi yêu cầu...' : `Gửi yêu cầu nạp ${vnd(selectedAmount)} ₫`}
      </button>
        </>
      )}
    </Modal>
  );
}
