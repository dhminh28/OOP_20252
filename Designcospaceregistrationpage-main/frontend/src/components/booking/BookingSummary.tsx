import { AlertTriangle, CheckCircle2, CreditCard, Loader2, MapPin, Users } from 'lucide-react';
import { WorkspaceTypeBadge } from '../common/Badge';
import { vnd } from '../../utils/formatCurrency';
import type { Workspace } from '../../types/workspace';

interface BookingSummaryProps {
  workspace: Workspace;
  onCancel: () => void;
  onConfirm: () => void;
  durationHours: number;
  pricePerHour: number;
  subtotal: number;
  discount: number;
  total: number;
  walletBalance: number;
  walletLoading?: boolean;
  submitting?: boolean;
  successMessage?: string | null;
}

export function BookingSummary({
  workspace,
  onCancel,
  onConfirm,
  durationHours,
  pricePerHour,
  subtotal,
  discount,
  total,
  walletBalance,
  walletLoading = false,
  submitting = false,
  successMessage,
}: BookingSummaryProps) {
  const shortfall = Math.max(total - walletBalance, 0);
  const disabled = submitting || walletLoading || shortfall > 0;

  return (
    <div style={{ position: 'sticky', top: '80px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px' }}>
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif', marginBottom: '14px' }}>
          Tom tat dat cho
        </p>
        <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginBottom: '14px' }} />

        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
              {workspace.name}
            </span>
            <WorkspaceTypeBadge type={workspace.type} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '4px' }}>
            <MapPin size={12} style={{ color: '#9CA3AF', marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
              {workspace.floor}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} style={{ color: '#9CA3AF' }} />
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
              Suc chua: {workspace.capacity} nguoi
            </span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginBottom: '14px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Thoi luong', value: `${durationHours} gio`, gray: false },
            { label: 'Don gia', value: `VND ${vnd(pricePerHour)}/gio`, gray: false },
            { label: 'Tam tinh', value: `VND ${vnd(subtotal)}`, gray: false },
            { label: 'Giam gia', value: `- VND ${vnd(discount)}`, gray: true },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0' }}>
              <span style={{ fontSize: '13px', color: row.gray ? '#9CA3AF' : '#6B7280', fontFamily: 'DM Sans, sans-serif' }}>
                {row.label}
              </span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: row.gray ? '#9CA3AF' : '#374151', fontFamily: 'DM Sans, sans-serif' }}>
                {row.value}
              </span>
            </div>
          ))}

          <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '6px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
              TONG CONG
            </span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#111111', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.5px' }}>
              VND {vnd(total)}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: '14px',
            backgroundColor: '#F0FDF4',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <CreditCard size={14} style={{ color: '#10B981' }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981', fontFamily: 'DM Sans, sans-serif' }}>
              {walletLoading ? 'Dang tai so du...' : `So du vi: VND ${vnd(walletBalance)}`}
            </span>
          </div>
          <CheckCircle2 size={16} style={{ color: '#10B981' }} />
        </div>

        {shortfall > 0 && (
          <div
            style={{
              marginTop: '8px',
              backgroundColor: '#FFFBEB',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertTriangle size={13} style={{ color: '#D97706', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#92400E', fontFamily: 'DM Sans, sans-serif' }}>
              So du khong du. Can nap them VND {vnd(shortfall)}
            </span>
          </div>
        )}

        {successMessage && (
          <div style={{ marginTop: '10px', backgroundColor: '#ECFDF5', color: '#047857', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' }}>
            {successMessage}
          </div>
        )}

        <button
          onClick={onConfirm}
          disabled={disabled}
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '8px',
            backgroundColor: disabled ? '#9CA3AF' : '#111111',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: '700',
            fontFamily: 'DM Sans, sans-serif',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            marginTop: '16px',
            transition: 'opacity 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {submitting && <Loader2 size={16} />}
          {submitting ? 'Dang dat cho...' : 'Xac nhan dat cho'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}
          >
            Huy bo
          </button>
        </div>
      </div>
    </div>
  );
}
